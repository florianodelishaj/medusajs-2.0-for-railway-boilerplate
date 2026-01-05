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
    return (variant.inventory_quantity || 0) <= 0
  })

  // Check if product has discount
  const hasDiscount =
    cheapestPrice?.price_type === "sale" ||
    (cheapestPrice?.original_price_number &&
      cheapestPrice?.calculated_price_number &&
      cheapestPrice.original_price_number > cheapestPrice.calculated_price_number)

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
        className="bg-white border border-black rounded-md hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
        style={categoryColor ? { backgroundColor: categoryColor } : {}}
      >
        <div className="relative overflow-hidden rounded-tl-md rounded-tr-md">
          {isOutOfStock && (
            <div className="absolute top-4 -left-10 z-10 w-40 text-center bg-gray-800 border-2 border-black py-1 transform -rotate-45 shadow-lg">
              <span className="text-xs font-bold uppercase text-white">
                Esaurito
              </span>
            </div>
          )}
          {!isOutOfStock && hasDiscount && (
            <div className="absolute top-4 -left-10 z-10 w-40 text-center bg-red-500 border-2 border-black py-1 transform -rotate-45 shadow-lg">
              <span className="text-xs font-bold uppercase text-white">
                Sconto
              </span>
            </div>
          )}
          <Thumbnail
            className="rounded-tl-lg rounded-tr-lg rounded-b-none"
            thumbnail={product.thumbnail}
            images={product.images}
            size="square"
            isFeatured={isFeatured}
          />
        </div>
        <div className="p-4 flex flex-col gap-4 justify-between">
          <Text data-testid="product-title" className="font-bold">
            {product.title}
          </Text>
        </div>
        <div className="p-4 border-t">
          <div className="relative px-2 py-1 border bg-green-400 w-fit">
            {cheapestPrice && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Text className="text-black font-bold text-lg" data-testid="price">
                    {cheapestPrice.calculated_price}
                  </Text>
                  {hasDiscount && hasDiscountPercentage > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-500 text-white font-bold text-xs rounded border border-black">
                      -{hasDiscountPercentage}%
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <Text
                    className="line-through text-gray-800 text-sm"
                    data-testid="original-price"
                  >
                    {cheapestPrice.original_price}
                  </Text>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
