"use client"

import { HttpTypes } from "@medusajs/types"
import { Categories } from "./categories"
import { SearchWithResults } from "./search-with-results"
import { useMemo, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Input } from "@components/ui/input"
import { MagnifyingGlassMini } from "@medusajs/icons"
import { useSearchFilters } from "@lib/context/search-filters-context"

interface Props {
  categories: HttpTypes.StoreProductCategory[]
}

export const SearchFilters = ({ categories }: Props) => {
  const { productCategory } = useSearchFilters()
  const [isSearchMounted, setIsSearchMounted] = useState(false)
  const params = useParams()

  useEffect(() => {
    setIsSearchMounted(true)
  }, [])

  // Find the active category and its hierarchy from URL params
  const { currentCategory, categoryHierarchy, activeCategory } = useMemo(() => {
    const categorySegments = params?.category as string[] | undefined
    if (!categorySegments || categorySegments.length === 0)
      return {
        currentCategory: null,
        categoryHierarchy: [],
        activeCategory: null,
      }

    let current: HttpTypes.StoreProductCategory | undefined
    let currentLevel = categories
    const hierarchy: HttpTypes.StoreProductCategory[] = []

    for (const segment of categorySegments) {
      current = currentLevel.find((cat) => cat.handle === segment)
      if (!current) {
        return {
          currentCategory: null,
          categoryHierarchy: [],
          activeCategory: null,
        }
      }
      hierarchy.push(current)
      currentLevel =
        (current.category_children as HttpTypes.StoreProductCategory[]) || []
    }

    return {
      currentCategory: current || null,
      categoryHierarchy: hierarchy,
      activeCategory: hierarchy[0] || null,
    }
  }, [params, categories])

  const backgroundColor =
    (productCategory?.metadata?.color as string) ||
    (activeCategory?.metadata?.color as string) ||
    "#F4F4F0"

  return (
    <div
      className="px-4 lg:px-12 py-8 border-b border-black flex flex-col gap-4 w-full transition-colors duration-300"
      style={{ backgroundColor }}
    >
      <div className="relative w-full">
        <div
          className={`transition-opacity duration-200 ${
            isSearchMounted ? "opacity-0 pointer-events-none absolute inset-0" : "opacity-100"
          }`}
        >
          <div className="relative w-full">
            <MagnifyingGlassMini className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 z-10" />
            <Input
              type="search"
              placeholder="Cerca prodotti..."
              disabled
              className="pl-12"
            />
          </div>
        </div>
        <div
          className={`transition-opacity duration-200 ${
            isSearchMounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <SearchWithResults />
        </div>
      </div>

      <div className="hidden lg:block">
        <Categories data={categories} onViewAllClick={() => {}} />
      </div>

      {/* Breadcrumb per categoria attiva */}
      {currentCategory && categoryHierarchy.length > 0 && (
        <div className="flex flex-row text-xl gap-1.5 items-center flex-wrap">
          {categoryHierarchy.map((cat, index) => {
            const isLast = index === categoryHierarchy.length - 1
            const categoryPath = categoryHierarchy
              .slice(0, index + 1)
              .map((c) => c.handle)
              .join("/")

            return (
              <div key={cat.id} className="flex items-center gap-1.5">
                {isLast ? (
                  <p className="font-medium">{cat.name}</p>
                ) : (
                  <>
                    <LocalizedClientLink
                      className="hover:text-black underline"
                      href={`/categories/${categoryPath}`}
                    >
                      {cat.name}
                    </LocalizedClientLink>
                    <span className="text-primary font-medium text-lg">
                      /
                    </span>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
