import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import DiscountedProducts from "@modules/home/components/discounted-products"
import BenefitsBar from "@modules/home/components/benefits-bar"
import SponsorCarousel from "@modules/home/components/sponsor-carousel"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { getDiscountedProducts } from "@lib/data/products"

export const metadata: Metadata = {
  title: "Nox E-commerce - Collezionabili Funko Pop e Pokémon",
  description:
    "Scopri la nostra collezione di Funko Pop, carte Pokémon e collezionabili. Spedizione gratuita sopra i €50.",
}

export default async function Home({
  params: { countryCode },
}: {
  params: { countryCode: string }
}) {
  const collections = await getCollectionsWithProducts(countryCode)
  const region = await getRegion(countryCode)
  const { products: discountedProducts, count: discountedCount } =
    await getDiscountedProducts(countryCode, 16)

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <DiscountedProducts
        products={discountedProducts}
        totalCount={discountedCount}
        region={region}
      />
      <BenefitsBar />
      <SponsorCarousel />
      <div>
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
