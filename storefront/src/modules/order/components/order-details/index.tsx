import { HttpTypes } from "@medusajs/types"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const translateStatus = (status: string, type: "fulfillment" | "payment") => {
    const fulfillmentTranslations: Record<string, string> = {
      not_fulfilled: "Non evaso",
      fulfilled: "Evaso",
      partially_fulfilled: "Parzialmente evaso",
      shipped: "Spedito",
      partially_shipped: "Parzialmente spedito",
      delivered: "Consegnato",
      partially_delivered: "Parzialmente consegnato",
      returned: "Restituito",
      canceled: "Annullato",
      requires_action: "Richiede azione",
    }

    const paymentTranslations: Record<string, string> = {
      not_paid: "Non pagato",
      awaiting: "In attesa",
      authorized: "Autorizzato",
      captured: "Pagato",
      partially_refunded: "Parzialmente rimborsato",
      refunded: "Rimborsato",
      canceled: "Annullato",
      requires_action: "Richiede azione",
    }

    const translations =
      type === "fulfillment" ? fulfillmentTranslations : paymentTranslations
    return (
      translations[status] ||
      status
        .split("_")
        .join(" ")
        .replace(/^\w/, (c) => c.toUpperCase())
    )
  }

  const getStatusBg = (status: string, type: "fulfillment" | "payment") => {
    const greenStatuses = ["fulfilled", "shipped", "delivered", "captured"]
    const redStatuses = ["canceled", "not_paid"]
    if (greenStatuses.includes(status)) return "bg-green-400 text-black"
    if (redStatuses.includes(status)) return "bg-red-500 text-white"
    return "bg-gray-200 text-black"
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="border border-black rounded-md p-4">
        <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">
          Numero ordine
        </p>
        <p className="text-base font-bold" data-testid="order-id">
          #{order.display_id}
        </p>
      </div>
      <div className="border border-black rounded-md p-4">
        <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">
          Data
        </p>
        <p className="text-base font-bold" data-testid="order-date">
          {new Date(order.created_at).toLocaleDateString("it-IT")}
        </p>
      </div>
      <div className="border border-black rounded-md p-4">
        <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">
          Email
        </p>
        <p className="text-base font-bold truncate" data-testid="order-email">
          {order.email}
        </p>
      </div>

      {showStatus && (
        <>
          {(order as any).fulfillment_status && (
            <div className="border border-black rounded-md p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">
                Stato ordine
              </p>
              <span
                className={`inline-block text-xs font-bold uppercase px-2 py-1 rounded border border-black ${getStatusBg(
                  (order as any).fulfillment_status,
                  "fulfillment"
                )}`}
                data-testid="order-status"
              >
                {translateStatus(
                  (order as any).fulfillment_status,
                  "fulfillment"
                )}
              </span>
            </div>
          )}
          {(order as any).payment_status && (
            <div className="border border-black rounded-md p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">
                Stato pagamento
              </p>
              <span
                className={`inline-block text-xs font-bold uppercase px-2 py-1 rounded border border-black ${getStatusBg(
                  (order as any).payment_status,
                  "payment"
                )}`}
                data-testid="order-payment-status"
              >
                {translateStatus((order as any).payment_status, "payment")}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default OrderDetails
