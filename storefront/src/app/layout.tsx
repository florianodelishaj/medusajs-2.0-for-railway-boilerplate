import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import Script from "next/script"
import { Toaster } from "sonner"
import "styles/globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
})

const OG_IMAGE = `${getBaseURL()}/opengraph-image.jpg`

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Il Covo di Xur",
    template: "%s | Il Covo di Xur",
  },
  description:
    "Scopri la nostra collezione di Funko Pop, carte Pokémon e collezionabili. Spedizione gratuita disponibile.",
  openGraph: {
    type: "website",
    siteName: "Il Covo di Xur",
    locale: "it_IT",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Il Covo di Xur" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE],
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="it" data-mode="light">
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          type="text/javascript"
          src="https://embeds.iubenda.com/widgets/317cb40d-b815-4f96-b7e6-12321ccddd98.js"
        />
      </head>
      <body className={dmSans.className}>
        <main className="relative">{props.children}</main>
        <Toaster position="bottom-right" richColors />
        <Script
          src="https://cdn.iubenda.com/iubenda.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
