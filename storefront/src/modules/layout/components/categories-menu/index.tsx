"use client"

import { ChevronRightMini } from "@medusajs/icons"
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
    <div className="flex flex-col">
      <h3 className="text-lg font-bold p-4 border border-black">Categorie</h3>
      <ul className="flex flex-col">
        {categories.map((category) => {
          const hasChildren =
            category.category_children && category.category_children.length > 0
          const isExpanded = expandedCategories.has(category.id)

          return (
            <li key={category.id}>
              <div className="flex flex-col">
                {hasChildren ? (
                  // Categoria con sottocategorie: è un bottone che espande/collassa
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center justify-between w-full text-left p-4 border border-black hover:bg-black hover:text-white font-semibold transition-none"
                    data-testid={`category-button-${category.handle}`}
                    aria-expanded={isExpanded}
                  >
                    <span>{category.name}</span>
                    <ChevronRightMini
                      className={clx(
                        "transition-none w-5 h-5",
                        isExpanded ? "rotate-90" : ""
                      )}
                    />
                  </button>
                ) : (
                  // Categoria senza sottocategorie: è un link normale
                  <LocalizedClientLink
                    href={`/categories/${category.handle}`}
                    className="block w-full text-left p-4 border border-black hover:bg-black hover:text-white font-semibold transition-none"
                    onClick={onLinkClick}
                    data-testid={`category-link-${category.handle}`}
                  >
                    {category.name}
                  </LocalizedClientLink>
                )}
                {hasChildren && isExpanded && (
                  <ul className="flex flex-col bg-gray-50">
                    {category.category_children?.map((child) => (
                      <li key={child.id}>
                        <LocalizedClientLink
                          href={`/categories/${child.handle}`}
                          className="block w-full text-left pl-8 pr-4 py-3 border-b border-gray-300 hover:bg-black hover:text-white font-medium transition-none"
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
