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
        <div className="text-2xl font-black uppercase flex justify-between items-center mb-6">
          <span data-testid="welcome-message" data-value={customer?.first_name}>
            Ciao {customer?.first_name}
          </span>
          <span className="text-sm font-normal normal-case text-black/50 text-right">
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
            <div className="grid grid-cols-1 small:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-black rounded-md overflow-hidden">
                <div className="bg-green-400 border-b-2 border-black px-4 py-2.5">
                  <span className="text-sm font-black uppercase">Profilo</span>
                </div>
                <div className="flex flex-col gap-y-4 p-6">
                  <div className="flex flex-wrap items-end gap-x-2">
                    <span
                      className={`text-4xl font-bold leading-none ${getCompletionColor(
                        getProfileCompletion(customer)
                      )}`}
                      data-testid="customer-profile-completion"
                      data-value={getProfileCompletion(customer)}
                    >
                      {getProfileCompletion(customer)}%
                    </span>
                    <span className="uppercase text-sm font-medium text-black/50">
                      Completato
                    </span>
                  </div>
                  <ul className="flex flex-col gap-y-1.5">
                    {getProfileFields(customer).map((field) => (
                      <li
                        key={field.label}
                        className="flex items-center gap-x-2 text-sm"
                      >
                        <span
                          className={`text-base font-bold shrink-0 ${
                            field.completed ? "text-green-600" : "text-black/25"
                          }`}
                        >
                          {field.completed ? "✓" : "○"}
                        </span>
                        {field.completed ? (
                          <span className="text-black/60">{field.label}</span>
                        ) : (
                          <LocalizedClientLink
                            href={field.href}
                            className="text-black font-semibold underline underline-offset-2 hover:text-green-700"
                          >
                            {field.label}
                          </LocalizedClientLink>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white border border-black rounded-md overflow-hidden">
                <div className="bg-green-400 border-b-2 border-black px-4 py-2.5">
                  <span className="text-sm font-black uppercase">
                    Indirizzi
                  </span>
                </div>
                <div className="flex flex-col gap-y-4 p-6">
                  <div className="flex flex-wrap items-end gap-x-2">
                    <span
                      className={`text-4xl font-bold leading-none ${
                        (customer?.addresses?.length || 0) > 0
                          ? "text-green-600"
                          : "text-black/60"
                      }`}
                      data-testid="addresses-count"
                      data-value={customer?.addresses?.length || 0}
                    >
                      {customer?.addresses?.length || 0}
                    </span>
                    <span className="uppercase text-sm font-medium text-black/50">
                      Salvati
                    </span>
                  </div>
                  {(customer?.addresses?.length || 0) > 0 ? (
                    <ul className="flex flex-col gap-y-1.5">
                      {customer!.addresses!.slice(0, 4).map((addr) => (
                        <li
                          key={addr.id}
                          className="flex items-center gap-x-2 text-sm"
                        >
                          <span className="text-base font-bold shrink-0 text-green-600">
                            ✓
                          </span>
                          <span className="flex flex-col min-w-0">
                            <span className="text-black/60 truncate">
                              {addr.address_name || addr.city || "Indirizzo"}
                            </span>
                            {addr.is_default_billing && (
                              <span className="text-xs font-bold text-black/40 uppercase">
                                fatturazione
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="flex flex-col gap-y-1.5">
                      <li className="flex items-center gap-x-2 text-sm">
                        <span className="text-base font-bold shrink-0 text-black/25">
                          ○
                        </span>
                        <LocalizedClientLink
                          href="/account/addresses"
                          className="text-black font-semibold underline underline-offset-2 hover:text-green-700"
                        >
                          Aggiungi un indirizzo
                        </LocalizedClientLink>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                <h3 className="text-xl font-black uppercase border-l-4 border-green-400 pl-2">
                  Ordini recenti
                </h3>
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
                          <div className="bg-white border border-black rounded-md flex justify-between items-center p-4 hover:bg-green-400 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all">
                            <div className="grid grid-cols-3 gap-x-4 flex-1 min-w-0">
                              <span className="text-xs font-black uppercase text-black/50">
                                Data
                              </span>
                              <span className="text-xs font-black uppercase text-black/50">
                                Ordine
                              </span>
                              <span className="text-xs font-black uppercase text-black/50">
                                Totale
                              </span>
                              <span
                                className="text-sm mt-1 truncate"
                                data-testid="order-created-date"
                              >
                                {new Date(order.created_at).toLocaleDateString(
                                  "it-IT"
                                )}
                              </span>
                              <span
                                className="text-sm font-bold mt-1 truncate"
                                data-testid="order-id"
                                data-value={order.display_id}
                              >
                                #{order.display_id}
                              </span>
                              <span
                                className="text-sm font-bold mt-1 truncate"
                                data-testid="order-amount"
                              >
                                {convertToLocale({
                                  amount: order.total,
                                  currency_code: order.currency_code,
                                })}
                              </span>
                            </div>
                            <ChevronDown
                              className="-rotate-90 shrink-0 ml-2"
                              data-testid="open-order-button"
                            />
                          </div>
                        </LocalizedClientLink>
                      </li>
                    )
                  })
                ) : (
                  <span
                    data-testid="no-orders-message"
                    className="text-black/50"
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

const getProfileFields = (customer: HttpTypes.StoreCustomer | null) => [
  {
    label: "Email",
    completed: !!customer?.email,
    href: "/account/profile",
  },
  {
    label: "Nome e cognome",
    completed: !!(customer?.first_name && customer?.last_name),
    href: "/account/profile",
  },
  {
    label: "Telefono",
    completed: !!customer?.phone,
    href: "/account/profile",
  },
  {
    label: "Indirizzo di fatturazione",
    completed: !!customer?.addresses?.find((a) => a.is_default_billing),
    href: "/account/addresses",
  },
]

const getCompletionColor = (completion: number) => {
  if (completion === 100) return "text-green-600"
  if (completion >= 50) return "text-yellow-600"
  return "text-rose-500"
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
