import { Metadata } from "next"

import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import { getBaseURL } from "@lib/util/env"
import { SearchFilters } from "@modules/search-filters"
import { getTopLevelCategories } from "@lib/data/categories"
import { SearchFiltersProvider } from "@lib/context/search-filters-context"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const categories = await getTopLevelCategories()

  return (
    <SearchFiltersProvider>
      <div className="flex flex-col min-h-screen">
        <Nav />
        <SearchFilters categories={categories || []} />
        <div className="flex flex-col flex-1 bg-[#F4F4F0]">{props.children}</div>
        <Footer />
      </div>
    </SearchFiltersProvider>
  )
}
