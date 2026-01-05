"use client"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import { useEffect, useState } from "react"
import { PartyPopper } from "lucide-react"

type FreeShippingProgressProps = {
  cart: HttpTypes.StoreCart
  fallbackThreshold?: number // Soglia di fallback in euro (default: 50)
}

const FreeShippingProgress = ({
  cart,
  fallbackThreshold = 50,
}: FreeShippingProgressProps) => {
  const [threshold, setThreshold] = useState<number>(fallbackThreshold)
  const [shippingName, setShippingName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  // Recupera dinamicamente la soglia dalle shipping options
  useEffect(() => {
    const fetchThreshold = async () => {
      try {
        const { shipping_options } =
          await sdk.store.fulfillment.listCartOptions({
            cart_id: cart.id,
            fields: "+prices.price_rules",
          })

        // Cerca la soglia nelle shipping options
        for (const option of shipping_options || []) {
          // Cerca tra i prezzi quello che ha la regola "item_total"
          for (const price of option.prices || []) {
            // Cast a any perché il tipo StorePrice non include price_rules di default
            const priceWithRules = price as any
            const thresholdRule = priceWithRules.price_rules?.find(
              (rule: any) =>
                rule.attribute === "item_total" && rule.operator === "gte"
            )

            if (thresholdRule && price.amount === 0) {
              // Trovata la regola per la spedizione gratuita
              // Il valore è già in euro (non in centesimi)
              const value = parseFloat(thresholdRule.value)
              setThreshold(value)
              setShippingName(option.name || "")
              setIsLoading(false)
              return
            }
          }
        }

        // Se non trova la regola, usa il fallback
        setIsLoading(false)
      } catch (error) {
        console.error(
          "Errore nel recupero della soglia di spedizione gratuita:",
          error
        )
        // Usa il fallback in caso di errore
        setIsLoading(false)
      }
    }

    fetchThreshold()
  }, [cart.id, fallbackThreshold])

  // item_total è il totale degli articoli nel carrello (escluso tasse e spedizione)
  const currentTotal = cart.item_total ?? 0
  const missingAmount = threshold - currentTotal

  // Mostra skeleton durante il caricamento per evitare layout shift
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="w-full bg-gray-200 rounded-full h-2"></div>
      </div>
    )
  }

  // Se la soglia è raggiunta, non mostrare nulla
  if (missingAmount <= 0) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-green-400 border border-green-900 rounded-md">
        <PartyPopper className="w-5 h-5 text-green-800 flex-shrink-0" />
        <span className="text-sm font-medium text-green-800">
          Hai ottenuto la spedizione gratuita!
        </span>
      </div>
    )
  }

  // Calcola la percentuale di progresso
  const progress = ((currentTotal / threshold) * 100).toFixed(0)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          Aggiungi{" "}
          <span className="font-bold text-green-600">
            {convertToLocale({
              amount: missingAmount,
              currency_code: cart.currency_code,
              locale: "it-IT",
            })}
          </span>{" "}
          per la spedizione{" "}
          {shippingName && (
            <span className="lowercase font-bold">{shippingName}</span>
          )}{" "}
          gratuita!
        </span>
      </div>
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-green-400 h-2 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default FreeShippingProgress
