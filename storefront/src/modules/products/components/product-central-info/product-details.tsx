import { HttpTypes } from "@medusajs/types"
import Accordion from "@modules/products/components/accordion"

type ProductDetailsProps = {
  product: HttpTypes.StoreProduct
}

type CustomAttribute = {
  label: string
  value: string
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  // Estrai custom_attributes dai metadata
  const customAttributes =
    (product.metadata?.custom_attributes as CustomAttribute[]) || []

  // Se non ci sono attributi custom, non mostrare l'accordion
  if (customAttributes.length === 0) {
    return null
  }

  // Dividi gli attributi in due colonne
  const midPoint = Math.ceil(customAttributes.length / 2)
  const leftColumn = customAttributes.slice(0, midPoint)
  const rightColumn = customAttributes.slice(midPoint)

  return (
    <Accordion type="single" collapsible>
      <Accordion.Item title="Dettagli Prodotto" value="details">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 text-sm">
          {/* Colonna sinistra */}
          <div className="flex flex-col gap-3">
            {leftColumn.map((attr, index) => (
              <div key={index} className="border-l-4 border-black pl-3">
                <span className="font-bold text-xs uppercase text-gray-600 block mb-1">
                  {attr.label}
                </span>
                <p className="font-medium text-black">{attr.value || "-"}</p>
              </div>
            ))}
          </div>

          {/* Colonna destra */}
          <div className="flex flex-col gap-3">
            {rightColumn.map((attr, index) => (
              <div key={index} className="border-l-4 border-black pl-3">
                <span className="font-bold text-xs uppercase text-gray-600 block mb-1">
                  {attr.label}
                </span>
                <p className="font-medium text-black">{attr.value || "-"}</p>
              </div>
            ))}
          </div>
        </div>
      </Accordion.Item>
    </Accordion>
  )
}

export default ProductDetails
