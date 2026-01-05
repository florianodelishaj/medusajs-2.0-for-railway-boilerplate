import { useMemo } from "react"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@components/ui/button"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
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

  return (
    <div
      className="bg-white border border-black rounded-md p-6 flex flex-col"
      data-testid="order-card"
    >
      <div className="uppercase text-xl font-bold mb-2">
        #<span data-testid="order-display-id">{order.display_id}</span>
      </div>
      <div className="flex items-center divide-x divide-black text-sm text-gray-700">
        <span className="pr-3" data-testid="order-created-at">
          {new Date(order.created_at).toLocaleDateString("it-IT")}
        </span>
        <span
          className="px-3 font-semibold text-black"
          data-testid="order-amount"
        >
          {convertToLocale({
            amount: order.total,
            currency_code: order.currency_code,
          })}
        </span>
        <span className="pl-3">{`${numberOfLines} ${
          numberOfLines > 1 ? "articoli" : "articolo"
        }`}</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 my-6 max-w-xl">
        {order.items?.slice(0, 3).map((i) => {
          return (
            <div
              key={i.id}
              className="flex flex-col gap-y-1"
              data-testid="order-item"
            >
              <Thumbnail thumbnail={i.thumbnail} images={[]} size="small" className="!w-full" />
              <div className="flex items-center text-sm text-gray-700">
                <span
                  className="text-black font-semibold"
                  data-testid="item-title"
                >
                  {i.title}
                </span>
                <span className="ml-2">x</span>
                <span data-testid="item-quantity">{i.quantity}</span>
              </div>
            </div>
          )
        })}
        {numberOfProducts > 4 && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 border border-black rounded-md">
            <span className="text-sm font-bold">+ {numberOfLines - 4}</span>
            <span className="text-sm text-gray-700">altri</span>
          </div>
        )}
      </div>
      <div className="flex justify-end border-t border-black pt-4">
        <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
          <Button
            data-testid="order-details-link"
            variant="elevated"
            className="hover:bg-green-400"
          >
            Vedi dettagli
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard
