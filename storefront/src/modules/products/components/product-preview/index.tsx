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
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
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

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div
        data-testid="product-wrapper"
        className="border border-black rounded-lg hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
      >
        <Thumbnail
          className="rounded-tl-lg rounded-tr-lg rounded-b-none"
          thumbnail={product.thumbnail}
          images={product.images}
          size="square"
          isFeatured={isFeatured}
        />
        <div className="p-4 flex flex-col gap-4 justify-between">
          <Text data-testid="product-title" className="font-bold">
            {product.title}
          </Text>
          {product.tags?.map((tag: any) => (
            <div
              key={tag.id}
              className="w-fit px-2 py-1 rounded"
              style={
                tag.metadata?.color
                  ? { backgroundColor: tag.metadata.color }
                  : {}
              }
            >
              {tag.value}
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <div className="relative px-2 py-1 border bg-pink-400 w-fit">
            <span>
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
