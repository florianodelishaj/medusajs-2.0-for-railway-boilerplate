import { Suspense } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { NavMenuButton } from "@modules/layout/components/nav-menu-button"
import { NavButtons } from "@modules/layout/components/nav-buttons"
import { NAV_ROUTES } from "@lib/constants/nav-routes"
import { Poppins } from "next/font/google"
import { cn } from "@lib/util/cn"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
})

export default async function Nav() {
  return (
    <nav className="flex h-20 border-b justify-between font-medium bg-white">
      {/* Logo */}
      <div className="pl-6 flex items-center xl:pl-6">
        <LocalizedClientLink
          href="/"
          className={cn("text-4xl font-bold uppercase", poppins.className)}
          data-testid="nav-store-link"
        >
          il covo di xur
        </LocalizedClientLink>
      </div>

      {/* Hamburger menu per mobile */}
      <div className="pr-5 flex items-center xl:hidden">
        <NavMenuButton />
      </div>

      <NavButtons routes={NAV_ROUTES} />

      <div className="hidden xl:flex">
        <LocalizedClientLink
          className="hidden small:flex items-center h-full px-12 py-2 border-l border-black hover:bg-green-400 hover:border-green-400 transition-colors duration-200 font-semibold"
          href="/account"
          data-testid="nav-account-link"
        >
          Account
        </LocalizedClientLink>
        <Suspense
          fallback={
            <LocalizedClientLink
              className="flex items-center h-full px-12 py-2 border-l border-black bg-black text-white hover:bg-green-400 hover:border-green-400 hover:text-black transition-colors duration-200 font-semibold gap-2"
              href="/cart"
              data-testid="nav-cart-link"
            >
              Carrello (0)
            </LocalizedClientLink>
          }
        >
          <CartButton />
        </Suspense>
      </div>
    </nav>
  )
}
