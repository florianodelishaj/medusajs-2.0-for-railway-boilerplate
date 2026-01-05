import { cookies } from "next/headers"

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
    <div className="content-container flex flex-col justify-center items-center gap-y-10 h-full w-full">
      {isOnboarding && <OnboardingCta orderId={order.id} />}
      <div
        className="flex flex-col gap-4 h-full bg-white border border-black rounded-md w-full py-10 px-8"
        data-testid="order-complete-container"
      >
        <div className="flex flex-col gap-y-3 mb-4">
          <h1 className="text-4xl font-bold">Grazie!</h1>
          <p className="text-xl text-gray-700">
            Il tuo ordine è stato effettuato con successo.
          </p>
        </div>
        <OrderDetails order={order} />
        <h2 className="text-2xl font-bold mt-4">Riepilogo</h2>
        <Items items={order.items} currencyCode={order.currency_code} />
        <CartTotals
          totals={{
            ...order,
            discount_total: totalDiscount,
          }}
        />
        <ShippingDetails order={order} />
        <PaymentDetails order={order} />
        <Help />
      </div>
    </div>
  )
}
