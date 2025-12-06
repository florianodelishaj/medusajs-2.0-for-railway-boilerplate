"use client"

import { HttpTypes } from "@medusajs/types"
import { Button } from "@components/ui/button"
import { cn } from "@lib/util/cn"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useRef, useState } from "react"
import { useDropdownPosition } from "./use-dropdown-position"
import { SubcategoryMenu } from "./subcategory-menu"

interface Props {
  category: HttpTypes.StoreProductCategory
  categoryPath?: string[] // Array of parent category handles (empty for root categories)
  isActive?: boolean
}

export const CategoryDropdown = ({
  category,
  categoryPath = [],
  isActive,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { getDropdownPosition } = useDropdownPosition(dropdownRef)

  const onMouseEnter = () => {
    if (category.category_children && category.category_children.length > 0) {
      setIsOpen(true)
    }
  }

  const onMouseLeave = () => setIsOpen(false)

  const dropdownPosition = getDropdownPosition()

  const hasSubcategories =
    category.category_children && category.category_children.length > 0

  // Build full path for this category
  const fullPath = [...categoryPath, category.handle].join("/")

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative">
        {hasSubcategories ? (
          // Se ha sottocategorie, è solo un bottone (non navigabile)
          <Button
            variant="elevated"
            className={cn(
              "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-black text-black transition-all",
              isActive &&
                "bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
              isOpen &&
                "bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px] border-black"
            )}
          >
            {category.name}
          </Button>
        ) : (
          // Se non ha sottocategorie, è un link normale
          <Button
            asChild
            variant="elevated"
            className={cn(
              "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-black text-black transition-all",
              isActive &&
                "bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
              isOpen &&
                "bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px] border-black"
            )}
          >
            <LocalizedClientLink href={`/categories/${fullPath}`}>
              {category.name}
            </LocalizedClientLink>
          </Button>
        )}
        {hasSubcategories && (
          <div
            className={cn(
              "opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2 transition-none",
              isOpen && "opacity-100"
            )}
          />
        )}
      </div>

      <SubcategoryMenu
        category={category}
        categoryPath={[...categoryPath, category.handle]}
        isOpen={isOpen}
        position={dropdownPosition}
        backgroundColor={(category.metadata?.color as string) || "#F5F5F5"}
      />
    </div>
  )
}
