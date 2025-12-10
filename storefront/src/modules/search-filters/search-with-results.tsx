"use client"

import { useState, useRef } from "react"
import {
  InstantSearch,
  useSearchBox,
  useHits,
} from "react-instantsearch-hooks-web"
import { MagnifyingGlassMini, Funnel } from "@medusajs/icons"
import { Input } from "@components/ui/input"
import { Button } from "@components/ui/button"
import { SEARCH_INDEX_NAME, searchClient } from "@lib/search-client"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"

interface Props {
  onFilterClick: () => void
}

interface SearchResultsProps {
  isFocused: boolean
}

function SearchResults({ isFocused }: SearchResultsProps) {
  const { hits } = useHits()
  const dropdownRef = useRef<HTMLDivElement>(null)

  if (!isFocused || hits.length === 0) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-[400px] overflow-y-auto z-50"
    >
      {hits.map((hit: any) => (
        <LocalizedClientLink
          key={hit.id}
          href={`/products/${hit.handle}`}
          className="flex items-center gap-4 p-4 hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
        >
          <div className="w-16 h-16 shrink-0">
            <Thumbnail thumbnail={hit.thumbnail} size="square" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{hit.title}</h3>
            {hit.description && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {hit.description}
              </p>
            )}
          </div>
        </LocalizedClientLink>
      ))}
    </div>
  )
}

function SearchInput({ onFilterClick }: Props) {
  const { refine, query } = useSearchBox()
  const [localQuery, setLocalQuery] = useState(query)
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalQuery(value)
    refine(value)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false)
    }, 200)
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
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="pl-12"
        />
        <SearchResults isFocused={isFocused} />
      </div>
      {/* Mobile filter button */}
      <Button
        variant="elevated"
        size="icon"
        onClick={onFilterClick}
        className="size-12 shrink-0 flex lg:hidden rounded-full"
        aria-label="Apri filtri"
      >
        <Funnel className="w-5 h-5" />
      </Button>
    </div>
  )
}

export const SearchWithResults = ({ onFilterClick }: Props) => {
  return (
    <InstantSearch indexName={SEARCH_INDEX_NAME} searchClient={searchClient}>
      <SearchInput onFilterClick={onFilterClick} />
    </InstantSearch>
  )
}
