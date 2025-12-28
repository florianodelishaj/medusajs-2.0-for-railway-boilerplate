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

  // Check if product has discount
  const hasDiscount =
    cheapestPrice?.price_type === "sale" ||
    (cheapestPrice?.original_price_number &&
      cheapestPrice?.calculated_price_number &&
      cheapestPrice.original_price_number > cheapestPrice.calculated_price_number)

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
        <div className="p-4 border-t">
          <div className="relative px-2 py-1 border bg-green-400 w-fit">
            <span>
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
