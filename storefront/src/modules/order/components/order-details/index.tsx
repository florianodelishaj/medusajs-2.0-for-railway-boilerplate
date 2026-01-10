import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

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

  const getStatusColor = (status: string, type: "fulfillment" | "payment") => {
    const fulfillmentColors: Record<string, string> = {
      not_fulfilled: "text-orange-600",
      fulfilled: "text-green-600",
      partially_fulfilled: "text-yellow-600",
      shipped: "text-green-600",
      partially_shipped: "text-yellow-600",
      delivered: "text-green-600",
      partially_delivered: "text-yellow-600",
      returned: "text-blue-600",
      canceled: "text-red-600",
      requires_action: "text-orange-600",
    }

    const paymentColors: Record<string, string> = {
      not_paid: "text-red-600",
      awaiting: "text-yellow-600",
      authorized: "text-blue-600",
      captured: "text-green-600",
      partially_refunded: "text-yellow-600",
      refunded: "text-orange-600",
      canceled: "text-red-600",
      requires_action: "text-orange-600",
    }

    const colors = type === "fulfillment" ? fulfillmentColors : paymentColors
    return colors[status] || "text-gray-600"
  }

  return (
    <div className="pb-6 border-b border-black">
      <p className="text-base text-gray-700">
        Abbiamo inviato i dettagli di conferma dell&apos;ordine a{" "}
        <span className="font-semibold text-black" data-testid="order-email">
          {order.email}
        </span>
        .
      </p>
      <p className="mt-2 text-base text-gray-700">
        Data ordine:{" "}
        <span className="font-semibold text-black" data-testid="order-date">
          {new Date(order.created_at).toLocaleDateString("it-IT")}
        </span>
      </p>
      <p className="mt-2 text-base">
        Numero ordine:{" "}
        <span className="font-semibold" data-testid="order-id">
          #{order.display_id}
        </span>
      </p>

      {showStatus && (
        <div className="flex items-center flex-wrap text-sm gap-x-4 gap-y-2 mt-4">
          {(order as any).fulfillment_status && (
            <p className="text-gray-700">
              Stato ordine:{" "}
              <span
                className={`font-semibold ${getStatusColor(
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
            </p>
          )}
          {(order as any).payment_status && (
            <p className="text-gray-700">
              Stato pagamento:{" "}
              <span
                className={`font-semibold ${getStatusColor(
                  (order as any).payment_status,
                  "payment"
                )}`}
                data-testid="order-payment-status"
              >
                {translateStatus((order as any).payment_status, "payment")}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default OrderDetails
