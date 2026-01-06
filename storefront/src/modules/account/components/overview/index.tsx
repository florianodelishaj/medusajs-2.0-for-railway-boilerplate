import { Container } from "@medusajs/ui"

import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  return (
    <div data-testid="overview-page-wrapper">
      <div>
        <div className="text-2xl font-bold flex justify-between items-center mb-6">
          <span data-testid="welcome-message" data-value={customer?.first_name}>
            Ciao {customer?.first_name}
          </span>
          <span className="text-sm font-normal text-gray-700 text-right">
            Connesso come:{" "}
            <span
              className="font-semibold text-black"
              data-testid="customer-email"
              data-value={customer?.email}
            >
              {customer?.email}
            </span>
          </span>
        </div>
        <div className="flex flex-col py-8 border-t border-black">
          <div className="flex flex-col gap-y-6 h-full col-span-1 row-span-2 flex-1">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col gap-y-4 bg-white border border-black rounded-md p-6">
                <h3 className="text-xl font-bold">Profilo</h3>
                <div className="flex flex-wrap items-end gap-x-2">
                  <span
                    className="text-4xl font-bold leading-none"
                    data-testid="customer-profile-completion"
                    data-value={getProfileCompletion(customer)}
                  >
                    {getProfileCompletion(customer)}%
                  </span>
                  <span className="uppercase text-sm font-medium text-gray-700">
                    Completato
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-y-4 bg-white border border-black rounded-md p-6">
                <h3 className="text-xl font-bold">Indirizzi</h3>
                <div className="flex flex-wrap items-end gap-x-2">
                  <span
                    className="text-4xl font-bold leading-none"
                    data-testid="addresses-count"
                    data-value={customer?.addresses?.length || 0}
                  >
                    {customer?.addresses?.length || 0}
                  </span>
                  <span className="uppercase text-sm font-medium text-gray-700">
                    Salvati
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                <h3 className="text-xl font-bold">Ordini recenti</h3>
              </div>
              <ul
                className="flex flex-col gap-y-3"
                data-testid="orders-wrapper"
              >
                {orders && orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => {
                    return (
                      <li
                        key={order.id}
                        data-testid="order-wrapper"
                        data-value={order.id}
                      >
                        <LocalizedClientLink
                          href={`/account/orders/details/${order.id}`}
                        >
                          <Container className="bg-white border border-black rounded-md flex justify-between items-center p-4 hover:bg-green-400 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-colors">
                            <div className="grid grid-cols-3 grid-rows-2 text-sm gap-x-4 flex-1">
                              <span className="font-semibold">Data ordine</span>
                              <span className="font-semibold">
                                Numero ordine
                              </span>
                              <span className="font-semibold">Totale</span>
                              <span data-testid="order-created-date">
                                {new Date(order.created_at).toLocaleDateString(
                                  "it-IT"
                                )}
                              </span>
                              <span
                                data-testid="order-id"
                                data-value={order.display_id}
                              >
                                #{order.display_id}
                              </span>
                              <span
                                data-testid="order-amount"
                                className="font-semibold"
                              >
                                {convertToLocale({
                                  amount: order.total,
                                  currency_code: order.currency_code,
                                })}
                              </span>
                            </div>
                            <button
                              className="flex items-center justify-between"
                              data-testid="open-order-button"
                            >
                              <span className="sr-only">
                                Vai all&apos;ordine #{order.display_id}
                              </span>
                              <ChevronDown className="-rotate-90" />
                            </button>
                          </Container>
                        </LocalizedClientLink>
                      </li>
                    )
                  })
                ) : (
                  <span
                    data-testid="no-orders-message"
                    className="text-gray-700"
                  >
                    Nessun ordine recente
                  </span>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
