import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Poppins } from "next/font/google"
import { cn } from "@lib/util/cn"
import Image from "next/image"
import Visa from "react-payment-icons-inline/es/Icons/Visa"
import Mastercard from "react-payment-icons-inline/es/Icons/Mastercard"
import Amex from "react-payment-icons-inline/es/Icons/Amex"
import Applepay from "react-payment-icons-inline/es/Icons/Applepay"
import Googlepay from "react-payment-icons-inline/es/Icons/Googlepay"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
})

export default async function Footer() {
  return (
    <footer className="w-full border-t border-black">
      <div className="content-container flex flex-col gap-8">
        <div className="flex flex-col small:flex-row small:justify-between gap-8">
          <LocalizedClientLink
            href="/"
            className={cn("text-2xl font-bold uppercase", poppins.className)}
            data-testid="footer-store-link"
          >
            IL COVO DI XUR
          </LocalizedClientLink>

          <div className="flex flex-col small:flex-row gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-ui-fg-base">
                Informazioni
              </span>
              <LocalizedClientLink
                href="/chi-siamo"
                className="text-sm text-ui-fg-subtle hover:text-green-400"
              >
                Chi Siamo
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/spedizioni"
                className="text-sm text-ui-fg-subtle hover:text-green-400"
              >
                Spedizioni
              </LocalizedClientLink>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-ui-fg-base">
                Legale
              </span>
              <LocalizedClientLink
                href="/termini-e-condizioni"
                className="text-sm text-ui-fg-subtle hover:text-green-400"
              >
                Termini e Condizioni
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/politica-resi"
                className="text-sm text-ui-fg-subtle hover:text-green-400"
              >
                Politica di Reso e Rimborsi
              </LocalizedClientLink>
              <a
                href="https://www.iubenda.com/privacy-policy/28571391"
                className="iubenda-white iubenda-noiframe iubenda-embed text-sm text-ui-fg-subtle hover:text-green-400"
                title="Privacy Policy"
              >
                Privacy Policy
              </a>
              <a
                href="https://www.iubenda.com/privacy-policy/28571391/cookie-policy"
                className="iubenda-white iubenda-noiframe iubenda-embed text-sm text-ui-fg-subtle hover:text-green-400"
                title="Cookie Policy"
              >
                Cookie Policy
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-ui-fg-base">
                Contatti
              </span>
              <a
                href="mailto:info@ilcovodixur.com"
                className="text-sm text-ui-fg-subtle hover:text-green-400"
              >
                info@ilcovodixur.com
              </a>
              <a
                href="https://www.instagram.com/ilcovodixur/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ui-fg-subtle hover:text-green-400"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 flex flex-col small:flex-row small:items-center small:justify-between gap-4">
          <span className="text-xs text-ui-fg-muted">
            &copy; {new Date().getFullYear()} Il Covo di Xur - S.M.N. S.r.l.s.
            (P.IVA 02183500673)
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <Visa className="h-7 w-auto rounded border border-gray-200" aria-label="Visa" />
            <Mastercard className="h-7 w-auto rounded border border-gray-200" aria-label="Mastercard" />
            <Amex className="h-7 w-auto rounded border border-gray-200" aria-label="American Express" />
            {/* PayPal */}
            <div className="flex items-center justify-center h-7 w-10 rounded border border-gray-200 bg-white">
              <Image src="/icons/payment/paypal.svg" alt="PayPal" width={20} height={20} />
            </div>
            <Applepay className="h-7 w-auto rounded border border-gray-200" aria-label="Apple Pay" />
            <Googlepay className="h-7 w-auto rounded border border-gray-200" aria-label="Google Pay" />
            {/* Klarna */}
            <div className="flex items-center justify-center h-7 w-10 rounded border border-gray-200 bg-[#FFB3C7]">
              <Image src="/icons/payment/klarna.svg" alt="Klarna" width={20} height={20} />
            </div>
            {/* Revolut Pay */}
            <div className="flex items-center justify-center h-7 w-10 rounded border border-gray-200 bg-[#191C1F]">
              <Image src="/icons/payment/revolut.svg" alt="Revolut Pay" width={20} height={20} />
            </div>
            {/* Satispay */}
            <div className="flex items-center justify-center h-7 w-20 rounded border border-gray-200 bg-white px-1">
              <Image src="/icons/payment/satispay.png" alt="Satispay" width={64} height={15} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
