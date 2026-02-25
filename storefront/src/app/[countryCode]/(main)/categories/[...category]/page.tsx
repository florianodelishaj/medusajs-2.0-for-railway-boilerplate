import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle } from "@lib/data/categories"
import { StoreProductCategory } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getBaseURL } from "@lib/util/env"

type Props = {
  params: { category: string[]; countryCode: string }
  searchParams: {
    sortBy?: SortOptions
    page?: string
    min_price?: string
    max_price?: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { product_categories } = await getCategoryByHandle(params.category)

    if (!product_categories?.length) {
      notFound()
    }

    const title = product_categories
      .map((category: StoreProductCategory) => category.name)
      .join(" | ")

    const description =
      product_categories[product_categories.length - 1].description ??
      `${title} category.`

    return {
      title,
      description,
      alternates: {
        canonical: `${getBaseURL()}/${params.countryCode}/categories/${params.category.join("/")}`,
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { sortBy, page, min_price, max_price } = searchParams

  let product_categories
  try {
    const result = await getCategoryByHandle(params.category)
    product_categories = result?.product_categories
  } catch (error) {
    console.error("Error fetching category:", params.category, error)
    notFound()
  }

  if (!product_categories?.length) {
    notFound()
  }

  return (
    <CategoryTemplate
      categories={product_categories}
      sortBy={sortBy}
      page={page}
      minPrice={min_price}
      maxPrice={max_price}
      countryCode={params.countryCode}
    />
  )
}
