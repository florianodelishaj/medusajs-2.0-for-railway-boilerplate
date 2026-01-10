"use client"

import { useCallback, useContext, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { RadioGroup } from "@headlessui/react"
import ErrorMessage from "@modules/checkout/components/error-message"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Container, Heading, Text, clx } from "@medusajs/ui"
import { PaymentElement } from "@stripe/react-stripe-js"

import { Button } from "@components/ui/button"
import PaymentContainer from "@modules/checkout/components/payment-container"
import { isStripe as isStripeFunc, paymentInfoMap } from "@lib/constants"
import { StripeContext } from "@modules/checkout/components/payment-wrapper"
import { useInitiatePaymentSession } from "@lib/hooks/use-checkout-actions"
import PaymentButton from "@modules/checkout/components/payment-button"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const { initiatePaymentSession, isLoading } = useInitiatePaymentSession()
  const [error, setError] = useState<string | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )
  const [hasInitialized, setHasInitialized] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const isStripe = isStripeFunc(activeSession?.provider_id)
  const stripeReady = useContext(StripeContext)

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  useEffect(() => {
    setError(null)
    setHasInitialized(false)
  }, [isOpen])

  // Auto-inizializza la sessione di pagamento se c'è solo Stripe e non c'è ancora una sessione attiva
  useEffect(() => {
    const initializeStripeSession = async () => {
      if (
        isOpen &&
        !activeSession &&
        !hasInitialized &&
        availablePaymentMethods.length === 1 &&
        isStripeFunc(availablePaymentMethods[0].id) &&
        !isLoading
      ) {
        setHasInitialized(true)
        setSelectedPaymentMethod(availablePaymentMethods[0].id)
        try {
          await initiatePaymentSession(cart, {
            provider_id: availablePaymentMethods[0].id,
          })
        } catch (err: any) {
          setError(err.message)
          setHasInitialized(false)
        }
      }
    }

    initializeStripeSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isOpen,
    activeSession?.id,
    hasInitialized,
    availablePaymentMethods.length,
    isLoading,
  ])

  return (
    <div className="bg-white border border-black rounded-md p-6">
      <div
        className={clx("flex flex-row items-center justify-between gap-x-4", {
          "mb-6": isOpen,
        })}
      >
        <div className="flex items-center gap-x-2">
          <Heading
            level="h2"
            className={clx("text-2xl font-black uppercase", {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            })}
          >
            Pagamento
          </Heading>
          {!isOpen && paymentReady && <CheckCircleSolid className="shrink-0" />}
        </div>
        {!isOpen && paymentReady && (
          <Button
            onClick={handleEdit}
            variant="elevated"
            size="sm"
            data-testid="edit-payment-button"
            className="hover:bg-green-400 hover:text-black"
          >
            Modifica
          </Button>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && availablePaymentMethods?.length && (
            <>
              {/* Mostra RadioGroup solo se ci sono più metodi o non è solo Stripe */}
              {availablePaymentMethods.length > 1 && (
                <RadioGroup
                  value={selectedPaymentMethod}
                  onChange={(value: string) => setSelectedPaymentMethod(value)}
                >
                  {availablePaymentMethods
                    .sort((a, b) => {
                      return a.provider_id > b.provider_id ? 1 : -1
                    })
                    .map((paymentMethod) => {
                      return (
                        <PaymentContainer
                          paymentInfoMap={paymentInfoMap}
                          paymentProviderId={paymentMethod.id}
                          key={paymentMethod.id}
                          selectedPaymentOptionId={selectedPaymentMethod}
                        />
                      )
                    })}
                </RadioGroup>
              )}
              {/* Mostra direttamente il PaymentElement per Stripe */}
              {isStripe && stripeReady && (
                <div className="mt-5 transition-all duration-150 ease-in-out">
                  <Text className="txt-medium-plus text-ui-fg-base mb-1 font-bold uppercase">
                    Seleziona il metodo di pagamento:
                  </Text>

                  <PaymentElement
                    options={{
                      layout: "accordion",
                    }}
                  />
                </div>
              )}
            </>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1 font-bold uppercase">
                Metodo di pagamento
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Carta regalo
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <div className="mt-6">
            <Text className="txt-medium text-ui-fg-base mb-4">
              Cliccando il pulsante Effettua Ordine, confermi di aver letto,
              compreso e accettato i nostri Termini di Utilizzo, Termini di
              Vendita e Politica di Reso e riconosci di aver letto la Politica
              sulla Privacy di Il Covo di Xur.
            </Text>
            <PaymentButton cart={cart} data-testid="submit-order-button" />
          </div>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1 font-bold uppercase">
                  Metodo di pagamento
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[selectedPaymentMethod]?.title ||
                    selectedPaymentMethod}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1 font-bold uppercase">
                  Dettagli pagamento
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    {isStripeFunc(selectedPaymentMethod)
                      ? "Metodo configurato"
                      : "Apparirà un altro passaggio"}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1 font-bold uppercase">
                Metodo di pagamento
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Carta regalo
              </Text>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Payment
