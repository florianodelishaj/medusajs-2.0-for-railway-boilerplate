import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (amount === null || amount === undefined) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  return (
    <div className="py-6 border-b border-black">
      <h2 className="text-xl font-black uppercase mb-4">Riepilogo ordine</h2>
      <div className="text-base">
        <div className="flex items-center justify-between mb-3">
          <span className="text-black/60">Subtotale</span>
          <span className="font-semibold">{getAmount(order.subtotal)}</span>
        </div>
        <div className="flex flex-col gap-y-2">
          {order.discount_total > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-black/60">Sconto</span>
              <span className="font-semibold text-green-600">
                - {getAmount(order.discount_total)}
              </span>
            </div>
          )}
          {order.gift_card_total > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-black/60">Carta regalo</span>
              <span className="font-semibold text-green-600">
                - {getAmount(order.gift_card_total)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-black/60">Spedizione</span>
            <span className="font-semibold">
              {getAmount(order.shipping_total)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/60">Tasse (IVA)</span>
            <span className="font-semibold">{getAmount(order.tax_total)}</span>
          </div>
        </div>
        <div className="h-px w-full border-b border-black my-4" />
        <div className="flex items-center justify-between text-lg">
          <span className="font-black uppercase">Totale</span>
          <span className="font-bold">{getAmount(order.total)}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
