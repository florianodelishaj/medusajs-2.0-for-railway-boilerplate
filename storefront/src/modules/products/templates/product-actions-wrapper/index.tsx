import { getProductsById } from "@lib/data/products"
import { retrieveCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"
import { ReactNode } from "react"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
  children,
}: {
  id: string
  region: HttpTypes.StoreRegion
  children: ReactNode
}) {
  const cart = await retrieveCart()

  const product = await getProductsById({
    ids: [id],
    regionId: region.id,
    cartId: cart?.id,
  }).then((products) => products[0])

  if (!product) {
    return null
  }

  return (
    <ProductActions product={product} region={region} cart={cart}>
      {children}
    </ProductActions>
  )
}
