"use client"

import { useEffect, useRef, useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Minus, Plus } from "lucide-react"
import { clx } from "@medusajs/ui"
import { toast } from "sonner"
import { HttpTypes } from "@medusajs/types"

import { createReturnRequest } from "@lib/data/returns"
import { Button } from "@components/ui/button"
import Checkbox from "@modules/common/components/checkbox"
import Radio from "@modules/common/components/radio"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { useSearchFilters } from "@lib/context/search-filters-context"
import { findTopLevelCategory } from "@lib/util/get-category-background"

type ReturnRequestFormProps = {
  order: HttpTypes.StoreOrder
  returnReasons: any[]
  shippingOptions: any[]
  returnedQuantities: Record<string, number>
  locationId: string | null
}

type ReturnItemRowProps = {
  item: HttpTypes.StoreOrderLineItem
  isSelected: boolean
  selectedQty: number
  returnedQty: number
  onToggle: () => void
  onAdjust: (delta: number) => void
}

function ReturnItemRow({
  item,
  isSelected,
  selectedQty,
  returnedQty,
  onToggle,
  onAdjust,
}: ReturnItemRowProps) {
  const { categories: allCategories } = useSearchFilters()
  const productCategories = (item.variant?.product as any)?.categories as
    | any[]
    | undefined
  const categoryColor = productCategories?.[0]?.id
    ? (findTopLevelCategory(productCategories[0].id, allCategories)?.metadata
        ?.color as string | undefined)
    : undefined

  const totalQty = item.quantity ?? 0
  const availableQty = totalQty - returnedQty
  const fullyReturned = availableQty <= 0

  return (
    <div
      className={clx(
        "relative flex items-center gap-4 border rounded-md p-4 bg-white transition-colors overflow-hidden",
        fullyReturned
          ? "opacity-50 cursor-not-allowed"
          : isSelected
          ? "bg-green-400/10"
          : ""
      )}
    >
      {categoryColor && (
        <div
          className="absolute inset-y-0 left-0 w-1"
          style={{ backgroundColor: categoryColor }}
        />
      )}

      {/* Thumbnail */}
      <div className="w-20 h-20 shrink-0">
        <Thumbnail thumbnail={item.thumbnail} size="square" />
      </div>

      {/* Checkbox + info */}
      <div className="flex-1 min-w-0">
        <Checkbox
          label={item.title}
          checked={isSelected}
          onChange={fullyReturned ? () => {} : onToggle}
        />
        <p className="text-xs text-black/50 ml-7 mt-0.5">
          {fullyReturned ? (
            <span className="font-medium text-black/40">
              Reso già richiesto
            </span>
          ) : (
            `Disponibili per il reso: ${availableQty}`
          )}
        </p>
      </div>

      {/* Quantity selector */}
      {isSelected && !fullyReturned && (
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="elevated"
            size="sm"
            className="w-7 h-7 p-0 bg-black text-white hover:bg-red-400 hover:text-black"
            onClick={() => onAdjust(-1)}
            disabled={selectedQty <= 1}
          >
            <Minus size={10} strokeWidth={3} />
          </Button>
          <span className="text-sm font-black w-5 text-center">
            {selectedQty}
          </span>
          <Button
            type="button"
            variant="elevated"
            size="sm"
            className="w-7 h-7 p-0 bg-black text-white hover:bg-green-400 hover:text-black"
            onClick={() => onAdjust(1)}
            disabled={selectedQty >= availableQty || availableQty <= 0}
          >
            <Plus size={10} strokeWidth={3} />
          </Button>
        </div>
      )}
    </div>
  )
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      variant="elevated"
      disabled={disabled || pending}
      isLoading={pending}
      className="bg-black text-white hover:text-black hover:bg-green-400"
    >
      Invia richiesta di reso
    </Button>
  )
}

