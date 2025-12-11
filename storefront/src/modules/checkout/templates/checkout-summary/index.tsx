import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0 ">
      <div className="w-full bg-white border border-black rounded-md p-6 flex flex-col">
        <Heading
          level="h2"
          className="flex flex-row text-2xl font-black uppercase items-baseline mb-6"
        >
          Il tuo carrello
        </Heading>
        <CartTotals totals={cart} />
        <ItemsPreviewTemplate
          items={cart?.items}
          currencyCode={cart?.currency_code}
        />
        <div className="mt-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
