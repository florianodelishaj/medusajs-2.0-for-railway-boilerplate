import { getCategoriesList } from "@lib/data/categories"
import { getCollectionsList } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
  const { collections } = await getCollectionsList(0, 6)
  const { product_categories } = await getCategoriesList(0, 6)

  return (
    <footer className="px-4 py-6 border-t w-full">
      <LocalizedClientLink
        href="/"
        className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
      >
        NOX STORE
      </LocalizedClientLink>
    </footer>
  )
}
