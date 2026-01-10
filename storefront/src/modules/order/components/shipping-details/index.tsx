import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div className="py-6 border-b border-black">
      <h2 className="text-xl font-bold mb-4">Consegna e Fatturazione</h2>
      <div className="flex flex-col gap-y-6">
        {/* Shipping Section */}
        <div>
          <p className="text-base font-semibold mb-4">Consegna</p>
          <div className="flex flex-col small:flex-row items-start gap-6">
            <div
              className="flex flex-col flex-1"
              data-testid="shipping-address-summary"
            >
              <p className="text-sm font-bold text-gray-700 mb-2 uppercase">
                Indirizzo di spedizione
              </p>
              <p className="text-base">
                {order.shipping_address?.first_name}{" "}
                {order.shipping_address?.last_name}
              </p>
              <p className="text-base text-gray-700">
                {order.shipping_address?.address_1}{" "}
                {order.shipping_address?.address_2}
              </p>
              <p className="text-base text-gray-700">
                {order.shipping_address?.postal_code},{" "}
                {order.shipping_address?.city}
              </p>
              <p className="text-base text-gray-700">
                {order.shipping_address?.country_code?.toUpperCase()}
              </p>
            </div>

            <div
              className="flex flex-col flex-1"
              data-testid="shipping-contact-summary"
            >
              <p className="text-sm font-bold text-gray-700 mb-2 uppercase">
                Contatto
              </p>
              <p className="text-base">{order.shipping_address?.phone}</p>
              <p className="text-base text-gray-700">{order.email}</p>
            </div>

            <div
              className="flex flex-col flex-1"
              data-testid="shipping-method-summary"
            >
              <p className="text-sm font-bold text-gray-700 mb-2 uppercase">
                Metodo
              </p>
              <p className="text-base">
                {(order as any).shipping_methods[0]?.name} (
                {convertToLocale({
                  amount: order.shipping_methods?.[0].total ?? 0,
                  currency_code: order.currency_code,
                })
                  .replace(/,/g, "")
                  .replace(/\./g, ",")}
                )
              </p>
            </div>
          </div>
        </div>

        <Divider />

        {/* Billing Section */}
        <div>
          <p className="text-base font-semibold mb-4">Fatturazione</p>
          <div className="flex flex-col small:flex-row items-start gap-6">
            <div
              className="flex flex-col flex-1"
              data-testid="billing-address-summary"
            >
              <p className="text-sm font-bold text-gray-700 mb-2 uppercase">
                Indirizzo di fatturazione
              </p>
              {order.billing_address ? (
                <>
                  <p className="text-base">
                    {order.billing_address.first_name}{" "}
                    {order.billing_address.last_name}
                  </p>
                  <p className="text-base text-gray-700">
                    {order.billing_address.address_1}{" "}
                    {order.billing_address.address_2}
                  </p>
                  <p className="text-base text-gray-700">
                    {order.billing_address.postal_code},{" "}
                    {order.billing_address.city}
                  </p>
                  <p className="text-base text-gray-700">
                    {order.billing_address.country_code?.toUpperCase()}
                  </p>
                </>
              ) : (
                <p className="text-base text-gray-700 italic">
                  Stesso indirizzo di spedizione
                </p>
              )}
            </div>
            <div className="flex-1" />
            <div className="flex-1" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingDetails
