import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  ContainerRegistrationKeys,
  QueryContext,
  getVariantAvailability,
  MedusaContext,
} from "@medusajs/framework/utils";

/**
 * Recursively collect all category IDs including the category and all its descendants
 * Uses a recursive query approach to handle unlimited depth
 */
async function getAllCategoryIds(
  query: any,
  categoryId: string
): Promise<string[]> {
  const allIds = new Set<string>([categoryId]);

  // Helper function to recursively fetch children
  async function fetchChildren(parentId: string): Promise<void> {
    try {
      // Fetch direct children of this category
      const { data: children } = await query.graph({
        entity: "product_category",
        fields: ["id"],
        filters: { parent_category_id: parentId },
      });

      if (children && children.length > 0) {
        // Add all child IDs and recursively fetch their children
        for (const child of children) {
          allIds.add(child.id);
          await fetchChildren(child.id);
        }
      }
    } catch (error) {
      console.error(`Error fetching children for category ${parentId}:`, error);
    }
  }

  try {
    await fetchChildren(categoryId);
  } catch (error) {
    console.error("Error in getAllCategoryIds:", error);
  }

  return Array.from(allIds);
}

/**
 * Risale alla categoria root e raccoglie tutti gli ID (root + discendenti)
 * Ottimizzato per prodotti correlati: da qualsiasi sottocategoria ottieni tutti i prodotti della famiglia
 */
