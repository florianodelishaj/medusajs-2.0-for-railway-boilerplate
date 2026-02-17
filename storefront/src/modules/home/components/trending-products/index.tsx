import { HttpTypes } from "@medusajs/types"
import { TrendingUp, ArrowRight } from "lucide-react"
import TrendingProductsCarousel from "./carousel"
import { Button } from "@components/ui/button"
import Link from "next/link"

export default function TrendingProducts({
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
    <section className="bg-green-400/15 py-10">
      <div className="content-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-9 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-green-400 border border-black p-3 rounded-md">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-2xl md:text-4xl font-black uppercase">
              Prodotti di Tendenza
            </h2>
          </div>

          <Button
            variant="elevated"
            size="lg"
            className="uppercase bg-white hover:bg-green-400 group w-fit"
            asChild
          >
            <Link href="/store?tag=Tendenze">
              Vedi tutte le tendenze
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <TrendingProductsCarousel products={products} totalCount={totalCount} />
      </div>
    </section>
  )
}
