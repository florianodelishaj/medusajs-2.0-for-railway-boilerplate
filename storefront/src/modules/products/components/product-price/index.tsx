import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  // Verifica se c'è uno sconto confrontando i prezzi o controllando il tipo
  const hasDiscount =
    selectedPrice.price_type === "sale" ||
    (selectedPrice.original_price_number > selectedPrice.calculated_price_number)

  return (
    <div className="flex flex-col gap-2">
      {/* Prezzo finale */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-3xl font-black text-black"
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {!variant && "A partire da "}
          {selectedPrice.calculated_price}
        </span>

        {/* Badge sconto rosso */}
        {hasDiscount && (
          <span className="px-2 py-1 bg-red-500 text-white font-bold text-sm rounded border border-black">
            -{selectedPrice.percentage_diff}%
          </span>
        )}
      </div>

      {/* Prezzo originale barrato */}
      {hasDiscount && (
        <span
          className="text-lg line-through text-gray-500"
          data-testid="original-product-price"
          data-value={selectedPrice.original_price_number}
        >
          {selectedPrice.original_price}
        </span>
      )}
    </div>
  )
}
