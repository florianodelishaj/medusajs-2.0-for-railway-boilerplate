import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { DM_Sans } from "next/font/google"
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
    <html lang="en" data-mode="light">
      <body className={dmSans.className}>
        <main className="relative">{props.children}</main>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
