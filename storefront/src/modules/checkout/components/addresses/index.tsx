"use client"

import { CheckCircleSolid } from "@medusajs/icons"
import useToggleState from "@lib/hooks/use-toggle-state"
import { cn } from "@lib/util/cn"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import Spinner from "@modules/common/icons/spinner"
import { Button } from "@components/ui/button"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { HttpTypes } from "@medusajs/types"
import { useFormState } from "react-dom"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useFormState(setAddresses, null)

  return (
    <div className="bg-white border border-black rounded-md p-6">
      <div
        className={cn("flex flex-row items-center justify-between gap-x-4", {
          "mb-6": isOpen || !!cart?.shipping_address,
        })}
      >
        <div className="flex items-center gap-x-2">
          <h2
            className={cn("text-2xl font-black uppercase", {
              "border-l-4 border-green-400 pl-3": isOpen,
              "border-l-4 border-pink-400 pl-3":
                !isOpen && !!cart?.shipping_address,
            })}
          >
            Indirizzo di spedizione
          </h2>
          {!isOpen && <CheckCircleSolid className="shrink-0" />}
        </div>
        {!isOpen && cart?.shipping_address && (
          <Button
            onClick={handleEdit}
            variant="elevated"
            size="sm"
            data-testid="edit-address-button"
            className="hover:bg-green-400 hover:text-black"
          >
            Modifica
          </Button>
        )}
      </div>
      {isOpen ? (
        <form action={formAction}>
          <ShippingAddress
            customer={customer}
            checked={sameAsBilling}
            onChange={toggleSameAsBilling}
            cart={cart}
          />

          {!sameAsBilling && (
            <div>
              <h2 className="text-2xl font-black uppercase gap-x-4 pb-6 pt-8 mb-6">
                Indirizzo di fatturazione
              </h2>

              <BillingAddress cart={cart} />
            </div>
          )}
          <SubmitButton
            className="mt-6 bg-black text-white hover:bg-green-400 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:text-black"
            data-testid="submit-address-button"
          >
            Continua alla consegna
          </SubmitButton>
          <ErrorMessage error={message} data-testid="address-error-message" />
          <p className="text-xs text-black/70 mt-4">
            Hai bisogno della fattura? Scrivici a{" "}
            <a
              href="mailto:amministrazione@ilcovodixur.com"
              className="underline hover:text-green-600"
            >
              amministrazione@ilcovodixur.com
            </a>
          </p>
        </form>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className="flex flex-col lg:flex-row items-start gap-y-6 lg:gap-y-0 lg:gap-x-8">
                <div
                  className="flex flex-col w-full lg:w-1/3"
                  data-testid="shipping-address-summary"
                >
                  <p className="text-sm font-bold text-black mb-1 uppercase">
                    Indirizzo di spedizione
                  </p>
                  <p className="text-sm text-gray-500">
                    {cart.shipping_address.first_name}{" "}
                    {cart.shipping_address.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {cart.shipping_address.address_1}{" "}
                    {cart.shipping_address.address_2}
                  </p>
                  <p className="text-sm text-gray-500">
                    {cart.shipping_address.postal_code},{" "}
                    {cart.shipping_address.city}
                  </p>
                  <p className="text-sm text-gray-500">
                    {cart.shipping_address.country_code?.toUpperCase()}
                  </p>
                </div>

                <div
                  className="flex flex-col w-full lg:w-1/3"
                  data-testid="shipping-contact-summary"
                >
                  <p className="text-sm font-bold text-black mb-1 uppercase">
                    Contatti
                  </p>
                  <p className="text-sm text-gray-500">
                    {cart.shipping_address.phone}
                  </p>
                  <p className="text-sm text-gray-500">{cart.email}</p>
                </div>

                <div
                  className="flex flex-col w-full lg:w-1/3"
                  data-testid="billing-address-summary"
                >
                  <p className="text-sm font-bold text-black mb-1 uppercase">
                    Indirizzo di fatturazione
                  </p>

                  {sameAsBilling ? (
                    <p className="text-sm text-gray-500">
                      Indirizzo di fatturazione e spedizione coincidono.
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500">
                        {cart.billing_address?.first_name}{" "}
                        {cart.billing_address?.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {cart.billing_address?.address_1}{" "}
                        {cart.billing_address?.address_2}
                      </p>
                      <p className="text-sm text-gray-500">
                        {cart.billing_address?.postal_code},{" "}
                        {cart.billing_address?.city}
                      </p>
                      <p className="text-sm text-gray-500">
                        {cart.billing_address?.country_code?.toUpperCase()}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Addresses
