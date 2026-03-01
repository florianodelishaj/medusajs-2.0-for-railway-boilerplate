import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div>
      <h2 className="text-sm font-black uppercase tracking-wider mb-3 border-l-4 border-green-400 pl-2">
        Consegna e Fatturazione
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
        {/* Shipping Address */}
        <div data-testid="shipping-address-summary">
          <p className="text-[10px] font-black uppercase tracking-wider text-black/50 mb-1">
            Indirizzo di spedizione
          </p>
          <p className="text-sm font-bold">
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </p>
          <p className="text-sm text-black/60">
            {order.shipping_address?.address_1}{" "}
            {order.shipping_address?.address_2}
          </p>
          <p className="text-sm text-black/60">
            {order.shipping_address?.postal_code},{" "}
            {order.shipping_address?.city}
          </p>
          <p className="text-sm text-black/60">
            {order.shipping_address?.country_code?.toUpperCase()}
          </p>
        </div>

        {/* Contact */}
        <div data-testid="shipping-contact-summary">
          <p className="text-[10px] font-black uppercase tracking-wider text-black/50 mb-1">
            Contatto
          </p>
          {order.shipping_address?.phone && (
            <p className="text-sm font-bold">{order.shipping_address.phone}</p>
          )}
          <p className="text-sm text-black/60">{order.email}</p>
        </div>

        {/* Shipping Method */}
        {order.shipping_methods?.[0] && (
          <div data-testid="shipping-method-summary">
            <p className="text-[10px] font-black uppercase tracking-wider text-black/50 mb-1">
              Metodo di spedizione
            </p>
            <p className="text-sm font-bold">
              {(order as any).shipping_methods[0]?.name}
            </p>
            <p className="text-sm text-black/60">
              {convertToLocale({
                amount: order.shipping_methods[0].total ?? 0,
                currency_code: order.currency_code,
              })}
            </p>
          </div>
        )}

        {/* Billing Address */}
        <div data-testid="billing-address-summary">
          <p className="text-[10px] font-black uppercase tracking-wider text-black/50 mb-1">
            Indirizzo di fatturazione
          </p>
          {order.billing_address ? (
            <>
              <p className="text-sm font-bold">
                {order.billing_address.first_name}{" "}
                {order.billing_address.last_name}
              </p>
              <p className="text-sm text-black/60">
                {order.billing_address.address_1}{" "}
                {order.billing_address.address_2}
              </p>
              <p className="text-sm text-black/60">
                {order.billing_address.postal_code},{" "}
                {order.billing_address.city}
              </p>
              <p className="text-sm text-black/60">
                {order.billing_address.country_code?.toUpperCase()}
              </p>
            </>
          ) : (
            <p className="text-sm text-black/50 italic">
              Stesso indirizzo di spedizione
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShippingDetails
