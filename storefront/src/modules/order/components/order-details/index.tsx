import { HttpTypes } from "@medusajs/types"
import { translateStatus, getStatusBg } from "@lib/util/order-status"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {

  return (
    <div className="pb-4 border-b border-black/10">
      <div className="flex items-start justify-between gap-4 mb-3">
        <p className="text-2xl font-black uppercase" data-testid="order-id">
          #{order.display_id}
        </p>
        {showStatus && (
          <div className="flex gap-2 flex-wrap justify-end">
            {(order as any).fulfillment_status && (
              <span
                className={`text-xs font-bold uppercase px-2 py-1 rounded border border-black ${getStatusBg(
                  (order as any).fulfillment_status,
                  )}`}
                data-testid="order-status"
              >
                {translateStatus(
                  (order as any).fulfillment_status,
                  "fulfillment"
                )}
              </span>
            )}
            {(order as any).payment_status && (
              <span
                className={`text-xs font-bold uppercase px-2 py-1 rounded border border-black ${getStatusBg(
                  (order as any).payment_status
                )}`}
                data-testid="order-payment-status"
              >
                {translateStatus((order as any).payment_status, "payment")}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center text-sm text-black/60 divide-x divide-black/20">
        <span className="pr-3" data-testid="order-date">
          {new Date(order.created_at).toLocaleDateString("it-IT")}
        </span>
        <span className="pl-3" data-testid="order-email">
          {order.email}
        </span>
      </div>
    </div>
  )
}

export default OrderDetails
