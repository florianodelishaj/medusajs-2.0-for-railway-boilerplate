"use client"

import { Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"

export default function ProductPreviewClient({
  product,
  isFeatured,
  categoryColor,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  categoryColor?: string
}) {
  const { cheapestPrice } = getProductPrice({
    product: product,
  })

  // Check if all variants are out of stock
  const isOutOfStock = product.variants?.every((variant) => {
    if (!variant.manage_inventory) return false
    if (variant.allow_backorder) return false
    // Se inventory_quantity è undefined, non considerare il prodotto esaurito
    // (significa che i dati inventory non sono disponibili)
    if (
      variant.inventory_quantity === undefined ||
      variant.inventory_quantity === null
    ) {
      return false
    }
    return variant.inventory_quantity <= 0
  })

  // Check if product has discount
  const hasDiscount =
    cheapestPrice?.price_type === "sale" ||
    (cheapestPrice?.original_price_number &&
      cheapestPrice?.calculated_price_number &&
      cheapestPrice.original_price_number >
        cheapestPrice.calculated_price_number)

  const hasDiscountPercentage =
    hasDiscount &&
    cheapestPrice?.original_price_number &&
    cheapestPrice?.calculated_price_number
      ? Math.round(
          ((cheapestPrice.original_price_number -
            cheapestPrice.calculated_price_number) /
            cheapestPrice.original_price_number) *
            100
        )
      : 0

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div
        data-testid="product-wrapper"
        className="bg-white border border-black rounded-md overflow-hidden hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
        style={categoryColor ? { backgroundColor: categoryColor } : {}}
      >
        <div className="relative overflow-hidden">
          {isOutOfStock && (
            <div className="absolute top-3 md:top-4 -left-8 md:-left-10 z-10 w-32 md:w-40 text-center bg-gray-800 border border-black py-1 transform -rotate-45 shadow-lg">
              <span className="text-xs font-bold uppercase text-white">
                Esaurito
              </span>
            </div>
          )}
          {!isOutOfStock && hasDiscount && (
            <div className="absolute top-3 md:top-4 -left-8 md:-left-10 z-10 w-32 md:w-40 text-center bg-red-500 border border-black py-1 transform -rotate-45 shadow-lg">
              <span className="text-xs font-bold uppercase text-white">
                Sconto
              </span>
            </div>
          )}
          {!isOutOfStock && hasDiscount && hasDiscountPercentage > 0 && (
            <div className="md:hidden absolute top-2 right-2 z-10 bg-red-500 border border-black px-2 py-1">
              <span className="text-white font-black text-xs">-{hasDiscountPercentage}%</span>
            </div>
          )}
          {!isOutOfStock &&
            !hasDiscount &&
            product.tags?.some((tag: any) => tag.value === "Tendenze") && (
              <div className="absolute top-3 md:top-4 -left-8 md:-left-10 z-10 w-32 md:w-40 text-center bg-pink-400 border border-black py-1 transform -rotate-45 shadow-lg">
                <span className="text-xs font-bold uppercase text-white">
                  Tendenza
                </span>
              </div>
            )}
          <Thumbnail
            className="!rounded-none"
            thumbnail={product.thumbnail}
            images={product.images}
            size="square"
            isFeatured={isFeatured}
          />
        </div>
        <div className="p-4 flex flex-col gap-4 justify-between min-h-[5rem]">
          <Text data-testid="product-title" className="font-bold line-clamp-2">
            {product.title}
          </Text>
        </div>
        <div className="border-t border-black">
          {cheapestPrice && (
            <div className="flex items-stretch min-h-[2.5rem]">
              <div className="flex-1 bg-green-400 px-4 py-2 flex items-center gap-2">
                {hasDiscount && (
                  <Text
                    className="text-sm text-black/50 line-through"
                    data-testid="original-price"
                  >
                    {cheapestPrice.original_price}
                  </Text>
                )}
                <Text
                  className="font-black text-base"
                  data-testid="price"
                >
                  {cheapestPrice.calculated_price}
                </Text>
              </div>
              {hasDiscount && hasDiscountPercentage > 0 && (
                <div className="hidden md:flex bg-red-500 border-l border-black px-3 items-center justify-center shrink-0">
                  <span className="text-white font-black text-sm whitespace-nowrap">
                    -{hasDiscountPercentage}%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
