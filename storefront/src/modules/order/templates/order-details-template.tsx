"use client"

import { ArrowLeft } from "lucide-react"
import React from "react"
import { clx } from "@medusajs/ui"

import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { Button } from "@components/ui/button"
import { HttpTypes } from "@medusajs/types"
import { useSearchFilters } from "@lib/context/search-filters-context"
import { findTopLevelCategory } from "@lib/util/get-category-background"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const RETURN_WINDOW_MS = 14 * 24 * 60 * 60 * 1000

function returnItemBadge(detail: any): { label: string; className: string } {
  const requested: number = detail?.return_requested_quantity ?? 0
  const received: number = detail?.return_received_quantity ?? 0
  const dismissed: number = detail?.return_dismissed_quantity ?? 0

  if (dismissed > 0 && dismissed >= requested)
    return {
      label: "Rifiutato",
      className: "bg-red-100 text-red-700 border-red-300",
    }
  if (received >= requested && received > 0)
    return {
      label: "Ricevuto",
      className: "bg-green-400 text-black border-black",
    }
  if (received > 0)
    return {
      label: "Parz. ricevuto",
      className: "bg-yellow-200 text-black border-black",
    }
  return {
    label: "Richiesto",
    className: "bg-white text-black border-black",
  }
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  const { categories: allCategories } = useSearchFilters()
  const latestDeliveredAt = ((order as any).fulfillments ?? [])
    .map((f: any) => f.delivered_at)
    .filter(Boolean)
    .sort()
    .at(-1)

  const canReturn =
    order.fulfillment_status === "delivered" &&
    !!latestDeliveredAt &&
    Date.now() - new Date(latestDeliveredAt).getTime() <= RETURN_WINDOW_MS

  const returnedItems = (order.items ?? []).filter((item: any) => {
    const d = (item as any).detail
    return (
      (d?.return_requested_quantity ?? 0) > 0 ||
      (d?.return_received_quantity ?? 0) > 0 ||
      (d?.return_dismissed_quantity ?? 0) > 0
    )
  })

  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex gap-2 justify-between items-center mb-4">
        <h1 className="text-2xl font-black uppercase">Dettagli ordine</h1>
        <Button variant="elevated" size="sm" asChild>
          <LocalizedClientLink
            href="/account/orders"
            className="flex items-center gap-1.5 font-black uppercase hover:bg-green-400"
            data-testid="back-to-overview-button"
          >
            <ArrowLeft size={14} strokeWidth={3} /> Ordini
          </LocalizedClientLink>
        </Button>
      </div>
      <div
        className="flex flex-col gap-6 bg-white border border-black rounded-md p-6"
        data-testid="order-details-container"
      >
        <OrderDetails order={order} showStatus />
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black uppercase tracking-wider border-l-4 border-green-400 pl-2">
              Articoli
            </h2>
            {canReturn && (
              <Button variant="elevated" size="sm" asChild>
                <LocalizedClientLink
                  href={`/account/orders/return/${order.id}`}
                  className="flex items-center gap-1.5 font-black uppercase hover:bg-green-400"
                >
                  Richiedi reso
                </LocalizedClientLink>
              </Button>
            )}
          </div>
          <Items items={order.items} currencyCode={order.currency_code} />
        </div>

        {returnedItems.length > 0 && (
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider mb-3 border-l-4 border-green-400 pl-2">
              Resi richiesti
            </h2>
            <div className="flex flex-col gap-2">
              {returnedItems.map((item: any) => {
                const productCategories = item.variant?.product?.categories as any[] | undefined
                const categoryColor = productCategories?.[0]?.id
                  ? (findTopLevelCategory(productCategories[0].id, allCategories)?.metadata?.color as string | undefined)
                  : undefined
                const detail = item.detail
                const received: number = detail?.return_received_quantity ?? 0
                const requested: number = detail?.return_requested_quantity ?? 0
                const dismissed: number = detail?.return_dismissed_quantity ?? 0
                // total = received + still pending + dismissed
                const total = received + requested + dismissed
                // Show "X/Y" only when partially received (some still pending)
                const qtyLabel =
                  received > 0 && requested > 0
                    ? `${received}/${total}`
                    : `${total}`
                const badge = returnItemBadge(detail)
                return (
                  <div
                    key={item.id}
                    className="relative flex items-center gap-3 border border-black rounded-md p-3 bg-white overflow-hidden"
                  >
                    {categoryColor && (
                      <div
                        className="absolute inset-y-0 left-0 w-1"
                        style={{ backgroundColor: categoryColor }}
                      />
                    )}
                    <div className="w-16 h-16 shrink-0">
                      <Thumbnail thumbnail={item.thumbnail} size="square" />
                    </div>
                    <p className="flex-1 min-w-0 text-sm font-bold truncate">
                      {item.title}
                    </p>
                    <span className="text-sm font-black shrink-0">
                      {qtyLabel}×
                    </span>
                    <span
                      className={clx(
                        "shrink-0 text-xs font-black uppercase px-2 py-0.5 rounded border",
                        badge.className
                      )}
                    >
                      {badge.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <ShippingDetails order={order} />
        <OrderSummary order={order} />
        <Help />
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
