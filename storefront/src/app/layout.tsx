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

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="it" data-mode="light">
      <head>
        <Script
          src="https://embeds.iubenda.com/widgets/ef91f9b1-a19f-439f-bc46-130340a152f0.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdn.iubenda.com/iubenda.js"
          strategy="lazyOnload"
        />
      </head>
      <body className={dmSans.className}>
        <main className="relative">{props.children}</main>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
