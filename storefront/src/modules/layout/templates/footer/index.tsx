import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Poppins } from "next/font/google"
import { cn } from "@lib/util/cn"
import Image from "next/image"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
})

export default async function Footer() {
  return (
    <footer className="w-full bg-black text-white border-t-2 border-black">
      <div className="content-container flex flex-col gap-8">
        <div className="flex flex-col small:flex-row small:justify-between gap-8">
          <LocalizedClientLink
            href="/"
            className={cn(
              "text-2xl font-bold uppercase text-green-400",
              poppins.className
            )}
            data-testid="footer-store-link"
          >
            IL COVO DI XUR
          </LocalizedClientLink>

          <div className="flex flex-col small:flex-row gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-white">
                Informazioni
              </span>
              <LocalizedClientLink
                href="/chi-siamo"
                className="text-sm text-white/60 hover:text-green-400 transition-colors"
              >
                Chi siamo
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/spedizioni"
                className="text-sm text-white/60 hover:text-green-400 transition-colors"
              >
                Spedizioni
              </LocalizedClientLink>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-white">Legale</span>
              <LocalizedClientLink
                href="/termini-e-condizioni"
                className="text-sm text-white/60 hover:text-green-400 transition-colors"
              >
                Termini e Condizioni
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/politica-resi"
                className="text-sm text-white/60 hover:text-green-400 transition-colors"
              >
                Politica di Reso e Rimborsi
              </LocalizedClientLink>
              <a
                href="https://www.iubenda.com/privacy-policy/28571391"
                className="iubenda-white iubenda-noiframe iubenda-embed text-sm text-white/60 hover:text-green-400 transition-colors"
                title="Privacy Policy"
              >
                Privacy Policy
              </a>
              <a
                href="https://www.iubenda.com/privacy-policy/28571391/cookie-policy"
                className="iubenda-white iubenda-noiframe iubenda-embed text-sm text-white/60 hover:text-green-400 transition-colors"
                title="Cookie Policy"
              >
                Cookie Policy
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-white">Contatti</span>
              <a
                href="mailto:info@ilcovodixur.com"
                className="text-sm text-white/60 hover:text-green-400 transition-colors"
              >
                info@ilcovodixur.com
              </a>
              <a
                href="https://www.instagram.com/ilcovodixur/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/60 hover:text-green-400 transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-4 flex flex-col small:flex-row small:items-center small:justify-between gap-4">
          <span className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Il Covo di Xur - S.M.N. S.r.l.s.
            (P.IVA 02183500673)
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <Image
              src="/icons/payment/visa.svg"
              alt="Visa"
              width={64}
              height={40}
              className="h-10 w-auto rounded border border-white/20"
              unoptimized
            />
            <Image
              src="/icons/payment/mastercard.svg"
              alt="Mastercard"
              width={64}
              height={40}
              className="h-10 w-auto rounded border border-white/20"
              unoptimized
            />
            <Image
              src="/icons/payment/amex.svg"
              alt="American Express"
              width={64}
              height={40}
              className="h-10 w-auto rounded border border-white/20"
              unoptimized
            />
            <Image
              src="/icons/payment/paypal.svg"
              alt="PayPal"
              width={64}
              height={40}
              className="h-10 w-auto rounded border border-white/20 bg-white p-1"
              unoptimized
            />
            <Image
              src="/icons/payment/applepay.png"
              alt="Apple Pay"
              width={64}
              height={40}
              className="h-10 w-auto rounded border border-white/20 bg-white p-1.5"
              unoptimized
            />
            <Image
              src="/icons/payment/googlepay.png"
              alt="Google Pay"
              width={64}
              height={40}
              className="h-10 w-auto rounded border border-white/20 bg-white p-1.5"
              unoptimized
            />
            <Image
              src="/icons/payment/klarna.svg"
              alt="Klarna"
              width={64}
              height={40}
              className="h-10 w-auto rounded border border-white/20 bg-[#FFB3C7] p-1.5"
              unoptimized
            />
            <Image
              src="/icons/payment/revolut.svg"
              alt="Revolut Pay"
              width={64}
              height={40}
              className="h-10 w-auto rounded border border-white/20 bg-[#191C1F] p-1.5"
              unoptimized
            />
            <div className="flex items-center justify-center h-10 w-24 rounded border border-white/20 bg-white px-1.5">
              <Image
                src="/icons/payment/satispay.png"
                alt="Satispay"
                width={80}
                height={19}
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
