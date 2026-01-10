"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useStripe } from "@stripe/react-stripe-js"
import Spinner from "@modules/common/icons/spinner"
import { placeOrder as placeOrderAction } from "@lib/data/cart"
import { Button } from "@components/ui/button"

export default function CheckoutConfirmation() {
  const stripe = useStripe()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(true)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = searchParams.get("payment_intent_client_secret")

    if (!clientSecret) {
      setError("Parametro payment_intent_client_secret mancante")
      setProcessing(false)
      return
    }

    // Recupera il PaymentIntent per verificare lo stato
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) {
        setError("Impossibile recuperare le informazioni del pagamento")
        setProcessing(false)
        return
      }

      switch (paymentIntent.status) {
        case "succeeded":
        case "requires_capture":
          // Pagamento completato con successo, completa l'ordine
          placeOrderAction()
            .then(() => {
              // L'ordine è stato completato, il redirect alla pagina di conferma
              // viene gestito automaticamente da placeOrderAction
            })
            .catch((err: any) => {
              // Se l'errore è "No existing cart found", significa che l'ordine è già stato creato
              // da Medusa automaticamente quando il pagamento è stato completato tramite Klarna/PayPal
              if (
                err.message &&
                err.message.includes("No existing cart found")
              ) {
                // L'ordine è già stato completato con successo
                setProcessing(false)
                setSuccess(true)
              } else {
                // Altro tipo di errore reale
                setError(
                  err.message || "Errore durante la creazione dell'ordine"
                )
                setProcessing(false)
              }
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
  }, [stripe, searchParams, router])

  if (processing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <Spinner />
        <p className="text-lg text-ui-fg-base">
          Stiamo elaborando il tuo pagamento...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 text-xl">⚠️</div>
        <p className="text-lg text-ui-fg-base text-center max-w-md">{error}</p>
        {!error.includes("elaborazione") && (
          <Button
            variant="elevated"
            className="bg-black text-white hover:bg-green-400 hover:text-black"
            onClick={() => {
              router.push("/checkout?step=payment")
            }}
          >
            Torna al pagamento
          </Button>
        )}
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="text-green-500 text-xl">✓</div>
        <p className="text-lg text-ui-fg-base text-center max-w-md">
          Il tuo ordine è stato completato con successo!
        </p>
        <p className="text-sm text-ui-fg-subtle text-center max-w-md">
          Riceverai un&apos;email di conferma a breve.
        </p>
      </div>
    )
  }

  return null
}
