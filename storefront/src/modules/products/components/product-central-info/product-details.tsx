import { HttpTypes } from "@medusajs/types"
import Accordion from "@modules/products/components/accordion"

type ProductDetailsProps = {
  product: HttpTypes.StoreProduct
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  return (
    <Accordion type="single" collapsible>
      <Accordion.Item title="Dettagli Prodotto" value="details">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col gap-3">
            <div className="border-l-4 border-black pl-3">
              <span className="font-bold text-xs uppercase text-gray-600 block mb-1">
                Materiale
              </span>
              <p className="font-medium text-black">
                {product.material ? product.material : "-"}
              </p>
            </div>
            <div className="border-l-4 border-black pl-3">
              <span className="font-bold text-xs uppercase text-gray-600 block mb-1">
                Paese d&apos;origine
              </span>
              <p className="font-medium text-black">
                {product.origin_country ? product.origin_country : "-"}
              </p>
            </div>
            <div className="border-l-4 border-black pl-3">
              <span className="font-bold text-xs uppercase text-gray-600 block mb-1">
                Tipo
              </span>
              <p className="font-medium text-black">
                {product.type ? product.type.value : "-"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="border-l-4 border-black pl-3">
              <span className="font-bold text-xs uppercase text-gray-600 block mb-1">
                Peso
              </span>
              <p className="font-medium text-black">
                {product.weight ? `${product.weight} g` : "-"}
              </p>
            </div>
            <div className="border-l-4 border-black pl-3">
              <span className="font-bold text-xs uppercase text-gray-600 block mb-1">
                Dimensioni
              </span>
              <p className="font-medium text-black">
                {product.length && product.width && product.height
                  ? `${product.length}L x ${product.width}L x ${product.height}A`
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      </Accordion.Item>
    </Accordion>
  )
}

export default ProductDetails
