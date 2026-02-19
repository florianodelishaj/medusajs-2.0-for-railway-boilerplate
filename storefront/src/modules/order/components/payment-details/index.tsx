import { isStripe, paymentInfoMap } from "@lib/constants"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0].payments?.[0]

  return (
    <div>
      <h2 className="text-sm font-black uppercase tracking-wider mb-3">
        Pagamento
      </h2>
      {payment && (
        <div className="border border-black rounded-md p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-2">
            Dettagli pagamento
          </p>
          <div className="flex gap-3 items-center">
            <div className="flex items-center h-8 w-fit px-2 bg-gray-100 rounded border border-black">
              {paymentInfoMap[payment.provider_id].icon}
            </div>
            <p className="text-sm font-bold" data-testid="payment-amount">
              {isStripe(payment.provider_id) && payment.data?.card_last4
                ? `**** **** **** ${payment.data.card_last4}`
                : `${convertToLocale({
                    amount: payment.amount,
                    currency_code: order.currency_code,
                  })} pagato il ${new Date(
                    payment.created_at ?? ""
                  ).toLocaleDateString("it-IT")}`}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentDetails
