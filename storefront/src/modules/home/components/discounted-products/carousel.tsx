"use client"

import { useCallback, useEffect, useState, useMemo } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import Link from "next/link"
import ProductPreviewClient from "@modules/products/components/product-preview-client"

interface CarouselProps {
  products: HttpTypes.StoreProduct[]
  totalCount: number
}

export default function DiscountedProductsCarousel({
  products,
  totalCount,
}: CarouselProps) {
  // Filtra i prodotti esauriti dal carosello
  const availableProducts = useMemo(() => {
    return products.filter((product) => {
      // Se non ha varianti, consideralo non disponibile
      if (!product.variants || product.variants.length === 0) {
        return false
      }

      // Il prodotto è disponibile se ALMENO UNA variante è disponibile
      return product.variants.some((variant) => {
        // Se non gestisce l'inventario, è sempre disponibile
        if (!variant.manage_inventory) return true
        // Se permette backorder, è disponibile
        if (variant.allow_backorder) return true
        // Se inventory_quantity è undefined/null, consideriamolo disponibile
        if (
          variant.inventory_quantity === undefined ||
          variant.inventory_quantity === null
        ) {
          return true
        }
        // Altrimenti controlla che sia > 0
        return variant.inventory_quantity > 0
      })
    })
  }, [products])

  const autoplayPlugin = useMemo(
    () => Autoplay({ delay: 4000, stopOnInteraction: true }),
    []
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
      breakpoints: {
        "(min-width: 768px)": { slidesToScroll: 2 },
        "(min-width: 1024px)": { slidesToScroll: 3 },
      },
    },
    [autoplayPlugin]
  )

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev()
      autoplayPlugin.stop()
    }
  }, [emblaApi, autoplayPlugin])

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext()
      autoplayPlugin.stop()
    }
  }, [emblaApi, autoplayPlugin])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index)
        autoplayPlugin.stop()
      }
    },
    [emblaApi, autoplayPlugin]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  // Handle viewport resize to update dots
  useEffect(() => {
    if (!emblaApi) return

    const handleResize = () => {
      emblaApi.reInit()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [emblaApi])

  return (
    <div className="relative py-4">
      {/* Carousel Container */}
      <div className="overflow-hidden py-2" ref={emblaRef}>
        <div className="flex gap-6">
          {availableProducts.map((product) => (
            <div
              key={product.id}
              className="flex-[0_0_calc(50%-12px)] min-w-0 md:flex-[0_0_calc(33.333%-16px)] lg:flex-[0_0_calc(25%-18px)]"
            >
              <ProductPreviewClient product={product} isFeatured />
            </div>
          ))}

          {/* "Vedi tutti" Card */}
          <div className="flex-[0_0_calc(50%-12px)] min-w-0 md:flex-[0_0_calc(33.333%-16px)] lg:flex-[0_0_calc(25%-18px)]">
            <Link
              href="/store?discounted=true"
              className="group h-full flex flex-col items-center justify-center gap-4 bg-green-400 border border-black rounded-md p-8 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px] transition-all"
            >
              <div className="text-center flex-1 flex flex-col items-center justify-center">
                <p className="text-sm font-bold uppercase mb-2">
                  Scopri tutti i prodotti in sconto
                </p>
                <p className="text-4xl font-black">{totalCount}</p>
                <p className="text-sm font-bold uppercase mt-1">Prodotti</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Inside carousel */}
      {availableProducts.length > 4 && (
        <>
          <button
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border-2 border-black items-center justify-center hover:bg-green-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[calc(50%+2px)]"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border-2 border-black items-center justify-center hover:bg-green-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:-translate-y-[calc(50%+2px)]"
            aria-label="Next products"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {scrollSnaps.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full border-2 border-black transition-all ${
                index === selectedIndex
                  ? "bg-green-400 scale-110"
                  : "bg-white hover:bg-green-400/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
