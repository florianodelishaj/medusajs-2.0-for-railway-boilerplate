import { HttpTypes } from "@medusajs/types"
import { Tag, ArrowRight } from "lucide-react"
import DiscountedProductsCarousel from "./carousel"
import { Button } from "@components/ui/button"
import Link from "next/link"

export default function DiscountedProducts({
  products,
  totalCount,
  region,
}: {
  products: HttpTypes.StoreProduct[]
  totalCount: number
  region: HttpTypes.StoreRegion
}) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="content-container py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-9 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-green-400 border border-black p-3 rounded-md">
            <Tag className="w-6 h-6 text-black" />
          </div>
          <h2 className="text-2xl md:text-4xl font-black uppercase">
            Prodotti in Sconto
          </h2>
        </div>

        <Button
          variant="elevated"
          size="lg"
          className="uppercase bg-white hover:bg-green-400 group w-fit"
          asChild
        >
          <Link href="/store?discounted=true">
            Vedi tutti gli sconti
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>

      <DiscountedProductsCarousel products={products} totalCount={totalCount} />
    </section>
  )
}
