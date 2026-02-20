import { Metadata } from "next"
import ChiSiamoTemplate from "@modules/chi-siamo/template"

export const metadata: Metadata = {
  title: "Chi Siamo",
  description:
    "Scopri la storia de Il Covo di Xur: la passione per Funko Pop, carte Pokémon e collezionabili.",
}

export default function ChiSiamoPage() {
  return <ChiSiamoTemplate />
}
