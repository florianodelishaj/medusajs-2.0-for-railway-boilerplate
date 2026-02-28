import { Metadata } from "next"
import { notFound } from "next/navigation"

import ProductTemplate from "@modules/products/templates"
import { getRegion, listRegions } from "@lib/data/regions"
import { getProductByHandle, getProductsList } from "@lib/data/products"
import { getTopLevelCategories } from "@lib/data/categories"
import DynamicBackground from "@modules/layout/components/dynamic-background"
import {
  findTopLevelCategory,
  getCategoryBackground,
  getCategoryColor,
} from "@lib/util/get-category-background"
import { getBaseURL } from "@lib/util/env"

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

  const title = product.title
  const description =
    product.description?.slice(0, 160) ||
    `Acquista ${product.title} su Il Covo di Xur. Funko Pop, carte Pokémon e collezionabili.`
  const ogImage = product.thumbnail
    ? [{ url: product.thumbnail, width: 800, height: 800, alt: product.title }]
    : []

  return {
    title,
    description,
    alternates: {
      canonical: `${getBaseURL()}/${params.countryCode}/products/${handle}`,
    },
    openGraph: {
      type: "website",
      title,
      description,
      images: ogImage,
    },
    twitter: {
      title,
      description,
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

  // Calculate background and category server-side
  const categories = await getTopLevelCategories()
  let backgroundImage: string | null = null
  let categoryColor: string | null = null
  let topLevelCategory = null

  if (pricedProduct.categories && pricedProduct.categories.length > 0) {
    topLevelCategory = findTopLevelCategory(
      pricedProduct.categories[0].id,
      categories || []
    )
    backgroundImage = getCategoryBackground(topLevelCategory)
    if (!backgroundImage) {
      categoryColor = getCategoryColor(topLevelCategory)
    }
  }

  const cheapestPrice = pricedProduct.variants
    ?.flatMap((v) =>
      v.calculated_price?.calculated_amount != null
        ? [v.calculated_price.calculated_amount]
        : []
    )
    .sort((a, b) => Number(a) - Number(b))[0]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pricedProduct.title,
    ...(pricedProduct.thumbnail && { image: pricedProduct.thumbnail }),
    description:
      pricedProduct.description ||
      `Acquista ${pricedProduct.title} su Il Covo di Xur.`,
    brand: { "@type": "Brand", name: "Il Covo di Xur" },
    ...(cheapestPrice != null && {
      offers: {
        "@type": "Offer",
        price: (Number(cheapestPrice) / 100).toFixed(2),
        priceCurrency: region.currency_code.toUpperCase(),
        availability: "https://schema.org/InStock",
        url: `${getBaseURL()}/${params.countryCode}/products/${pricedProduct.handle}`,
      },
    }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DynamicBackground backgroundImage={backgroundImage} categoryColor={categoryColor}>
        <ProductTemplate
          product={pricedProduct}
          region={region}
          countryCode={params.countryCode}
          topLevelCategory={topLevelCategory}
        />
      </DynamicBackground>
    </>
  )
}
