import { Metadata } from "next"
import { ArrowRight, PackageX } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@components/ui/button"

export const metadata: Metadata = {
  title: "404 - Checkout non trovato",
  description: "La pagina di checkout non esiste",
}

export default async function NotFound() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-[calc(100vh-64px)] px-4 bg-green-50">
      <div className="bg-white border border-black rounded-lg p-8 max-w-md w-full text-center">
        <div className="bg-green-400 border-2 border-black rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <PackageX className="w-12 h-12" />
        </div>

        <h1 className="text-3xl font-black uppercase mb-4">
          Checkout non trovato
        </h1>

        <p className="text-gray-700 mb-6">
          La pagina di checkout che stai cercando non esiste.
        </p>

        <LocalizedClientLink href="/">
          <Button
            variant="elevated"
            className="bg-black text-white hover:bg-green-400 hover:text-black font-bold uppercase inline-flex items-center gap-2"
          >
            Torna alla home
            <ArrowRight className="w-5 h-5" />
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}
