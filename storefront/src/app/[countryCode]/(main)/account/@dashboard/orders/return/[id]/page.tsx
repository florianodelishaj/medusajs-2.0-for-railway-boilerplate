import { Metadata } from "next"
import { notFound } from "next/navigation"

import ReturnRequestForm from "@modules/account/components/return-request-form"
import { retrieveOrder } from "@lib/data/orders"
import { enrichLineItems } from "@lib/data/cart"
import { listReturnReasons, listReturnShippingOptions } from "@lib/data/returns"
import { getCustomer } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"

type Props = {
  params: { id: string }
}

async function getOrder(id: string) {
  const order = await retrieveOrder(id)

  if (!order) return null

  const enrichedItems = await enrichLineItems(order.items, order.region_id!)

  return {
    ...order,
    items: enrichedItems,
  } as unknown as HttpTypes.StoreOrder
}

export async function generateMetadata(_props: Props): Promise<Metadata> {
  return {
    title: { absolute: "Richiedi reso | Il Covo di Xur" },
    robots: { index: false },
  }
}

export default async function ReturnRequestPage({ params }: Props) {
  const [orderData, customer] = await Promise.all([
    getOrder(params.id).catch(() => null),
    getCustomer(),
  ])

  if (!orderData || orderData.fulfillment_status !== "delivered") {
    notFound()
  }

  // V3/V4 — verifica che l'ordine appartenga al cliente loggato
  if (!customer || (orderData as any).customer_id !== customer.id) {
    notFound()
  }

  const RETURN_WINDOW_MS = 14 * 24 * 60 * 60 * 1000
  const fulfillments = (orderData as any).fulfillments ?? []
  const latestDeliveredAt = fulfillments
    .map((f: any) => f.delivered_at)
    .filter(Boolean)
    .sort()
    .at(-1)

  if (
    !latestDeliveredAt ||
    Date.now() - new Date(latestDeliveredAt).getTime() > RETURN_WINDOW_MS
  ) {
    notFound()
  }

  const locationId: string | null =
    fulfillments.find((f: any) => f.location_id)?.location_id ?? null

  const [returnReasons, shippingOptions] = await Promise.all([
    listReturnReasons(),
    listReturnShippingOptions((orderData as any).cart?.id),
  ])

  const returnedQuantities: Record<string, number> = {}
  for (const item of orderData.items ?? []) {
    const detail = (item as any).detail ?? {}
    const qty =
      (detail.return_requested_quantity ?? 0) +
      (detail.return_received_quantity ?? 0) +
      (detail.return_dismissed_quantity ?? 0)
    if (qty > 0) returnedQuantities[item.id] = qty
  }

  return (
    <ReturnRequestForm
      order={orderData}
      returnReasons={returnReasons}
      shippingOptions={shippingOptions}
      returnedQuantities={returnedQuantities}
      locationId={locationId}
    />
  )
}
