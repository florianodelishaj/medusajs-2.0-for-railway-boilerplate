import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Poppins } from "next/font/google"
import { cn } from "@lib/util/cn"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
})

export default async function Footer() {
  return (
    <footer className="w-full">
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
                className="text-sm text-ui-fg-subtle hover:text-ui-fg-base"
              >
                Chi Siamo
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/spedizioni"
                className="text-sm text-ui-fg-subtle hover:text-ui-fg-base"
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
                className="text-sm text-ui-fg-subtle hover:text-ui-fg-base"
              >
                Termini e Condizioni
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/politica-resi"
                className="text-sm text-ui-fg-subtle hover:text-ui-fg-base"
              >
                Politica di Reso e Rimborsi
              </LocalizedClientLink>
              <a
                href="https://www.iubenda.com/privacy-policy/27581848"
                className="iubenda-white iubenda-noiframe iubenda-embed text-sm text-ui-fg-subtle hover:text-ui-fg-base"
                title="Privacy Policy"
              >
                Privacy Policy
              </a>
              <a
                href="https://www.iubenda.com/privacy-policy/27581848/cookie-policy"
                className="iubenda-white iubenda-noiframe iubenda-embed text-sm text-ui-fg-subtle hover:text-ui-fg-base"
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
                className="text-sm text-ui-fg-subtle hover:text-ui-fg-base"
              >
                info@ilcovodixur.com
              </a>
              <a
                href="https://www.instagram.com/ilcovodixur/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ui-fg-subtle hover:text-ui-fg-base"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 text-xs text-ui-fg-muted">
          &copy; {new Date().getFullYear()} Il Covo di Xur - S.M.N. S.r.l.s.
          (P.IVA 02183500673)
        </div>
      </div>
    </footer>
  )
}
