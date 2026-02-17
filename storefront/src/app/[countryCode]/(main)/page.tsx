import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import DiscountedProducts from "@modules/home/components/discounted-products"
import TrendingProducts from "@modules/home/components/trending-products"
import BenefitsBar from "@modules/home/components/benefits-bar"
import SponsorCarousel from "@modules/home/components/sponsor-carousel"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { getDiscountedProducts, getProductsByTag } from "@lib/data/products"

export const metadata: Metadata = {
  title: "Il Covo di Xur",
  description:
    "Scopri la nostra collezione di Funko Pop, carte Pokémon e collezionabili. Spedizione gratuita disponibile.",
}

export default async function Home({
  params: { countryCode },
}: {
  params: { countryCode: string }
}) {
  const [collections, region, discountedData, trendingData] = await Promise.all(
    [
      getCollectionsWithProducts(countryCode),
      getRegion(countryCode),
      getDiscountedProducts(countryCode, 16),
      getProductsByTag(countryCode, "Tendenze", 16),
    ]
  )

  const { products: discountedProducts, count: discountedCount } =
    discountedData
  const { products: trendingProducts, count: trendingCount } = trendingData

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <TrendingProducts
        products={trendingProducts}
        totalCount={trendingCount}
        region={region}
      />
      <DiscountedProducts
        products={discountedProducts}
        totalCount={discountedCount}
        region={region}
      />
      <BenefitsBar />
      {/* <SponsorCarousel /> */}
      <div>
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
