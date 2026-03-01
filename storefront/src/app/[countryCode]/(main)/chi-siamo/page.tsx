import { Metadata } from "next"
import ChiSiamoTemplate from "@modules/chi-siamo/template"

export const metadata: Metadata = {
  title: "Chi siamo",
  description:
    "E-commerce dedicato al gaming e al collezionismo: scopri prodotti selezionati, qualità garantita e spedizioni rapide in tutta Italia. Entra nel mondo del Covo di Xur.",
}

export default function ChiSiamoPage() {
  return <ChiSiamoTemplate />
}
