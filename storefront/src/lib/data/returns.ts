"use server"

import { revalidateTag } from "next/cache"
import { cache } from "react"
import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"

export const listReturnShippingOptions = cache(async function (
  cartId?: string
) {
  const query: Record<string, unknown> = { is_return: true }
  if (cartId) query.cart_id = cartId

  return sdk.client
    .fetch<{ shipping_options: any[] }>(`/store/shipping-options`, {
      method: "GET",
      query,
      headers: getAuthHeaders(),
      next: { tags: ["return-shipping-options"] },
      cache: "force-cache",
    })
    .then(({ shipping_options }) => shipping_options)
    .catch((err) => {
      console.error("[listReturnShippingOptions]", err)
      return []
    })
})

export const listReturnReasons = cache(async function () {
  return sdk.client
    .fetch<{ return_reasons: any[] }>(`/store/return-reasons`, {
      method: "GET",
      headers: getAuthHeaders(),
      next: { tags: ["return-reasons"] },
      cache: "force-cache",
    })
    .then(({ return_reasons }) => return_reasons)
    .catch(() => [])
})

export async function createReturnRequest(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error: string | null }> {
  const orderId = formData.get("order_id") as string
  const itemsJson = formData.get("items") as string
  const returnShippingOptionId = formData.get("return_shipping_option_id") as
    | string
    | null

  if (!orderId || !itemsJson || !returnShippingOptionId) {
    return { success: false, error: "Dati mancanti" }
  }

  let items: { id: string; quantity: number; reason_id?: string; note?: string }[]
  try {
    items = JSON.parse(itemsJson)
  } catch {
    return { success: false, error: "Formato dati non valido" }
  }

  if (!items.length) {
    return { success: false, error: "Seleziona almeno un articolo" }
  }

  const note = (formData.get("note") as string | null)?.trim() || undefined

  if (note) {
    items = items.map((item) => ({ ...item, note }))
  }

  const body: Record<string, unknown> = {
    order_id: orderId,
    items,
    return_shipping: { option_id: returnShippingOptionId },
  }

  const locationId = (formData.get("location_id") as string | null) || undefined
  if (locationId) {
    body.location_id = locationId
  }

  return sdk.client
    .fetch<{ return: any }>(`/store/returns`, {
      method: "POST",
      body,
      headers: getAuthHeaders(),
    })
    .then(() => {
      revalidateTag("order")
      return { success: true, error: null }
    })
    .catch((err: any) => ({
      success: false,
      error: err?.message || "Impossibile inviare la richiesta di reso",
    }))
}
