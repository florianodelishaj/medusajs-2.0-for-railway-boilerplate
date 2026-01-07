"use client"

import { useEffect } from "react"
import { useSearchFilters } from "@lib/context/search-filters-context"
import { HttpTypes } from "@medusajs/types"

interface ProductCategoryContextProps {
  category: HttpTypes.StoreProductCategory | null
}

/**
 * Componente che setta la categoria del prodotto nel SearchFilters context
 * per mostrare il colore corretto nella barra di ricerca
 */
export function ProductCategoryContext({
  category,
}: ProductCategoryContextProps) {
  const { setProductCategory } = useSearchFilters()

  useEffect(() => {
    setProductCategory(category)

    // Cleanup: rimuovi la categoria quando il componente viene smontato
    return () => {
      setProductCategory(null)
    }
  }, [category, setProductCategory])

  return null
}
