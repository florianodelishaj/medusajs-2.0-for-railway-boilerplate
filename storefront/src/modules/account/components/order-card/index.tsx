"use client"

import { useMemo } from "react"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@components/ui/button"
import { ArrowRight } from "lucide-react"
import { useSearchFilters } from "@lib/context/search-filters-context"
import { findTopLevelCategory } from "@lib/util/get-category-background"
import { translateStatus, getStatusBg } from "@lib/util/order-status"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const { productCategory, categories: allCategories } = useSearchFilters()

  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  const getCategoryColor = (item: HttpTypes.StoreOrderLineItem) => {
    const productCategories = (item as any).variant?.product?.categories as
      | any[]
      | undefined
    return (
      (productCategory?.metadata?.color as string | undefined) ??
      (productCategories?.[0]?.id
        ? (findTopLevelCategory(productCategories[0].id, allCategories)
            ?.metadata?.color as string | undefined)
        : undefined)
    )
  }

  const fulfillmentStatus = (order as any).fulfillment_status as
    | string
    | undefined
  const paymentStatus = (order as any).payment_status as string | undefined

  return (
    <div
      className="bg-white border border-black rounded-md overflow-hidden flex flex-col"
      data-testid="order-card"
    >
      {/* Green header */}
      <div className="bg-green-400 border-b-2 border-black px-4 py-2.5 flex items-center justify-between">
        <span
          className="text-sm font-black uppercase"
          data-testid="order-display-id"
        >
          #{order.display_id}
        </span>
        <span
          className="text-sm font-medium text-black/70"
          data-testid="order-created-at"
        >
          {new Date(order.created_at).toLocaleDateString("it-IT", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Body */}
      <div className="p-6 flex gap-6 items-start">
        {/* Thumbnails */}
        <div className="flex gap-2 flex-1 min-w-0 flex-wrap">
          {order.items?.slice(0, 3).map((i) => {
            const color = getCategoryColor(i)
            return (
              <div
                key={i.id}
                className="relative w-24 shrink-0 border border-black rounded-md overflow-hidden"
                data-testid="order-item"
              >
                {color && (
                  <div
                    className="absolute inset-y-0 left-0 w-1 z-10"
                    style={{ backgroundColor: color }}
                  />
                )}
                <Thumbnail
                  thumbnail={i.thumbnail}
                  images={[]}
                  size="square"
                  className="!w-full"
                />
              </div>
            )
          })}
          {numberOfProducts > 3 && (
            <div className="w-24 h-24 shrink-0 flex flex-col items-center justify-center bg-[#F4F4F0] border border-black rounded-md text-sm font-bold gap-0.5">
              <span>+{numberOfProducts - 3}</span>
              <span className="text-xs text-black/50 font-normal">altri</span>
            </div>
          )}
        </div>

        {/* Amount + CTA */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="text-right">
            <p className="text-xl font-black" data-testid="order-amount">
              {convertToLocale({
                amount: order.total,
                currency_code: order.currency_code,
              })}
            </p>
            <p className="text-xs text-black/50">
              {numberOfLines} {numberOfLines > 1 ? "articoli" : "articolo"}
            </p>
          </div>
          {fulfillmentStatus && (
            <span
              className={`text-xs font-bold uppercase px-2 py-0.5 rounded border border-black ${getStatusBg(
                fulfillmentStatus
              )}`}
            >
              {translateStatus(fulfillmentStatus, "fulfillment")}
            </span>
          )}
          {paymentStatus && (
            <span
              className={`text-xs font-bold uppercase px-2 py-0.5 rounded border border-black ${getStatusBg(
                paymentStatus
              )}`}
            >
              {translateStatus(paymentStatus, "payment")}
            </span>
          )}
          <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
            <Button
              data-testid="order-details-link"
              variant="elevated"
              size="sm"
              className="hover:bg-green-400 font-black uppercase flex items-center gap-1.5"
            >
              Dettagli <ArrowRight size={13} strokeWidth={3} />
            </Button>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default OrderCard
