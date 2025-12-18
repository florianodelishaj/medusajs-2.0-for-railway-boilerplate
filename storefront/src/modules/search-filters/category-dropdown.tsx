"use client"

import { HttpTypes } from "@medusajs/types"
import { Button } from "@components/ui/button"
import { cn } from "@lib/util/cn"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useRef, useState, memo } from "react"
import { useDropdownPosition } from "./use-dropdown-position"
import { SubcategoryMenu } from "./subcategory-menu"

interface Props {
  category: HttpTypes.StoreProductCategory
  categoryPath?: string[] // Array of parent category handles (empty for root categories)
  isActive?: boolean
}

const CategoryDropdownComponent = ({
  category,
  categoryPath = [],
  isActive,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { getDropdownPosition } = useDropdownPosition(dropdownRef)

  const onMouseEnter = () => {
    if (category.category_children && category.category_children.length > 0) {
      setIsOpen(true)
      setDropdownPosition(getDropdownPosition())
    }
  }

  const onMouseLeave = () => setIsOpen(false)

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
        <Button
          asChild
          variant="elevated"
          className={cn(
            "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-black text-black transition-all",
            isActive && "bg-white border-black",
            isOpen &&
              "bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px] border-black"
          )}
        >
          <LocalizedClientLink href={`/categories/${fullPath}`}>
            {category.name}
          </LocalizedClientLink>
        </Button>
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
        backgroundColor={(category.metadata?.color as string) || "#F4F4F0"}
      />
    </div>
  )
}

export const CategoryDropdown = memo(CategoryDropdownComponent)
