import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="flex flex-col gap-4">
      {product.collection && (
        <LocalizedClientLink
          href={`/collections/${product.collection.handle}`}
          className="text-sm font-bold uppercase text-black hover:text-pink-600 transition-colors px-3 py-1 border border-black w-fit rounded-md"
        >
          {product.collection.title}
        </LocalizedClientLink>
      )}

      <div className="bg-white border border-black rounded-md p-6">
        <Heading
          level="h1"
          className={`text-3xl font-black uppercase text-black ${product.description ? "mb-4" : ""}`}
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        {product.description && (
          <Text
            className="text-base text-gray-800 whitespace-pre-line leading-relaxed"
            data-testid="product-description"
          >
            {product.description}
          </Text>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
