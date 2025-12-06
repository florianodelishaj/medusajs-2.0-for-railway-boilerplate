import { sdk } from "@lib/config"
import { cache } from "react"

export const listCategories = cache(async function () {
  return sdk.store.category
    .list({ fields: "+category_children" }, { next: { tags: ["categories"] } })
    .then(({ product_categories }) => product_categories)
})

/**
 * Recupera solo le categorie top-level (senza parent) con i loro figli e metadata
 */
export const getTopLevelCategories = cache(async function () {
  const result = await sdk.store.category.list(
    {
      parent_category_id: "null",
      include_descendants_tree: true,
      fields: "+category_children,+metadata,+category_children.metadata",
    },
    { next: { tags: ["categories"] } }
  )

  return result.product_categories
})

export const getCategoriesList = cache(async function (
  offset: number = 0,
  limit: number = 100
) {
  return sdk.store.category.list(
    // TODO: Look into fixing the type
    // @ts-ignore
    { limit, offset },
    { next: { tags: ["categories"] } }
  )
})

export const getCategoryByHandle = cache(async function (
  categoryHandle: string[]
) {
  const result = await sdk.store.category.list(
    // TODO: Look into fixing the type
    // @ts-ignore
    {
      handle: categoryHandle,
      include_descendants_tree: true,
      fields: "+category_children",
    },
    { next: { tags: ["categories"] } }
  )

  // Sort categories to match URL path order
  const categoryMap = new Map(
    result.product_categories.map((cat) => [cat.handle, cat])
  )
  const sortedCategories = categoryHandle
    .map((handle) => categoryMap.get(handle))
    .filter((cat): cat is NonNullable<typeof cat> => cat !== undefined)

  return {
    ...result,
    product_categories: sortedCategories,
  }
})
