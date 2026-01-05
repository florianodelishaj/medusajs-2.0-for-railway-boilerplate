import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, QueryContext } from "@medusajs/framework/utils"

/**
 * Endpoint custom per recuperare prodotti scontati.
 * Filtra lato server i prodotti che hanno price_list_type === "sale"
 * o original_amount > calculated_amount
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    region_id,
    currency_code,
    limit = "12",
  } = req.query

  const limitNum = parseInt(limit as string)
  // Fetch più prodotti del limite per avere abbastanza dopo il filtro
  const fetchLimit = limitNum * 3

  if (!region_id || !currency_code) {
    return res.status(400).json({
      error: "region_id and currency_code are required",
    })
  }

  try {
    // Fetch products with calculated prices
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
        "categories.*",
        "tags.*",
        "images.*",
      ],
      filters: {
        status: ["published"],
      },
      context: {
        variants: {
          calculated_price: QueryContext({
            currency_code: currency_code as string,
            region_id: region_id as string,
          }),
        },
      },
    })

    let products = allProducts || []

    // Filtra i prodotti che hanno almeno una variante scontata
    const discountedProducts = products.filter((product) => {
      if (!product.variants || product.variants.length === 0) {
        return false
      }

      return product.variants.some((variant: any) => {
        const calculatedPrice = variant.calculated_price

        if (!calculatedPrice) {
          return false
        }

        // Controlla se è di tipo "sale"
        const isSaleType = calculatedPrice.price_list_type === "sale"

        // Controlla se c'è uno sconto (original_amount > calculated_amount)
        const hasDiscount =
          calculatedPrice.original_amount &&
          calculatedPrice.calculated_amount &&
          Number(calculatedPrice.original_amount) >
            Number(calculatedPrice.calculated_amount)

        return isSaleType || hasDiscount
      })
    })

    // Limita al numero richiesto
    const limitedProducts = discountedProducts.slice(0, limitNum)

    return res.json({
      products: limitedProducts,
      count: discountedProducts.length,
    })
  } catch (error) {
    console.error("Error fetching discounted products:", error)
    return res.status(500).json({
      error: "Failed to fetch discounted products",
      message: error.message,
    })
  }
}
