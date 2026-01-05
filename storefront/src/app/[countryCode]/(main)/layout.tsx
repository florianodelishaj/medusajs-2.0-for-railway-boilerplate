import { Metadata } from "next"

import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import { getBaseURL } from "@lib/util/env"
import { SearchFilters } from "@modules/search-filters"
import { getTopLevelCategories } from "@lib/data/categories"
import DynamicBackground from "@modules/layout/components/dynamic-background"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const categories = await getTopLevelCategories()

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <SearchFilters categories={categories || []} />
      <DynamicBackground categories={categories || []}>
        {props.children}
      </DynamicBackground>
      <Footer />
    </div>
  )
}
