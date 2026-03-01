import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@components/ui/button"
import React from "react"

const Help = () => {
  return (
    <div className="flex flex-col items-center text-center gap-4 pt-4">
      <div>
        <h3 className="text-sm font-black uppercase tracking-wider mb-1">
          Hai bisogno di aiuto?
        </h3>
        <p className="text-sm text-black/50">
          Scrivici a{" "}
          <a
            href="mailto:ordini@ilcovodixur.com"
            className="text-black font-bold underline hover:text-green-600 transition-colors"
          >
            ordini@ilcovodixur.com
          </a>
        </p>
      </div>
      <Button
        variant="elevated"
        size="lg"
        className="uppercase bg-black text-white hover:bg-green-400 hover:text-black transition-all duration-200"
        asChild
      >
        <LocalizedClientLink href="/">Continua lo shopping</LocalizedClientLink>
      </Button>
    </div>
  )
}

export default Help
