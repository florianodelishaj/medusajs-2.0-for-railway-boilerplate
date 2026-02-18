import { HttpTypes } from "@medusajs/types"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

import ProductPreview from "@modules/products/components/product-preview"
import ScrollReveal from "@modules/common/components/scroll-reveal"

export default function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const { products } = collection

  if (!products) {
    return null
  }

  return (
    <div className="px-4 lg:px-12 py-12 md:py-16">
      <ScrollReveal>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
            {collection.title}
          </h2>
          <Link
            href={`/collections/${collection.handle}`}
            className="group flex items-center gap-2 text-sm font-bold uppercase hover:text-green-600 transition-colors duration-200"
          >
            Vedi tutti
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-5 gap-y-8 small:gap-y-12">
          {products &&
            products.map((product) => (
              <li key={product.id}>
                {/* @ts-ignore */}
                <ProductPreview product={product} region={region} isFeatured />
              </li>
            ))}
        </ul>
      </ScrollReveal>
    </div>
  )
}
