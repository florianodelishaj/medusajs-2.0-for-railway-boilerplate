import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

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
  }
  params: {
    countryCode: string
  }
}

export default async function StorePage({ searchParams, params }: Params) {
  const { sortBy, page, min_price, max_price } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      minPrice={min_price}
      maxPrice={max_price}
      countryCode={params.countryCode}
    />
  )
}
