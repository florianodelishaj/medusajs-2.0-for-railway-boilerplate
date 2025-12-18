"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  addToCart as addToCartAction,
  updateLineItem as updateLineItemAction,
  deleteLineItem as deleteLineItemAction,
  applyPromotions as applyPromotionsAction,
} from "@lib/data/cart"

/**
 * Hook for adding items to cart with automatic error handling
 */
export function useAddToCart() {
  const [isAdding, setIsAdding] = useState(false)

  const addToCart = async (params: {
    variantId: string
    quantity: number
    countryCode: string
  }) => {
    setIsAdding(true)
    try {
      await addToCartAction(params)
    } catch (error: any) {
      const errorMessage =
        error?.message || "Impossibile aggiungere il prodotto al carrello"
      toast.error(errorMessage)
      throw error
    } finally {
      setIsAdding(false)
    }
  }

  return { addToCart, isAdding }
}

/**
 * Hook for updating line item quantity with automatic error handling
 */
export function useUpdateLineItem() {
  const [isUpdating, setIsUpdating] = useState(false)

  const updateLineItem = async (params: {
    lineId: string
    quantity: number
  }) => {
    setIsUpdating(true)
    try {
      await updateLineItemAction(params)
    } catch (error: any) {
      const errorMessage =
        error?.message || "Impossibile aggiornare la quantità"
      toast.error(errorMessage)
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  return { updateLineItem, isUpdating }
}

/**
 * Hook for deleting line items with automatic error handling
 */
export function useDeleteLineItem() {
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteLineItem = async (lineId: string) => {
    setIsDeleting(true)
    try {
      await deleteLineItemAction(lineId)
    } catch (error: any) {
      const errorMessage =
        error?.message || "Impossibile rimuovere il prodotto"
      toast.error(errorMessage)
      throw error
    } finally {
      setIsDeleting(false)
    }
  }

  return { deleteLineItem, isDeleting }
}

/**
 * Hook for applying promotions with automatic error handling
 */
export function useApplyPromotions() {
  const [isApplying, setIsApplying] = useState(false)

  const applyPromotions = async (codes: string[]) => {
    setIsApplying(true)
    try {
      await applyPromotionsAction(codes)
    } catch (error: any) {
      const errorMessage =
        error?.message || "Impossibile applicare il codice promozionale"
      toast.error(errorMessage)
      throw error
    } finally {
      setIsApplying(false)
    }
  }

  return { applyPromotions, isApplying }
}