async function getAllCategoryIdsIncludingRoot(
  query: any,
  categoryId: string
): Promise<string[]> {
  try {
    // 1. Risali alla categoria root
    let currentId = categoryId;

    while (true) {
      const { data: categories } = await query.graph({
        entity: "product_category",
        fields: ["id", "parent_category_id"],
        filters: { id: currentId },
      });

      const category = categories?.[0];

      if (!category) {
        // Se la categoria non esiste, usa l'ID originale
        currentId = categoryId;
        break;
      }

      if (!category.parent_category_id) {
        // Trovata la root (non ha parent)
        currentId = category.id;
        break;
      }

      // Continua a risalire
      currentId = category.parent_category_id;
    }

    // 2. Raccogli la root + tutti i discendenti
    return getAllCategoryIds(query, currentId);
  } catch (error) {
    console.error("Error in getAllCategoryIdsIncludingRoot:", error);
    // Fallback: usa solo la categoria originale + discendenti
    return getAllCategoryIds(query, categoryId);
  }
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const {
    category_id,
    collection_id,
    region_id,
    currency_code,
    sort_by = "created_at",
    page = "1",
    limit = "12",
    min_price,
    max_price,
    discounted,
    include_root_family, // Se true, risale alla root e include tutti i fratelli
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  // Build base filters (only for DB-level filtering)
  const filters: any = {
    status: ["published"],
  };

  if (category_id) {
    // Get single category_id (backend now handles the recursion)
    const singleCategoryId = Array.isArray(category_id)
      ? category_id[0]
      : category_id;

    // Scegli la strategia in base al parametro include_root_family
    const categoryIds =
      include_root_family === "true"
        ? await getAllCategoryIdsIncludingRoot(
            query,
            singleCategoryId as string
          )
        : await getAllCategoryIds(query, singleCategoryId as string);

    filters.categories = {
      id: categoryIds.length === 1 ? categoryIds[0] : { $in: categoryIds },
    };
  }

  if (collection_id) {
    filters.collection_id = collection_id;
  }

  // Price filtering will be done in-memory after fetching products

  if (!region_id || !currency_code) {
    return res.status(400).json({
      error: "region_id and currency_code are required",
    });
  }

  try {
    // 1. Recupera il sales channel di default (primo attivo)
    // Per web-only, usiamo il primo sales channel abilitato
    // Il Sales Channel serve per aggregare i dati dai magazzini (Stock Locations)
    let salesChannelId: string | undefined;
    try {
      const { data: salesChannels } = await query.graph({
        entity: "sales_channel",
        fields: ["id", "name"],
        filters: { is_disabled: false }, // Solo canali attivi
      });

      salesChannelId = salesChannels?.[0]?.id;

      if (!salesChannelId) {
        console.warn(
          `No active Sales Channel found - out-of-stock products will not be filtered`
        );
      }
    } catch (error) {
      console.error("Error fetching sales channel:", error);
      salesChannelId = undefined;
    }

    // Fetch all products matching base filters (category/collection)
    const { data: allProducts } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "description",
        "handle",
        "thumbnail",
        "created_at",
        "updated_at",
        "status",
        "variants.*",
        "variants.calculated_price.*",
        "variants.manage_inventory",
        "variants.allow_backorder",
        "variants.inventory_quantity",
        "categories.*",
        "tags.*",
        "images.*",
      ],
      filters,
      context: {
        variants: {
          calculated_price: QueryContext({
            currency_code: currency_code as string,
            region_id: region_id as string,
          }),
        },
      },
    });

    let filteredProducts = allProducts || [];

    // 2. Calcola la disponibilità per tutte le varianti usando getVariantAvailability
    const variantIds = filteredProducts.flatMap(
      (p: any) => p.variants?.map((v: any) => v.id) || []
    );

    let availabilityMap: Record<string, { availability: number }> = {};

    if (variantIds.length > 0 && salesChannelId) {
      try {
        availabilityMap = await getVariantAvailability(query, {
          variant_ids: variantIds,
          sales_channel_id: salesChannelId,
        });
      } catch (error) {
        console.error("Error fetching variant availability:", error);
        // Se getVariantAvailability fallisce, continuiamo senza filtrare per inventory
      }
    }

    // Popola inventory_quantity nelle varianti usando availabilityMap
    // Questo permette al frontend di mostrare il badge "Esaurito" o filtrare i prodotti
    filteredProducts.forEach((product: any) => {
      product.variants?.forEach((variant: any) => {
        if (availabilityMap[variant.id]) {
          variant.inventory_quantity = availabilityMap[variant.id].availability;
        }
      });
    });

    // Apply discounted filter if provided
    if (discounted === "true") {
      filteredProducts = filteredProducts.filter((product) => {
        if (!product.variants || product.variants.length === 0) {
          return false;
        }

        return product.variants.some((variant: any) => {
          const calculatedPrice = variant.calculated_price;

          if (!calculatedPrice) {
            return false;
          }

          // Controlla se è di tipo "sale"
          const isSaleType = calculatedPrice.price_list_type === "sale";

          // Controlla se c'è uno sconto (original_amount > calculated_amount)
          const hasDiscount =
            calculatedPrice.original_amount &&
            calculatedPrice.calculated_amount &&
            Number(calculatedPrice.original_amount) >
              Number(calculatedPrice.calculated_amount);

          return isSaleType || hasDiscount;
        });
      });
    }

    // Apply price filtering if provided
    if (min_price || max_price) {
      const minPriceValue = min_price ? parseFloat(min_price as string) : 0;
      const maxPriceValue = max_price
        ? parseFloat(max_price as string)
        : Infinity;

      filteredProducts = filteredProducts.filter((product) => {
        // Check if any variant has a price within the range
        return product.variants?.some((variant: any) => {
          const price = variant.calculated_price?.calculated_amount;
          if (price === undefined || price === null) return false;
          return price >= minPriceValue && price <= maxPriceValue;
        });
      });
    }

    // Apply sorting
    if (sort_by === "price_asc" || sort_by === "price_desc") {
      filteredProducts = filteredProducts.sort((a, b) => {
        // Get minimum price from all variants for each product
        const getMinPrice = (product: any) => {
          const prices =
            product.variants
              ?.map((v: any) => v.calculated_price?.calculated_amount)
              .filter((p: any) => p !== undefined && p !== null) || [];
          return prices.length > 0 ? Math.min(...prices) : Infinity;
        };

        const priceA = getMinPrice(a);
        const priceB = getMinPrice(b);

        return sort_by === "price_asc" ? priceA - priceB : priceB - priceA;
      });
    } else if (sort_by === "created_at") {
      filteredProducts = filteredProducts.sort((a, b) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
    }

    // Calculate total count after filtering
    const totalCount = filteredProducts.length;

    // Apply pagination
    const offset = (pageNum - 1) * limitNum;
    const paginatedProducts = filteredProducts.slice(offset, offset + limitNum);

    return res.json({
      products: paginatedProducts,
      count: totalCount,
      offset,
      limit: limitNum,
    });
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    return res.status(500).json({
      error: "Failed to fetch products",
      message: error.message,
    });
  }
};
