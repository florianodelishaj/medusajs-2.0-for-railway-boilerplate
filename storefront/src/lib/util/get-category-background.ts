/**
 * Helper function to find the top-level category from a nested category structure
 */
export function findTopLevelCategory(
  categoryId: string,
  allCategories: any[]
): any {
  // Helper function to check if a category exists in children recursively
  const findInChildren = (children: any[], categoryId: string): boolean => {
    if (!children) return false

    for (const child of children) {
      if (child.id === categoryId) return true
      if (findInChildren(child.category_children, categoryId)) {
        return true
      }
    }

    return false
  }

  // First check if it's directly a top-level category
  const topLevel = allCategories.find((cat) => cat.id === categoryId)
  if (topLevel) return topLevel

  // Otherwise search recursively in category children
  for (const topCat of allCategories) {
    if (findInChildren(topCat.category_children, categoryId)) {
      return topCat
    }
  }

  return null
}

/**
 * Get background image from a category's metadata
 */
export function getCategoryBackground(category: any): string | null {
  return category?.metadata?.backgroundImage
    ? (category.metadata.backgroundImage as string)
    : null
}

/**
 * Find top-level category by handle and get its background
 */
export function getBackgroundByHandle(
  handle: string,
  categories: any[]
): string | null {
  const category = categories.find((cat) => cat.handle === handle)
  return getCategoryBackground(category)
}
