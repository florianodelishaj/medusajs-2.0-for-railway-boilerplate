"use client"

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react"
import { isEqual } from "lodash"
import { HttpTypes } from "@medusajs/types"

// Utility function to convert variant options to keymap
const optionsAsKeymap = (variantOptions: any) => {
  return variantOptions?.reduce(
    (acc: Record<string, string | undefined>, varopt: any) => {
      if (
        varopt.option &&
        varopt.value !== null &&
        varopt.value !== undefined
      ) {
        acc[varopt.option.title] = varopt.value
      }
      return acc
    },
    {}
  )
}

type ProductSelectionContextType = {
  product: HttpTypes.StoreProduct
  options: Record<string, string | undefined>
  setOptionValue: (title: string, value: string) => void
  selectedVariant?: HttpTypes.StoreProductVariant
  inStock: boolean
  isBackorder: boolean
  availableInventory: number
  disabled?: boolean
}

export const ProductSelectionContext = createContext<ProductSelectionContextType | null>(null)

export const useProductSelection = () => {
  const context = useContext(ProductSelectionContext)
  if (!context) {
    throw new Error("useProductSelection must be used within ProductSelectionProvider")
  }
  return context
}

type ProductSelectionProviderProps = {
  product: HttpTypes.StoreProduct
  cart?: HttpTypes.StoreCart | null
  disabled?: boolean
  children: ReactNode
}

export const ProductSelectionProvider = ({
  product,
  cart,
  disabled,
  children,
}: ProductSelectionProviderProps) => {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  // Find the selected variant based on current options
  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // Calculate quantity already in cart for this variant
  const quantityInCart = useMemo(() => {
    if (!selectedVariant) return 0

    return cart?.items?.reduce((acc, item) => {
      if (item.variant_id === selectedVariant.id) {
        return acc + item.quantity
      }
      return acc
    }, 0) || 0
  }, [selectedVariant, cart])

  // Calculate available inventory
  const availableInventory = useMemo(() => {
    if (!selectedVariant) return 0

    // If we don't manage inventory, return default max (10)
    if (!selectedVariant.manage_inventory) {
      return 10
    }

    // If we allow back orders, return default max (10)
    if (selectedVariant.allow_backorder) {
      return 10
    }

    // Calculate available inventory (total - already in cart)
    return Math.max(0, (selectedVariant.inventory_quantity || 0) - quantityInCart)
  }, [selectedVariant, quantityInCart])

  // Check if the selected variant is in backorder
  const isBackorder = useMemo(() => {
    if (!selectedVariant) return false
    if (!selectedVariant.manage_inventory) return false
    return !!(selectedVariant.allow_backorder && (selectedVariant.inventory_quantity || 0) <= 0)
  }, [selectedVariant])

  // Check if the selected variant is in stock
  const inStock = useMemo(() => {
    if (!selectedVariant) {
      return false
    }

    // If we don't manage inventory, we can always add to cart
    if (!selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (availableInventory > 0) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant, availableInventory])

  // Update the options when a variant is selected
  const setOptionValue = (title: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [title]: value,
    }))
  }

  const value = {
    product,
    options,
    setOptionValue,
    selectedVariant,
    inStock,
    isBackorder,
    availableInventory,
    disabled,
  }

  return (
    <ProductSelectionContext.Provider value={value}>
      {children}
    </ProductSelectionContext.Provider>
  )
}
