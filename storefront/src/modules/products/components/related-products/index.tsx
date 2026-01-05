import Product from "../product-preview"
import { getRegion } from "@lib/data/regions"
import { getProductsListWithSort } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

type RelatedProductsParams = {
  region_id?: string
  category_id?: string[]
  is_giftcard?: boolean
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Logica prodotti correlati: mostra tutti i prodotti della categoria root + sottocategorie
  const queryParams: RelatedProductsParams = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }

  if (product.categories && product.categories.length > 0) {
    // Passa semplicemente la categoria del prodotto
    // Il backend si occupa automaticamente di risalire alla root e raccogliere tutti i discendenti
    queryParams.category_id = [product.categories[0].id]
  }

  queryParams.is_giftcard = false

  const { response } = await getProductsListWithSort({
    page: 1,
    queryParams,
    includeRootFamily: true, // Attiva la risalita alla root nel backend
    countryCode,
  })

  const products = response.products.filter(
    (responseProduct) => responseProduct.id !== product.id
  )

  if (!products.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="bg-white border border-black rounded-md px-8 py-4 mb-8">
          <span className="text-xl font-bold uppercase text-black block mb-2">
            Prodotti Correlati
          </span>
          <p className="text-lg text-gray-800 max-w-lg">
            Potrebbero interessarti anche questi prodotti.
          </p>
        </div>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {products.map((product) => (
          <li key={product.id}>
            {region && <Product region={region} product={product} />}
          </li>
        ))}
      </ul>
    </div>
  )
}
