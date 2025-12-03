"use client"

import { ChevronDownMini } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useState } from "react"

type CategoriesMenuProps = {
  categories: HttpTypes.StoreProductCategory[]
  onLinkClick?: () => void
}

export default function CategoriesMenu({
  categories,
  onLinkClick,
}: CategoriesMenuProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  )

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-base-semi text-ui-fg-subtle mb-2">Categorie</h3>
      <ul className="flex flex-col gap-1">
        {categories.map((category) => {
          const hasChildren =
            category.category_children && category.category_children.length > 0
          const isExpanded = expandedCategories.has(category.id)

          return (
            <li key={category.id}>
              <div className="flex flex-col gap-1">
                {hasChildren ? (
                  // Categoria con sottocategorie: è un bottone che espande/collassa
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center justify-between w-full text-left text-base-regular hover:text-ui-fg-base py-1 group"
                    data-testid={`category-button-${category.handle}`}
                    aria-expanded={isExpanded}
                  >
                    <span>{category.name}</span>
                    <ChevronDownMini
                      className={clx(
                        "transition-transform duration-200",
                        isExpanded ? "rotate-180" : ""
                      )}
                    />
                  </button>
                ) : (
                  // Categoria senza sottocategorie: è un link normale
                  <LocalizedClientLink
                    href={`/categories/${category.handle}`}
                    className="text-base-regular hover:text-ui-fg-base py-1 block"
                    onClick={onLinkClick}
                    data-testid={`category-link-${category.handle}`}
                  >
                    {category.name}
                  </LocalizedClientLink>
                )}
                {hasChildren && isExpanded && (
                  <ul className="flex flex-col gap-1 pl-4 border-l border-ui-border-base">
                    {category.category_children?.map((child) => (
                      <li key={child.id}>
                        <LocalizedClientLink
                          href={`/categories/${child.handle}`}
                          className="text-small-regular text-ui-fg-subtle hover:text-ui-fg-base py-1 block"
                          onClick={onLinkClick}
                          data-testid={`category-link-${child.handle}`}
                        >
                          {child.name}
                        </LocalizedClientLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
