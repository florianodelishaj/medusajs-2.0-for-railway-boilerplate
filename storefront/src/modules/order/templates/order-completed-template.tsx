import { cookies } from "next/headers"
import { CircleCheck } from "lucide-react"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"
import { getTotalDiscount } from "@lib/util/get-total-discount"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const isOnboarding = cookies().get("_medusa_onboarding")?.value === "true"
  const totalDiscount = getTotalDiscount(order)

  return (
    <div className="content-container flex flex-col w-full py-10">
      {isOnboarding && <OnboardingCta orderId={order.id} />}
      <div
        className="flex flex-col gap-6 w-full"
        data-testid="order-complete-container"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-full bg-green-400 border border-black flex items-center justify-center">
            <CircleCheck size={28} className="text-black" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
            Grazie {order.shipping_address?.first_name}!
          </h1>
          <p className="text-sm text-gray-500">
            Ordine #{order.display_id} —{" "}
            {new Date(order.created_at).toLocaleDateString("it-IT", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Greeting */}
        <div>
          <p className="text-base">
            Ciao{" "}
            <strong>
              {order.shipping_address?.first_name}{" "}
              {order.shipping_address?.last_name}
            </strong>
            , grazie per il tuo ordine!
          </p>
          <p className="text-sm text-black/50 mt-1">
            Abbiamo inviato i dettagli dell&apos;ordine a{" "}
            <strong className="text-black">{order.email}</strong>.
          </p>
        </div>

        <OrderDetails order={order} />

        <div>
          <h2 className="text-sm font-black uppercase tracking-wider mb-3 border-l-4 border-green-400 pl-2">
            I tuoi articoli
          </h2>
          <Items items={order.items} currencyCode={order.currency_code} />
        </div>

        <CartTotals
          totals={{
            ...order,
            discount_total: totalDiscount,
          }}
          variant="order"
        />

        <ShippingDetails order={order} />
        <PaymentDetails order={order} />
        <Help />
      </div>
    </div>
  )
}