export default function ReturnRequestForm({
  order,
  returnReasons,
  shippingOptions,
  returnedQuantities,
  locationId,
}: ReturnRequestFormProps) {
  const router = useRouter()
  const { countryCode } = useParams() as { countryCode: string }
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({})
  const [selectedReason, setSelectedReason] = useState<string>("")
  const [selectedShippingOption, setSelectedShippingOption] = useState<string>(
    shippingOptions.length === 1 ? shippingOptions[0].id : ""
  )

  const [formState, formAction] = useFormState(createReturnRequest, {
    success: false,
    error: null,
  })

  const hasTriggeredRef = useRef(false)
  useEffect(() => {
    if (formState.success && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true
      toast.success("Richiesta di reso inviata con successo!")
      router.push(`/${countryCode}/account/orders/details/${order.id}`)
    }
  }, [formState.success, countryCode, order.id, router])

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) => {
      if (prev[itemId]) {
        const next = { ...prev }
        delete next[itemId]
        return next
      }
      return { ...prev, [itemId]: 1 }
    })
  }

  const adjustQty = (itemId: string, delta: number, maxQty: number) => {
    setSelectedItems((prev) => {
      const current = prev[itemId] ?? 1
      const next = Math.min(Math.max(current + delta, 1), maxQty)
      return { ...prev, [itemId]: next }
    })
  }

  const selectedCount = Object.keys(selectedItems).length

  const itemsPayload = Object.entries(selectedItems).map(([id, quantity]) => {
    const entry: { id: string; quantity: number; reason_id?: string } = {
      id,
      quantity,
    }
    if (selectedReason) entry.reason_id = selectedReason
    return entry
  })

  const sortedItems = [...(order.items ?? [])].sort((a, b) =>
    (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
  )

  return (
    <div className="flex flex-col gap-y-4">
      {/* Header */}
      <div className="flex gap-2 justify-between items-center mb-4">
        <h1 className="text-2xl font-black uppercase">
          Richiedi reso — Ordine #{order.display_id}
        </h1>
        <Button variant="elevated" size="sm" asChild>
          <LocalizedClientLink
            href={`/account/orders/details/${order.id}`}
            className="flex items-center gap-1.5 font-black uppercase hover:bg-green-400"
          >
            <ArrowLeft size={14} strokeWidth={3} /> Dettagli ordine
          </LocalizedClientLink>
        </Button>
      </div>

      <form action={formAction}>
        <input type="hidden" name="order_id" value={order.id} />
        {locationId && (
          <input type="hidden" name="location_id" value={locationId} />
        )}
        <input
          type="hidden"
          name="items"
          value={JSON.stringify(itemsPayload)}
        />
        <input
          type="hidden"
          name="return_shipping_option_id"
          value={selectedShippingOption}
        />

        {/* Video notice */}
        <div className="border border-black rounded-md p-4 bg-yellow-50 flex gap-3 items-start mb-2">
          <span className="text-lg leading-none mt-0.5">📦</span>
          <p className="text-sm text-black leading-relaxed">
            <strong>Attenzione:</strong> per tutti i resi è richiesto un{" "}
            <strong>video dell&apos;apertura del pacco</strong>. Verrai
            ricontattato per fornirlo prima che il reso venga accettato.
          </p>
        </div>

        <div className="flex flex-col gap-6 bg-white border border-black rounded-md p-6">
          {/* Items selection */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider mb-3 border-l-4 border-green-400 pl-2">
              Seleziona gli articoli da restituire
            </h2>
            <div className="flex flex-col gap-3">
              {sortedItems.map((item) => (
                <ReturnItemRow
                  key={item.id}
                  item={item}
                  isSelected={!!selectedItems[item.id]}
                  selectedQty={selectedItems[item.id] ?? 1}
                  returnedQty={returnedQuantities[item.id] ?? 0}
                  onToggle={() => toggleItem(item.id)}
                  onAdjust={(delta) =>
                    adjustQty(
                      item.id,
                      delta,
                      item.quantity - (returnedQuantities[item.id] ?? 0)
                    )
                  }
                />
              ))}
            </div>
          </div>

          {/* Return reason */}
          {returnReasons.length > 0 && (
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider mb-3 border-l-4 border-green-400 pl-2">
                Motivo del reso
              </h2>
              <div className="flex flex-col gap-2">
                {returnReasons.map((reason) => (
                  <label
                    key={reason.id}
                    className={clx(
                      "flex items-center gap-x-4 cursor-pointer py-4 px-6 border border-black rounded-md bg-white transition-all hover:bg-green-400 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                      selectedReason === reason.id && "bg-green-400"
                    )}
                  >
                    <input
                      type="radio"
                      name="reason_id"
                      value={reason.id}
                      className="sr-only"
                      checked={selectedReason === reason.id}
                      onChange={() => setSelectedReason(reason.id)}
                    />
                    <Radio checked={selectedReason === reason.id} />
                    <span className="text-sm font-medium">{reason.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Shipping option selector — shown only if multiple options */}
          {shippingOptions.length > 1 && (
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider mb-3 border-l-4 border-green-400 pl-2">
                Modalità di restituzione
              </h2>
              <div className="flex flex-col gap-2">
                {shippingOptions.map((option) => (
                  <label
                    key={option.id}
                    className={clx(
                      "flex items-center gap-x-4 cursor-pointer py-4 px-6 border border-black rounded-md bg-white transition-all hover:bg-green-400 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                      selectedShippingOption === option.id && "bg-green-400"
                    )}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      checked={selectedShippingOption === option.id}
                      onChange={() => setSelectedShippingOption(option.id)}
                    />
                    <Radio checked={selectedShippingOption === option.id} />
                    <span className="text-sm font-medium">{option.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* No shipping options configured */}
          {shippingOptions.length === 0 && (
            <div className="text-rose-500 text-small-regular py-2">
              Nessuna opzione di reso disponibile. Contattaci per assistenza.
            </div>
          )}

          {/* Optional note */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider mb-3 border-l-4 border-green-400 pl-2">
              Note aggiuntive (opzionale)
            </h2>
            <textarea
              name="note"
              rows={3}
              placeholder="Descrivi il problema o le condizioni degli articoli…"
              className="w-full border border-black rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-0"
            />
          </div>

          {/* Error */}
          {formState.error && (
            <div className="text-rose-500 text-small-regular py-2">
              {formState.error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between pt-2 border-t border-black">
            <p className="text-sm text-black/50">
              {selectedCount === 0
                ? "Seleziona almeno un articolo per continuare"
                : `${selectedCount} articol${
                    selectedCount > 1 ? "i selezionati" : "o selezionato"
                  }`}
            </p>
            <SubmitButton
              disabled={selectedCount === 0 || !selectedShippingOption}
            />
          </div>
        </div>
      </form>
    </div>
  )
}
