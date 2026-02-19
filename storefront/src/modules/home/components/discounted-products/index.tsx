import { HttpTypes } from "@medusajs/types"
import { Tag, ArrowRight } from "lucide-react"
import DiscountedProductsCarousel from "./carousel"
import { Button } from "@components/ui/button"
import Link from "next/link"
import ScrollReveal from "@modules/common/components/scroll-reveal"

export default function DiscountedProducts({
  products,
  totalCount,
}: {
  products: HttpTypes.StoreProduct[]
  totalCount: number
  region?: HttpTypes.StoreRegion
}) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="py-12 md:py-16">
      <div className="px-4 lg:px-12">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-9 h-9 bg-green-400 border border-black rounded-md">
                  <Tag className="w-5 h-5" />
                </span>
                Prodotti in Sconto
              </h2>
            </div>

            <Button
              variant="elevated"
              size="lg"
              className="uppercase bg-white hover:bg-green-400 group w-fit transition-all duration-200 shrink-0"
              asChild
            >
              <Link href="/store?discounted=true">
                Vedi tutti gli sconti
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <DiscountedProductsCarousel
            products={products}
            totalCount={totalCount}
          />
        </ScrollReveal>
      </div>
    </section>
  )
}
