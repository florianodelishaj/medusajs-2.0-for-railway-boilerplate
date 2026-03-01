"use client"

import { HttpTypes } from "@medusajs/types"
import { createContext, useContext, ReactNode, useState } from "react"

interface SearchFiltersContextType {
  productCategory: HttpTypes.StoreProductCategory | null
  setProductCategory: (category: HttpTypes.StoreProductCategory | null) => void
  categories: HttpTypes.StoreProductCategory[]
}

const SearchFiltersContext = createContext<SearchFiltersContextType | undefined>(
  undefined
)

export function SearchFiltersProvider({
  children,
  categories = [],
}: {
  children: ReactNode
  categories?: HttpTypes.StoreProductCategory[]
}) {
  const [productCategory, setProductCategory] =
    useState<HttpTypes.StoreProductCategory | null>(null)

  return (
    <SearchFiltersContext.Provider
      value={{ productCategory, setProductCategory, categories }}
    >
      {children}
    </SearchFiltersContext.Provider>
  )
}

export function useSearchFilters() {
  const context = useContext(SearchFiltersContext)
  if (context === undefined) {
    return {
      productCategory: null,
      setProductCategory: () => {},
      categories: [] as HttpTypes.StoreProductCategory[],
    }
  }
  return context
}
