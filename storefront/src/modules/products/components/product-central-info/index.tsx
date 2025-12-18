"use client"

import { Heading, Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPrice from "@modules/products/components/product-price"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import ProductDetails from "./product-details"
import { useProductSelection } from "@modules/products/components/product-actions/context"

type ProductCentralInfoProps = {
  product: HttpTypes.StoreProduct
  showTitle?: boolean
  showVariants?: boolean
  showDescription?: boolean
  showDetails?: boolean
}

const ProductCentralInfo = ({
  product: _product,
  showTitle = true,
  showVariants = true,
  showDescription = true,
  showDetails = true,
}: ProductCentralInfoProps) => {
  const { product, options, setOptionValue, selectedVariant, disabled } =
    useProductSelection()

  return (
    <div className="flex flex-col gap-6">
      {/* Badge Collezione (opzionale) */}
      {product.collection && (
        <LocalizedClientLink
          href={`/collections/${product.collection.handle}`}
          className="text-sm font-bold uppercase text-black hover:text-pink-600 transition-colors px-3 py-1 border border-black w-fit rounded-md"
        >
          {product.collection.title}
        </LocalizedClientLink>
      )}

      {/* Titolo - nascosto su mobile se showTitle è false */}
      {showTitle && (
        <Heading
          level="h1"
          className="hidden xl:block text-3xl font-black uppercase text-black"
          data-testid="product-title"
        >
          {product.title}
        </Heading>
      )}

      {/* Prezzo */}
      {/* <div className="bg-white border border-black rounded-md p-4">
        <ProductPrice product={product} variant={selectedVariant} />
      </div> */}

      {/* Selezione Varianti */}
      {showVariants && (product.variants?.length ?? 0) > 1 && (
        <div className="bg-white border border-black rounded-md p-6">
          <h3 className="text-lg font-black uppercase mb-4 text-black">
            Seleziona Variante
          </h3>
          <div className="flex flex-col gap-4">
            {(product.options || []).map((option) => {
              return (
                <div key={option.id}>
                  <OptionSelect
                    option={option}
                    current={options[option.title ?? ""]}
                    updateOption={setOptionValue}
                    title={option.title ?? ""}
                    data-testid="product-options"
                    disabled={!!disabled}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Descrizione */}
      {showDescription && product.description && (
        <div className="bg-white border border-black rounded-md p-6">
          <h3 className="text-lg font-black uppercase mb-4 text-black">
            Descrizione
          </h3>
          <Text
            className="text-base text-gray-800 whitespace-pre-line leading-relaxed"
            data-testid="product-description"
          >
            {product.description}
          </Text>
        </div>
      )}

      {/* Dettagli Prodotto */}
      {showDetails && <ProductDetails product={product} />}
    </div>
  )
}

export default ProductCentralInfo
