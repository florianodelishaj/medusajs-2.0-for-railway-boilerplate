import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="pt-6">
      <h3 className="text-xl font-bold mb-4">Hai bisogno di aiuto?</h3>
      <div className="text-base">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <LocalizedClientLink
              href="/contact"
              className="text-gray-700 hover:text-green-600 transition-colors underline"
            >
              Contatti
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink
              href="/contact"
              className="text-gray-700 hover:text-green-600 transition-colors underline"
            >
              Resi e cambi
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
