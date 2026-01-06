import { Metadata } from "next"
import { notFound } from "next/navigation"

import ProductTemplate from "@modules/products/templates"
import { getRegion, listRegions } from "@lib/data/regions"
import { getProductByHandle, getProductsList } from "@lib/data/products"
import { getTopLevelCategories } from "@lib/data/categories"
import DynamicBackground from "@modules/layout/components/dynamic-background"
import { findTopLevelCategory, getCategoryBackground } from "@lib/util/get-category-background"

type Props = {
  params: { countryCode: string; handle: string }
}

export async function generateStaticParams() {
  const countryCodes = await listRegions().then(
    (regions) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )

  if (!countryCodes) {
    return null
  }

  const products = await Promise.all(
    countryCodes.map((countryCode) => {
      return getProductsList({ countryCode })
    })
  ).then((responses) =>
    responses.map(({ response }) => response.products).flat()
  )

  const staticParams = countryCodes
    ?.map((countryCode) =>
      products.map((product) => ({
        countryCode,
        handle: product.handle,
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await getProductByHandle(handle, region.id)

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const pricedProduct = await getProductByHandle(params.handle, region.id)
  if (!pricedProduct) {
    notFound()
  }

  // Calculate background image server-side
  const categories = await getTopLevelCategories()
  let backgroundImage: string | null = null

  if (pricedProduct.categories && pricedProduct.categories.length > 0) {
    const topLevelCategory = findTopLevelCategory(
      pricedProduct.categories[0].id,
      categories || []
    )
    backgroundImage = getCategoryBackground(topLevelCategory)
  }

  return (
    <DynamicBackground backgroundImage={backgroundImage}>
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={params.countryCode}
      />
    </DynamicBackground>
  )
}
