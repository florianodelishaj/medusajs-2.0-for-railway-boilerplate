import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import Footer from "@modules/layout/templates/footer"
import { getTopLevelCategories } from "@lib/data/categories"
import { SearchFiltersProvider } from "@lib/context/search-filters-context"

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getTopLevelCategories().catch(() => [])

  return (
    <SearchFiltersProvider categories={categories || []}>
    <div className="w-full bg-white relative small:min-h-screen flex flex-col">
      <div className="h-16 bg-white border-b-2 border-black">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="flex items-center gap-x-1.5 flex-1 basis-0 text-sm font-semibold uppercase hover:text-green-700 transition-colors"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90 shrink-0" size={16} />
            <span className="hidden small:block">Torna al carrello</span>
            <span className="block small:hidden">Indietro</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="text-xl font-black uppercase hover:text-green-700 transition-colors"
            data-testid="store-link"
          >
            Il Covo Di Xur
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div
        className="relative flex-1 flex flex-col bg-[#F4F4F0]"
        data-testid="checkout-container"
      >
        {children}
      </div>
      <Footer />
    </div>
    </SearchFiltersProvider>
  )
}
