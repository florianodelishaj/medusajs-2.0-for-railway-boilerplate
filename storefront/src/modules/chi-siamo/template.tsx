import Image from "next/image"
import Link from "next/link"
import { ShieldCheck, Heart, Users, Sparkles, Quote } from "lucide-react"
import { Button } from "@components/ui/button"
import ScrollReveal from "@modules/common/components/scroll-reveal"

const MINIO_BASE = `https://${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}/medusa-media/chi-siamo`

const ChiSiamoTemplate = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden border-b border-black">
        <Image
          src={`${MINIO_BASE}/hero_chisiamo.jpeg`}
          alt="Il Covo di Xur"
          fill
          className="object-cover object-[50%_40%] opacity-0 animate-hero-zoom-in"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        <div className="relative h-full content-container flex flex-col justify-end pb-12">
          <span className="inline-block w-fit bg-green-400 text-black text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md border border-black mb-4 opacity-0 animate-hero-fade-up">
            Chi siamo
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase text-white mb-3 leading-tight opacity-0 animate-hero-fade-up [animation-delay:0.15s]">
            La Nostra Storia
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-xl opacity-0 animate-hero-fade-up [animation-delay:0.3s]">
            Più di uno shop, una community di appassionati.
          </p>
        </div>
      </section>

      {/* Sezione 1: Come è nato — sfondo gradient verde chiaro */}
      <section className="bg-gradient-to-b from-green-100 to-white">
        <div className="content-container py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <ScrollReveal>
              <div className="relative aspect-[4/3] border border-black rounded-md overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <Image
                  src={`${MINIO_BASE}/le_origini.jpeg`}
                  alt="Come è nato il Covo di Xur"
                  fill
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div>
                <span className="inline-block bg-green-400 text-black text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md border border-black mb-4">
                  Le origini
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase mb-4">
                  Come è nato il Covo
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Il Covo di Xur nasce a Teramo dall’esperienza di HGE
                    Esports, associazione fondata nel 2020 da un gruppo di amici
                    uniti dalla{" "}
                    <strong>passione per il gaming competitivo</strong>.
                  </p>
                  <p>
                    Da questo progetto, i founder Fabrizio e Andrea hanno
                    ampliato la visione creando{" "}
                    <strong>il primo gaming bar della città</strong>: un punto
                    di riferimento per appassionati di{" "}
                    <strong>videogiochi, collezionismo e cultura pop</strong>.
                  </p>
                  <p>
                    Il Covo è diventato nel tempo{" "}
                    <strong>una vera community</strong>, dove gioco, socialità e
                    passioni condivise si incontrano. Oggi questa esperienza si
                    estende anche online, portando la stessa energia e
                    <strong>competenza nel nuovo e-commerce</strong>.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Quote / Frase d'effetto */}
      <section className="bg-black border-y border-black">
        <div className="content-container py-12 md:py-16">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center gap-4">
              <Quote className="w-10 h-10 text-green-400" />
              <blockquote className="text-xl md:text-2xl font-bold text-white max-w-2xl italic leading-relaxed">
                &ldquo;Non è una collezione. È il segno visibile del mondo a cui
                appartieni.&rdquo;
              </blockquote>
              <span className="text-green-400 text-sm font-bold uppercase tracking-wider">
                Il Covo di Xur
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Sezione 2: La Passione (layout invertito) */}
      <section className="bg-gradient-to-b from-white to-green-50">
        <div className="content-container py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <ScrollReveal className="order-2 md:order-1">
              <div>
                <span className="inline-block bg-black text-green-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md border border-black mb-4">
                  La missione
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase mb-4">
                  Non solo un negozio
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    La missione del Covo di Xur è portare online la stessa
                    passione che anima il nostro spazio fisico, attraverso un
                    <strong>
                      e-commerce dedicato al mondo del gaming e del
                      collezionismo
                    </strong>
                    .
                  </p>
                  <p>
                    Offriamo una{" "}
                    <strong>
                      selezione curata di prodotti per appassionati e
                      collezionisti
                    </strong>
                    , garantendo qualità, autenticità e attenzione ai dettagli.
                    Il nostro shop online nasce per rendere semplice e sicuro
                    acquistare articoli ricercati, con{" "}
                    <strong>un servizio affidabile e spedizioni rapide</strong>{" "}
                    in tutta Italia. Vogliamo diventare un punto di riferimento
                    per chi vive queste passioni ogni giorno: non solo uno shop,
                    ma{" "}
                    <strong>
                      un luogo digitale dove continuare a condividere ciò che
                      amiamo
                    </strong>
                    .
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150} className="order-1 md:order-2">
              <div className="relative aspect-[4/3] border border-black rounded-md overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <Image
                  src={`${MINIO_BASE}/la_missione.jpeg`}
                  alt="La passione per i collezionabili"
                  fill
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Sezione 3: I Nostri Valori — sfondo verde */}
      <section className="bg-green-400 border-y border-black">
        <div className="content-container py-16 md:py-24">
          <ScrollReveal>
            <div className="text-center mb-12">
              <Sparkles className="w-8 h-8 text-black mx-auto mb-3" />
              <h2 className="text-2xl md:text-3xl font-black uppercase">
                I Nostri Valori
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal delay={0}>
              <div className="border border-black rounded-md p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-full">
                <div className="bg-black rounded-md w-12 h-12 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-bold uppercase text-lg mb-2">
                  Autenticità
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Selezioniamo solo prodotti originali e certificati,
                  provenienti da distributori ufficiali. Ogni pezzo è scelto con
                  cura per garantire qualità, affidabilità e valore nel tempo.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div className="border border-black rounded-md p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-full">
                <div className="bg-black rounded-md w-12 h-12 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-bold uppercase text-lg mb-2">Passione</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Siamo collezionisti prima di tutto. Conosciamo l’emozione di
                  trovare quel pezzo che aspettavi da tempo — ed è la stessa
                  emozione che vogliamo farti vivere.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="border border-black rounded-md p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-full">
                <div className="bg-black rounded-md w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-bold uppercase text-lg mb-2">Community</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Il Covo è una casa per chi condivide le stesse passioni. Un
                  luogo dove incontrarsi, confrontarsi e sentirsi parte di
                  qualcosa di autentico.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Sezione 4: Video */}
      {/* <section className="bg-black border-y border-black">
        <div className="content-container py-16 md:py-24">
          <ScrollReveal>
            <div className="text-center mb-10">
              <span className="inline-block bg-green-400 text-black text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md border border-black mb-4">
                Behind the scenes
              </span>
              <h2 className="text-2xl md:text-3xl font-black uppercase text-white mb-3">
                Entra nel Covo
              </h2>
              <p className="text-white/60 max-w-md mx-auto">
                Scopri cosa succede dietro le quinte: dalla selezione dei
                prodotti al packaging dei tuoi ordini.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video border border-green-400 rounded-md overflow-hidden shadow-[6px_6px_0px_0px_rgba(74,222,128,0.5)]">
                <video
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  poster="https://placehold.co/1280x720/1a1a1a/4ade80?text=Video"
                >
                  <source src="/video/covo_di_xur.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section> */}

      {/* Sezione 5: CTA */}
      <section className="bg-white border-t-2 border-black">
        <div className="content-container py-16 md:py-20">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center gap-6">
              <h2 className="text-2xl md:text-4xl font-black uppercase text-black">
                Pronto a esplorare?
              </h2>
              <p className="text-black/60 text-lg max-w-lg">
                Scopri la nostra collezione di Funko Pop, carte Pokémon e molto
                altro.
              </p>
              <Link href="/store">
                <Button
                  variant="elevated"
                  size="lg"
                  className="bg-black text-white hover:bg-green-400 hover:text-black font-bold uppercase"
                >
                  Esplora il catalogo
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

export default ChiSiamoTemplate
