"use client"

import { useCallback, useEffect, useState, useMemo } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@components/ui/button"
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
  const availableProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product.variants || product.variants.length === 0) {
        return false
      }

      return product.variants.some((variant) => {
        if (!variant.manage_inventory) return true
        if (variant.allow_backorder) return true
        if (
          variant.inventory_quantity === undefined ||
          variant.inventory_quantity === null
        ) {
          return true
        }
        return variant.inventory_quantity > 0
      })
    })
  }, [products])

  const autoplayPlugin = useMemo(
    () => Autoplay({ delay: 3000, stopOnInteraction: true }),
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

  useEffect(() => {
    if (!emblaApi) return

    let timer: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => emblaApi.reInit(), 150)
    }

    window.addEventListener("resize", handleResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", handleResize)
    }
  }, [emblaApi])

  return (
    <div className="relative">
      <div className="overflow-hidden -mx-2 px-2" ref={emblaRef}>
        <div className="flex gap-5 py-2">
          {availableProducts.map((product) => (
            <div
              key={product.id}
              className="flex-[0_0_calc(50%-10px)] min-w-0 md:flex-[0_0_calc(33.333%-14px)] lg:flex-[0_0_calc(25%-15px)]"
            >
              <ProductPreviewClient product={product} isFeatured />
            </div>
          ))}

          {/* "Vedi tutti" Card */}
          <div className="flex-[0_0_calc(50%-10px)] min-w-0 md:flex-[0_0_calc(33.333%-14px)] lg:flex-[0_0_calc(25%-15px)]">
            <Link
              href="/store?discounted=true"
              className="group/cta relative h-full flex flex-col bg-green-400 border border-black rounded-md overflow-hidden hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all duration-200"
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(-45deg, transparent, transparent 7px, rgba(0,0,0,0.06) 7px, rgba(0,0,0,0.06) 8px)",
                }}
              />
              <div className="relative flex-1 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-7xl font-black leading-none">
                  {totalCount}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
                  prodotti
                </p>
              </div>
              <div className="relative border-t border-black bg-black/5 px-4 py-3 flex items-center justify-center gap-2">
                <span className="text-sm font-black uppercase tracking-wide">
                  Vedi tutti
                </span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/cta:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {availableProducts.length > 4 && (
        <>
          <Button
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            variant="elevated"
            size="icon"
            className="hidden lg:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white hover:bg-green-400 items-center justify-center disabled:opacity-0 disabled:pointer-events-none"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            variant="elevated"
            size="icon"
            className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white hover:bg-green-400 items-center justify-center disabled:opacity-0 disabled:pointer-events-none"
            aria-label="Next products"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </>
      )}

      {/* Dots Navigation */}
      {scrollSnaps.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "bg-black w-6 h-2"
                  : "bg-black/20 w-2 h-2 hover:bg-black/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
