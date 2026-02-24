"use client"

import { RadioGroup } from "@headlessui/react"
import { CheckCircleSolid } from "@medusajs/icons"
import { cn } from "@lib/util/cn"

import { Button } from "@components/ui/button"
import Radio from "@modules/common/components/radio"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useSetShippingMethod } from "@lib/hooks/use-checkout-actions"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const { setShippingMethod, isLoading } = useSetShippingMethod()
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const selectedShippingMethod = availableShippingMethods?.find(
    // To do: remove the previously selected shipping method instead of using the last one
    (method) => method.id === cart.shipping_methods?.at(-1)?.shipping_option_id
  )

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const set = async (id: string) => {
    try {
      await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
    } catch (err: any) {
      setError(err.message)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-white border border-black rounded-md p-6">
      <div
        className={cn("flex flex-row items-center justify-between gap-x-4", {
          "mb-6": isOpen,
        })}
      >
        <div className="flex items-center gap-x-2">
          <h2
            className={cn("text-2xl font-black uppercase", {
              "opacity-50 pointer-events-none select-none":
                !isOpen && cart.shipping_methods?.length === 0,
            })}
          >
            Consegna
          </h2>
          {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
            <CheckCircleSolid className="shrink-0" />
          )}
        </div>
        {!isOpen &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email && (
            <Button
              onClick={handleEdit}
              variant="elevated"
              size="sm"
              data-testid="edit-delivery-button"
              className="hover:bg-green-400 hover:text-black"
            >
              Modifica
            </Button>
          )}
      </div>
      {isOpen ? (
        <div data-testid="delivery-options-container">
          {!availableShippingMethods ||
          availableShippingMethods.length === 0 ? (
            <div className="pb-6">
              <div className="bg-gray-100 border-2 border-black rounded-md p-6 text-center">
                <p className="text-gray-800 font-bold text-lg">
                  Non consegniamo a questo indirizzo.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="pb-6">
                <RadioGroup
                  value={selectedShippingMethod?.id || ""}
                  onChange={set}
                >
                  {availableShippingMethods.map((option) => {
                    return (
                      <RadioGroup.Option
                        key={option.id}
                        value={option.id}
                        data-testid="delivery-option-radio"
                        className={cn(
                          "flex items-center justify-between text-small-regular cursor-pointer py-4 border border-black rounded-md px-6 mb-3 transition-all",
                          {
                            "bg-green-400 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]":
                              option.id === selectedShippingMethod?.id,
                            "bg-white hover:bg-green-400 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px]":
                              option.id !== selectedShippingMethod?.id,
                          }
                        )}
                      >
                        <div className="flex items-center gap-x-4">
                          <Radio
                            checked={option.id === selectedShippingMethod?.id}
                          />
                          <div className="flex flex-col">
                            <span className="text-base-regular">
                              {option.name}
                            </span>
                            {(option as any).type?.description && (
                              <span className="text-xs text-gray-600 mt-0.5">
                                {(option as any).type.description}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="justify-self-end text-black font-semibold">
                          {option.amount === 0 ? (
                            <span
                              className={cn(
                                "inline-flex items-center px-3 py-1 rounded-md font-bold text-sm uppercase",
                                {
                                  "bg-white text-green-400":
                                    option.id === selectedShippingMethod?.id,
                                  "bg-green-400 text-white":
                                    option.id !== selectedShippingMethod?.id,
                                }
                              )}
                            >
                              Gratuita
                            </span>
                          ) : (
                            convertToLocale({
                              amount: option.amount!,
                              currency_code: cart?.currency_code,
                            })
                          )}
                        </span>
                      </RadioGroup.Option>
                    )
                  })}
                </RadioGroup>
              </div>
              <ErrorMessage
                error={error}
                data-testid="delivery-option-error-message"
              />

              <Button
                variant="elevated"
                size="lg"
                className="w-full bg-black text-white hover:bg-green-400 hover:text-black"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={!cart.shipping_methods?.[0]}
                data-testid="submit-delivery-option-button"
              >
                Continua al pagamento
              </Button>
            </>
          )}
        </div>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
              <div className="flex flex-col w-1/3">
                <p className="text-sm font-bold text-black mb-1 uppercase">
                  Metodo
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">
                    {selectedShippingMethod?.name}
                  </p>
                  {selectedShippingMethod?.amount === 0 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-400 text-white font-bold text-xs uppercase">
                      Gratuita
                    </span>
                  ) : (
                    <p className="text-sm text-gray-500">
                      {convertToLocale({
                        amount: selectedShippingMethod?.amount!,
                        currency_code: cart?.currency_code,
                      })}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Shipping
