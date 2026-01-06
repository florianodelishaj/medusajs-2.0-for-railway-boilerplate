import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { cache } from "react"
import { getRegion } from "./regions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export const getProductsById = cache(async function ({
  ids,
  regionId,
  cartId,
}: {
  ids: string[]
  regionId: string
  cartId?: string
}) {
  return sdk.store.product
    .list(
      {
        id: ids,
        region_id: regionId,
        cart_id: cartId,
        fields: "*variants.calculated_price,+variants.inventory_quantity,*categories",
      },
      {
        next: { tags: ["products"] }
      } as any
    )
    .then(({ products }) => products)
})

export const getProductByHandle = cache(async function (
  handle: string,
  regionId: string
) {
  return sdk.store.product
    .list(
      {
        handle,
        region_id: regionId,
        fields: "*variants.calculated_price,+variants.inventory_quantity,*categories",
      },
      {
        next: { tags: ["products"] }
      } as any
    )
    .then(({ products }) => products[0])
})

export const getProductsList = cache(async function ({
  pageParam = 1,
  queryParams,
  countryCode,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> {
  const limit = queryParams?.limit || 12
  const validPageParam = Math.max(pageParam, 1)
  const offset = (validPageParam - 1) * limit
  const region = await getRegion(countryCode)

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }
  return sdk.store.product
    .list(
      {
        limit,
        offset,
        region_id: region.id,
        fields: "*variants.calculated_price",
        ...queryParams,
      },
      {
        next: { tags: ["products"] }
      } as any
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
})

/**
 * This will fetch filtered and sorted products from the custom API endpoint.
 */
export const getProductsListWithSort = cache(async function ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  minPrice,
  maxPrice,
  discounted,
  includeRootFamily = false,
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  minPrice?: string
  maxPrice?: string
  discounted?: string
  includeRootFamily?: boolean
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> {
  const limit = queryParams?.limit || 12
  const region = await getRegion(countryCode)

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  // Build query params for custom API
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    region_id: region.id,
    currency_code: region.currency_code,
    sort_by: sortBy,
  })

  if (queryParams && "category_id" in queryParams) {
    const categoryId = queryParams.category_id
    if (Array.isArray(categoryId) && categoryId.length > 0) {
      // Pass only the first category_id (backend handles subcategories recursively)
      params.append("category_id", categoryId[0])
    } else if (typeof categoryId === "string") {
      params.append("category_id", categoryId)
    }
  }

  if (queryParams && "collection_id" in queryParams) {
    const collectionId = queryParams.collection_id
    if (Array.isArray(collectionId) && collectionId.length > 0) {
      params.append("collection_id", collectionId[0])
    } else if (typeof collectionId === "string") {
      params.append("collection_id", collectionId)
    }
  }

  if (minPrice) {
    params.append("min_price", minPrice)
  }

  if (maxPrice) {
    params.append("max_price", maxPrice)
  }

  if (discounted === "true") {
    params.append("discounted", "true")
  }

  if (includeRootFamily) {
    params.append("include_root_family", "true")
  }

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
    }/store/products-filtered?${params.toString()}`,
    {
      headers: {
        "x-publishable-api-key":
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
      next: { tags: ["products"] } as any
    }
  )

  if (!response.ok) {
    console.error("Failed to fetch filtered products:", await response.text())
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const data = await response.json()
  const { products, count } = data

  const nextPage = count > page * limit ? page + 1 : null

  return {
    response: {
      products,
      count,
    },
    nextPage,
    queryParams,
  }
})

/**
 * Recupera i prodotti scontati usando getProductsListWithSort
 * Riusa la logica esistente per coerenza
 */
export const getDiscountedProducts = cache(async function (
  countryCode: string,
  limit: number = 12
): Promise<{ products: HttpTypes.StoreProduct[]; count: number }> {
  const {
    response: { products, count },
  } = await getProductsListWithSort({
    page: 1,
    queryParams: {
      limit,
    },
    discounted: "true",
    countryCode,
  })

  return { products, count }
})
