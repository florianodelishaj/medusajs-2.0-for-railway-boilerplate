import { HttpTypes } from "@medusajs/types"
import Accordion from "@modules/products/components/accordion"

type ProductExtendedDescriptionProps = {
  product: HttpTypes.StoreProduct
}

const ProductExtendedDescription = ({
  product,
}: ProductExtendedDescriptionProps) => {
  const extendedDescription = product.metadata?.extended_description as
    | string
    | undefined

  // Se non c'è descrizione estesa, non mostrare l'accordion
  if (!extendedDescription) {
    return null
  }

  // Controlla se il contenuto HTML è effettivamente vuoto (rimuove tag HTML e controlla se c'è testo)
  const textContent = extendedDescription.replace(/<[^>]*>/g, "").trim()
  if (!textContent) {
    return null
  }

  return (
    <Accordion type="single" collapsible>
      <Accordion.Item title="Descrizione" value="extended-description">
        <style
          dangerouslySetInnerHTML={{
            __html: `.extended-desc strong, .extended-desc em, .extended-desc b, .extended-desc i { color: inherit; }`,
          }}
        />
        <div
          className="extended-desc prose prose-sm max-w-none text-gray-800 prose-headings:text-black prose-h2:text-2xl prose-h2:font-bold prose-h3:text-xl prose-h3:font-semibold prose-ul:list-disc prose-ol:list-decimal prose-li:my-1 prose-p:my-2"
          dangerouslySetInnerHTML={{
            __html: extendedDescription,
          }}
        />
      </Accordion.Item>
    </Accordion>
  )
}

export default ProductExtendedDescription
