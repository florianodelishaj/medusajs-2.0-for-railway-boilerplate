import { Text } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { getProductsById } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
  categoryColor,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  categoryColor?: string
}) {
  const [pricedProduct] = await getProductsById({
    ids: [product.id!],
    regionId: region.id,
  })

  if (!pricedProduct) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product: pricedProduct,
  })

  // Check if all variants are out of stock
  const isOutOfStock = pricedProduct.variants?.every((variant) => {
    if (!variant.manage_inventory) return false
    if (variant.allow_backorder) return false
    return (variant.inventory_quantity || 0) <= 0
  })

  // Check if any variant is in backorder (inventory ≤ 0 but allow_backorder is true)
  const isBackorder = pricedProduct.variants?.some((variant) => {
    if (!variant.manage_inventory) return false
    return variant.allow_backorder && (variant.inventory_quantity || 0) <= 0
  })

  // Check if product has discount
  const hasDiscount =
    cheapestPrice?.price_type === "sale" ||
    (cheapestPrice?.original_price_number &&
      cheapestPrice?.calculated_price_number &&
      cheapestPrice.original_price_number >
        cheapestPrice.calculated_price_number)

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div
        data-testid="product-wrapper"
        className="bg-white border border-black rounded-md overflow-hidden hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
        style={categoryColor ? { backgroundColor: categoryColor } : {}}
      >
        <div className="relative overflow-hidden rounded-tl-md rounded-tr-md">
          {isOutOfStock && (
            <div className="absolute top-3 md:top-4 -left-8 md:-left-10 z-10 w-32 md:w-40 text-center bg-gray-800 border border-black py-1 transform -rotate-45 shadow-lg">
              <span className="text-xs font-bold uppercase text-white">
                Esaurito
              </span>
            </div>
          )}
          {!isOutOfStock && isBackorder && (
            <div className="absolute top-3 md:top-4 -left-8 md:-left-10 z-10 w-32 md:w-40 text-center bg-yellow-400 border border-black py-1 transform -rotate-45 shadow-lg">
              <span className="text-xs font-bold uppercase text-black">
                Preordina
              </span>
            </div>
          )}
          {!isOutOfStock && !isBackorder && hasDiscount && (
            <div className="absolute top-3 md:top-4 -left-8 md:-left-10 z-10 w-32 md:w-40 text-center bg-red-500 border border-black py-1 transform -rotate-45 shadow-lg">
              <span className="text-xs font-bold uppercase text-white">
                Sconto
              </span>
            </div>
          )}
          {!isOutOfStock && !isBackorder && hasDiscount && cheapestPrice?.percentage_diff && (
            <div className="md:hidden absolute top-2 right-2 z-10 bg-red-500 border border-black px-2 py-1">
              <span className="text-white font-black text-xs">-{cheapestPrice.percentage_diff}%</span>
            </div>
          )}
          {!isOutOfStock &&
            !isBackorder &&
            !hasDiscount &&
            product.tags?.some((tag: any) => tag.value === "Tendenze") && (
              <div className="absolute top-3 md:top-4 -left-8 md:-left-10 z-10 w-32 md:w-40 text-center bg-pink-400 border border-black py-1 transform -rotate-45 shadow-lg">
                <span className="text-xs font-bold uppercase text-white">
                  Tendenza
                </span>
              </div>
            )}
          <Thumbnail
            className="rounded-tl-lg rounded-tr-lg rounded-b-none"
            thumbnail={product.thumbnail}
            images={product.images}
            size="square"
            isFeatured={isFeatured}
            alt={product.title}
          />
        </div>
        <div className="p-4 flex flex-col gap-4 justify-between min-h-[5rem]">
          <Text data-testid="product-title" className="font-bold line-clamp-2">
            {product.title}
          </Text>
          {/* TODO: stampa del tag sulla product card */}
          {/* {product.tags?.map((tag: any) => (
            <div
              key={tag.id}
              className="w-fit px-2 py-1 border"
              style={
                tag.metadata?.color
                  ? { backgroundColor: tag.metadata.color }
                  : {}
              }
            >
              {tag.value}
            </div>
          ))} */}
        </div>
        <div className="border-t border-black">
          {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
