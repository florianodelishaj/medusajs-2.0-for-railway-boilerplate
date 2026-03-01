"use client"

import { useState, useRef } from "react"
import {
  InstantSearch,
  useSearchBox,
  useHits,
} from "react-instantsearch-hooks-web"
import { MagnifyingGlassMini } from "@medusajs/icons"
import { Input } from "@components/ui/input"
import { SEARCH_INDEX_NAME, searchClient } from "@lib/search-client"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { useSearchFilters } from "@lib/context/search-filters-context"
import { findTopLevelCategory } from "@lib/util/get-category-background"

function SearchResults({ isFocused }: { isFocused: boolean }) {
  const { hits } = useHits()
  const { categories: allCategories } = useSearchFilters()
  const dropdownRef = useRef<HTMLDivElement>(null)

  if (!isFocused || hits.length === 0) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white border border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-[400px] overflow-y-auto z-50"
    >
      {hits.map((hit: any) => {
        const categoryColor = hit.categories?.[0]?.id
          ? (findTopLevelCategory(hit.categories[0].id, allCategories)?.metadata?.color as string | undefined)
          : undefined

        return (
          <LocalizedClientLink
            key={hit.id}
            href={`/products/${hit.handle}`}
            className="relative flex items-center gap-4 p-4 hover:bg-[#F4F4F0] border-b border-black/10 last:border-b-0 overflow-hidden"
          >
            {categoryColor && (
              <div className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: categoryColor }} />
            )}
            <div className="w-16 h-16 shrink-0">
              <Thumbnail
                thumbnail={hit.thumbnail || hit.images?.[0]?.url}
                size="square"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{hit.title}</h3>
              {hit.description && (
                <p className="text-xs text-black/50 line-clamp-2">
                  {hit.description}
                </p>
              )}
            </div>
          </LocalizedClientLink>
        )
      })}
    </div>
  )
}

function SearchInput() {
  const { refine, query } = useSearchBox()
  const [localQuery, setLocalQuery] = useState(query)
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalQuery(value)
    refine(value)
  }

  return (
    <div className="flex items-center gap-2 w-full relative">
      <div className="relative w-full">
        <MagnifyingGlassMini className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 z-10" />
        <Input
          type="search"
          placeholder="Cerca prodotti..."
          value={localQuery}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-12"
        />
        <SearchResults isFocused={isFocused} />
      </div>
    </div>
  )
}

export const SearchWithResults = () => {
  return (
    <InstantSearch indexName={SEARCH_INDEX_NAME} searchClient={searchClient}>
      <SearchInput />
    </InstantSearch>
  )
}
