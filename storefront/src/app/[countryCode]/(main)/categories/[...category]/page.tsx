import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreProductCategory, StoreRegion } from "@medusajs/types"
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

export async function generateStaticParams() {
  try {
    const product_categories = await listCategories()

    if (!product_categories?.length) {
      return []
    }

    const regions = await listRegions()
    const countryCodes = (regions ?? [])
      .flatMap((r: StoreRegion) => r.countries?.map((c: any) => c.iso_2) ?? [])

    const categoryHandles = product_categories.map(
      (category: any) => category.handle
    )

    const staticParams = (countryCodes ?? [])
      .map((countryCode: string | undefined) =>
        categoryHandles.map((handle: any) => ({
          countryCode,
          category: [handle],
        }))
      )
      .flat()

    return staticParams
  } catch (error) {
    console.error("Error generating static params for categories:", error)
    return []
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
