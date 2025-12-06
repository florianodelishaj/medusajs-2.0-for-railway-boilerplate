"use client"

import { HttpTypes } from "@medusajs/types"
import { MagnifyingGlassMini, Funnel } from "@medusajs/icons"
import { Input } from "@components/ui/input"
import { Button } from "@components/ui/button"

interface Props {
  disabled?: boolean
  categories: HttpTypes.StoreProductCategory[]
  onFilterClick: () => void
}

export const SearchInput = ({ disabled, categories, onFilterClick }: Props) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative w-full">
        <MagnifyingGlassMini className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
        <Input
          type="search"
          placeholder="Cerca prodotti..."
          disabled={disabled}
          className="pl-12"
        />
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
