"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { cache } from "react"
import { getAuthHeaders } from "./cookies"

export const retrieveOrder = cache(async function (id: string) {
  return sdk.store.order
    .retrieve(
      id,
      { fields: "*payment_collections.payments,+items.*,+items.quantity,+items.detail.return_requested_quantity,+items.detail.return_received_quantity,+items.detail.return_dismissed_quantity,+items.variant.product.categories,+cart.id,+fulfillments.delivered_at,+fulfillments.location_id,+returns.status" },
      { next: { tags: ["order"] }, ...getAuthHeaders() }
    )
    .then(({ order }) => order)
    .catch((err) => medusaError(err))
})

export const listOrders = cache(async function (
  limit: number = 10,
  offset: number = 0
) {
  return sdk.store.order
    .list(
      {
        limit,
        offset,
        order: "-created_at",
        fields: "+items.*",
      },
      { next: { tags: ["order"] }, ...getAuthHeaders() }
    )
    .then(({ orders }) => orders)
    .catch((err) => medusaError(err))
})
