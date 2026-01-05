"use client"

import { useCallback, useEffect, useMemo } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"

// Array di sponsor - sostituisci con i tuoi loghi e URL
const sponsors = [
  { name: "Sponsor 1", logo: "/images/logo.png", url: "https://esempio.com" },
  { name: "Sponsor 2", logo: "/images/logo.png", url: "https://esempio.com" },
  { name: "Sponsor 3", logo: "/images/logo.png", url: "https://esempio.com" },
  { name: "Sponsor 4", logo: "/images/logo.png", url: "https://esempio.com" },
  { name: "Sponsor 5", logo: "/images/logo.png", url: "https://esempio.com" },
  { name: "Sponsor 6", logo: "/images/logo.png", url: "https://esempio.com" },
]

export default function SponsorCarousel() {
  const autoplayPlugin = useMemo(
    () =>
      Autoplay({
        delay: 2500,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    []
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      slidesToScroll: 1,
      breakpoints: {
        "(min-width: 640px)": { slidesToScroll: 2 },
        "(min-width: 768px)": { slidesToScroll: 3 },
        "(min-width: 1024px)": { slidesToScroll: 4 },
      },
    },
    [autoplayPlugin]
  )

  const onMouseEnter = useCallback(() => {
    if (autoplayPlugin) autoplayPlugin.stop()
  }, [autoplayPlugin])

  const onMouseLeave = useCallback(() => {
    if (autoplayPlugin) autoplayPlugin.play()
  }, [autoplayPlugin])

  useEffect(() => {
    if (!emblaApi) return

    const container = emblaApi.containerNode()
    container.addEventListener("mouseenter", onMouseEnter)
    container.addEventListener("mouseleave", onMouseLeave)

    return () => {
      container.removeEventListener("mouseenter", onMouseEnter)
      container.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [emblaApi, onMouseEnter, onMouseLeave])

  return (
    <section className="py-12">
      <div className="content-container">
        <h3 className="text-center text-2xl md:text-3xl font-black uppercase mb-8">
          Partner Ufficiali
        </h3>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {sponsors.map((sponsor, index) => (
              <div
                key={index}
                className="flex-[0_0_50%] min-w-0 sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_20%] pr-8"
              >
                <a
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-4"
                >
                  <div className="relative h-20 transition-transform hover:scale-110">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-contain"
                    />
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
