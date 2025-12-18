"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  setShippingMethod as setShippingMethodAction,
  initiatePaymentSession as initiatePaymentSessionAction,
  placeOrder as placeOrderAction,
} from "@lib/data/cart"
import { resetOnboardingState as resetOnboardingStateAction } from "@lib/data/onboarding"
import { HttpTypes } from "@medusajs/types"

/**
 * Hook for setting shipping method with automatic error handling
 */
export function useSetShippingMethod() {
  const [isLoading, setIsLoading] = useState(false)

  const setShippingMethod = async (params: {
    cartId: string
    shippingMethodId: string
  }) => {
    setIsLoading(true)
    try {
      await setShippingMethodAction(params)
    } catch (error: any) {
      const errorMessage =
        error?.message || "Impossibile impostare il metodo di spedizione"
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { setShippingMethod, isLoading }
}

/**
 * Hook for initiating payment session with automatic error handling
 */
export function useInitiatePaymentSession() {
  const [isLoading, setIsLoading] = useState(false)

  const initiatePaymentSession = async (
    cart: HttpTypes.StoreCart,
    data: {
      provider_id: string
      context?: Record<string, unknown>
    }
  ) => {
    setIsLoading(true)
    try {
      const result = await initiatePaymentSessionAction(cart, data)
      return result
    } catch (error: any) {
      const errorMessage =
        error?.message || "Impossibile iniziare la sessione di pagamento"
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { initiatePaymentSession, isLoading }
}

/**
 * Hook for placing order with automatic error handling
 */
export function usePlaceOrder() {
  const [isLoading, setIsLoading] = useState(false)

  const placeOrder = async () => {
    setIsLoading(true)
    try {
      const result = await placeOrderAction()
      return result
    } catch (error: any) {
      const errorMessage =
        error?.message || "Impossibile completare l'ordine"
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { placeOrder, isLoading }
}

/**
 * Hook for resetting onboarding state with automatic error handling
 */
export function useResetOnboardingState() {
  const [isResetting, setIsResetting] = useState(false)

  const resetOnboarding = async (orderId: string) => {
    setIsResetting(true)
    try {
      await resetOnboardingStateAction(orderId)
    } catch (error: any) {
      const errorMessage =
        error?.message || "Impossibile resettare lo stato di onboarding"
      toast.error(errorMessage)
      throw error
    } finally {
      setIsResetting(false)
    }
  }

  return { resetOnboarding, isResetting }
}
