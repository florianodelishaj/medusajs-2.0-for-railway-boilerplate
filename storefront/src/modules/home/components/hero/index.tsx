import Link from "next/link"
import { Button } from "@components/ui/button"

const Hero = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden border-b-2 border-black">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="object-cover w-full h-full"
          style={{ pointerEvents: "none" }}
        >
          <source src="/video/covo_di_xur.mp4" type="video/mp4" />
          Il tuo browser non supporta il tag video.
        </video>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full content-container flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-black uppercase text-white mb-4 leading-tight">
            Scopri il Mondo dei Collezionabili
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Funko Pop, Pokémon e molto altro. Spedizione gratuita disponibile
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/store">
              <Button
                variant="elevated"
                size="lg"
                className="bg-green-400 text-black hover:bg-white hover:text-black font-bold uppercase"
              >
                Esplora Catalogo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
