"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter, useParams } from "next/navigation"
import { useStripe } from "@stripe/react-stripe-js"
import { AlertCircle, AlertTriangle, ArrowRight } from "lucide-react"
import Spinner from "@modules/common/icons/spinner"
import { placeOrder as placeOrderAction, resetCart } from "@lib/data/cart"
import { translateErrorMessage } from "@lib/util/error-messages"
import { Button } from "@components/ui/button"

export default function CheckoutConfirmation() {
  const stripe = useStripe()
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const countryCode = params.countryCode as string

  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(true)
  const [isPostPaymentError, setIsPostPaymentError] = useState(false)

  useEffect(() => {
    if (!stripe) return

    const clientSecret = searchParams.get("payment_intent_client_secret")

    if (!clientSecret) {
      setError("Parametro payment_intent_client_secret mancante")
      setProcessing(false)
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) {
        setError("Impossibile recuperare le informazioni del pagamento")
        setProcessing(false)
        return
      }

      switch (paymentIntent.status) {
        case "succeeded":
        case "requires_capture":
          placeOrderAction().catch((err: any) => {
            if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err
            console.error("[Confirmation] placeOrder error:", err)
            setIsPostPaymentError(true)
            setError(
              translateErrorMessage(err.message) ||
                "Errore durante la creazione dell'ordine"
            )
            setProcessing(false)
          })
          break

        case "processing":
          setError(
            "Il tuo pagamento è in elaborazione. Riceverai un'email di conferma a breve."
          )
          setProcessing(false)
          break

        case "requires_payment_method":
          setError(
            "Il pagamento non è stato completato. Riprova con un altro metodo di pagamento."
          )
          setProcessing(false)
          break

        default:
          setError("Si è verificato un errore durante il pagamento.")
          setProcessing(false)
          break
      }
    })
  }, [stripe, searchParams])

  if (processing) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white border border-black rounded-lg p-8 max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-6">
            <Spinner />
          </div>
          <h1 className="text-3xl font-black uppercase mb-4">
            Pagamento in corso
          </h1>
          <p className="text-gray-700">
            Non chiudere questa pagina, stiamo completando il tuo ordine.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    const isInfo = error.includes("elaborazione")

    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white border border-black rounded-lg p-8 max-w-md w-full text-center">
          <div className="bg-green-400 border border-black rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            {isPostPaymentError ? (
              <AlertTriangle className="w-12 h-12" />
            ) : (
              <AlertCircle className="w-12 h-12" />
            )}
          </div>

          <h1 className="text-3xl font-black uppercase mb-4">
            {isPostPaymentError
              ? "Ordine non completato"
              : isInfo
              ? "Pagamento in attesa"
              : "Pagamento fallito"}
          </h1>

          <p className="text-gray-700 mb-6">{error}</p>

          {isPostPaymentError && (
            <p className="text-sm text-gray-500 mb-6">
              Il tuo pagamento risulta acquisito ma l&apos;ordine non è stato
              completato. Contattaci a{" "}
              <a
                href="mailto:ordini@ilcovodixur.com"
                className="font-semibold underline hover:text-green-600 transition-colors"
              >
                ordini@ilcovodixur.com
              </a>{" "}
              e ti aiuteremo a risolvere il problema.
            </p>
          )}

          {isPostPaymentError && (
            <Button
              variant="elevated"
              className="bg-black text-white hover:bg-green-400 hover:text-black font-bold uppercase inline-flex items-center gap-2"
              onClick={async () => {
                await resetCart()
                router.push(`/${countryCode}/store`)
              }}
            >
              Torna al negozio
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}

          {!isPostPaymentError && !isInfo && (
            <Button
              variant="elevated"
              className="bg-black text-white hover:bg-green-400 hover:text-black font-bold uppercase inline-flex items-center gap-2"
              onClick={() =>
                router.push(`/${countryCode}/checkout?step=payment`)
              }
            >
              Torna al pagamento
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return null
}
