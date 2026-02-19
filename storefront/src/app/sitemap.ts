import { getBaseURL } from "@lib/util/env"
import { listCategories } from "@lib/data/categories"
import { getCollectionsList } from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"
import { getProductsList } from "@lib/data/products"
import { MetadataRoute } from "next"

export const dynamic = "force-dynamic"

const STATIC_PAGES = [
  "chi-siamo",
  "spedizioni",
  "termini-e-condizioni",
  "politica-resi",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseURL()

  try {
    const regions = await listRegions()
    const countryCodes = (regions ?? [])
      .flatMap((r) => r.countries?.map((c) => c.iso_2) ?? [])
      .filter(Boolean) as string[]

    if (!countryCodes.length) return []

    const entries: MetadataRoute.Sitemap = []

    // Home per ogni paese
    for (const cc of countryCodes) {
      entries.push({
        url: `${baseUrl}/${cc}`,
        changeFrequency: "daily",
        priority: 1.0,
      })
    }

    // Store (catalogo generale)
    for (const cc of countryCodes) {
      entries.push({
        url: `${baseUrl}/${cc}/store`,
        changeFrequency: "daily",
        priority: 0.9,
      })
    }

    // Categorie
    try {
      const categories = await listCategories()
      for (const cat of categories ?? []) {
        for (const cc of countryCodes) {
          entries.push({
            url: `${baseUrl}/${cc}/categories/${cat.handle}`,
            changeFrequency: "weekly",
            priority: 0.8,
          })
        }
      }
    } catch {}

    // Collezioni
    try {
      const { collections } = await getCollectionsList()
      for (const col of collections ?? []) {
        for (const cc of countryCodes) {
          entries.push({
            url: `${baseUrl}/${cc}/collections/${col.handle}`,
            changeFrequency: "weekly",
            priority: 0.7,
          })
        }
      }
    } catch {}

    // Prodotti (usa il primo paese come reference per i prodotti)
    try {
      const firstCountry = countryCodes[0]
      const { response } = await getProductsList({
        countryCode: firstCountry,
        queryParams: { limit: 500 },
      })
      for (const product of response.products ?? []) {
        for (const cc of countryCodes) {
          entries.push({
            url: `${baseUrl}/${cc}/products/${product.handle}`,
            changeFrequency: "weekly",
            priority: 0.9,
          })
        }
      }
    } catch {}

    // Pagine statiche
    for (const page of STATIC_PAGES) {
      for (const cc of countryCodes) {
        entries.push({
          url: `${baseUrl}/${cc}/${page}`,
          changeFrequency: "monthly",
          priority: 0.5,
        })
      }
    }

    return entries
  } catch {
    return []
  }
}
