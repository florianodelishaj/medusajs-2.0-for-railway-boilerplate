import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import DynamicBackground from "@modules/layout/components/dynamic-background"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: {
    sortBy?: SortOptions
    page?: string
    min_price?: string
    max_price?: string
    discounted?: string
  }
  params: {
    countryCode: string
  }
}

export default async function StorePage({ searchParams, params }: Params) {
  const { sortBy, page, min_price, max_price, discounted } = searchParams

  return (
    <DynamicBackground backgroundImage={null}>
      <StoreTemplate
        sortBy={sortBy}
        page={page}
        minPrice={min_price}
        maxPrice={max_price}
        discounted={discounted}
        countryCode={params.countryCode}
      />
    </DynamicBackground>
  )
}
