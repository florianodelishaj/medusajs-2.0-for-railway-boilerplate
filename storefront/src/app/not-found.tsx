import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@components/ui/button"

export const metadata: Metadata = {
  title: "404 - Pagina non trovata",
  description: "La pagina che stai cercando non esiste",
}

export default function NotFound() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-[calc(100vh-64px)] px-4 bg-green-50">
      <div className="bg-white border border-black rounded-lg p-8 max-w-md w-full text-center">
        <div className="bg-green-400 border-2 border-black rounded-md px-6 py-3 mb-6 inline-block">
          <span className="text-6xl font-black">404</span>
        </div>

        <h1 className="text-3xl font-black uppercase mb-4">
          Pagina non trovata
        </h1>

        <p className="text-gray-700 mb-6">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>

        <Link href="/">
          <Button
            variant="elevated"
            className="bg-black text-white hover:bg-green-400 hover:text-black font-bold uppercase inline-flex items-center gap-2"
          >
            Torna alla home
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
