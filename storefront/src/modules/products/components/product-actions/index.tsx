"use client"

import { ProductSelectionProvider } from "./context"
import { HttpTypes } from "@medusajs/types"
import { ReactNode } from "react"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  cart?: HttpTypes.StoreCart | null
  disabled?: boolean
  children?: ReactNode
}

export default function ProductActions({
  product,
  region,
  cart,
  disabled,
  children,
}: ProductActionsProps) {
  return (
    <ProductSelectionProvider
      product={product}
      cart={cart}
      disabled={disabled}
    >
      {children}
    </ProductSelectionProvider>
  )
}
