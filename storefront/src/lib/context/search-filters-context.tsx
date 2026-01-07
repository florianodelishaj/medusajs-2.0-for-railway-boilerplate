"use client"

import { HttpTypes } from "@medusajs/types"
import { createContext, useContext, ReactNode, useState } from "react"

interface SearchFiltersContextType {
  productCategory: HttpTypes.StoreProductCategory | null
  setProductCategory: (category: HttpTypes.StoreProductCategory | null) => void
}

const SearchFiltersContext = createContext<SearchFiltersContextType | undefined>(
  undefined
)

export function SearchFiltersProvider({ children }: { children: ReactNode }) {
  const [productCategory, setProductCategory] =
    useState<HttpTypes.StoreProductCategory | null>(null)

  return (
    <SearchFiltersContext.Provider
      value={{ productCategory, setProductCategory }}
    >
      {children}
    </SearchFiltersContext.Provider>
  )
}

export function useSearchFilters() {
  const context = useContext(SearchFiltersContext)
  if (context === undefined) {
    throw new Error(
      "useSearchFilters must be used within a SearchFiltersProvider"
    )
  }
  return context
}
