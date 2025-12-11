"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@components/ui/sheet"
import { ScrollArea } from "@components/ui/scroll-area"

import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: HttpTypes.StoreProductCategory[]
}

export const CategoriesSidebar = ({ open, onOpenChange, data }: Props) => {
  const router = useRouter()

  // Stack of categories for N-level navigation
  const [categoryStack, setCategoryStack] = useState<
    HttpTypes.StoreProductCategory[]
  >([])

  // Current level categories to display
  const currentCategories =
    categoryStack.length > 0
      ? (categoryStack[categoryStack.length - 1].category_children as HttpTypes.StoreProductCategory[]) || []
      : data

  const handleOpenChange = (open: boolean) => {
    setCategoryStack([])
    onOpenChange(open)
  }

  const handleCategoryClick = (category: HttpTypes.StoreProductCategory) => {
    if (category.category_children && category.category_children.length > 0) {
      // Has subcategories - push to stack
      setCategoryStack([...categoryStack, category])
    } else {
      // Leaf category - navigate
      const pathSegments = [...categoryStack, category].map((c) => c.handle)
      const url = `/categories/${pathSegments.join("/")}`
      router.push(url)
      handleOpenChange(false)
    }
  }

  // Get background color from the first category in stack (root category)
  const backgroundColor =
    categoryStack.length > 0
      ? ((categoryStack[0].metadata?.color as string) || "white")
      : "white"

  const handleBackClick = () => {
    if (categoryStack.length > 0) {
      setCategoryStack(categoryStack.slice(0, -1))
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="left" className="p-0" style={{ backgroundColor }}>
        <SheetHeader className="p-4 border-b-2 border-black">
          <SheetTitle>Categorie</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {categoryStack.length > 0 ? (
            <button
              onClick={handleBackClick}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center font-medium cursor-pointer border-b border-black/10"
            >
              <ChevronLeftIcon className="size-4 mr-2" />
              Indietro
            </button>
          ) : (
            <button
              onClick={() => {
                router.push("/store")
                handleOpenChange(false)
              }}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center font-medium cursor-pointer border-b border-black/10 transition-colors"
            >
              Tutti
            </button>
          )}
          {currentCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center font-medium cursor-pointer border-b border-black/10 transition-colors"
            >
              {category.name}
              {category.category_children &&
                category.category_children.length > 0 && (
                  <ChevronRightIcon className="size-4" />
                )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
