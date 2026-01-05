import { isStripe, paymentInfoMap } from "@lib/constants"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0].payments?.[0]

  return (
    <div className="py-6 border-b border-black">
      <h2 className="text-xl font-bold mb-4">Pagamento</h2>
      <div>
        {payment && (
          <div className="flex flex-col small:flex-row items-start gap-6">
            <div className="flex flex-col flex-1">
              <p className="text-sm font-bold text-gray-700 mb-2 uppercase">
                Metodo di pagamento
              </p>
              <p
                className="text-base"
                data-testid="payment-method"
              >
                {paymentInfoMap[payment.provider_id].title}
              </p>
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-sm font-bold text-gray-700 mb-2 uppercase">
                Dettagli pagamento
              </p>
              <div className="flex gap-2 text-base items-center">
                <div className="flex items-center h-7 w-fit p-2 bg-gray-100 rounded border border-black">
                  {paymentInfoMap[payment.provider_id].icon}
                </div>
                <p data-testid="payment-amount">
                  {isStripe(payment.provider_id) && payment.data?.card_last4
                    ? `**** **** **** ${payment.data.card_last4}`
                    : `${convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      }).replace(/,/g, "").replace(/\./g, ",")} pagato il ${new Date(
                        payment.created_at ?? ""
                      ).toLocaleDateString("it-IT")}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentDetails
