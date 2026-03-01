"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@components/ui/sheet"
import { cn } from "@lib/util/cn"
import { ScrollArea } from "@components/ui/scroll-area"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { NAV_ROUTES } from "@lib/constants/nav-routes"
import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: HttpTypes.StoreProductCategory[]
}

export const NavMenuSidebar = ({ open, onOpenChange, categories }: Props) => {
  const router = useRouter()
  const [categoryStack, setCategoryStack] = useState<
    HttpTypes.StoreProductCategory[]
  >([])

  const currentParent =
    categoryStack.length > 0 ? categoryStack[categoryStack.length - 1] : null

  const currentCategories =
    categoryStack.length > 0
      ? (currentParent?.category_children as HttpTypes.StoreProductCategory[]) ||
        []
      : categories

  // Colore sfondo dalla categoria radice (come CategoriesSidebar)
  const backgroundColor =
    categoryStack.length > 0
      ? (categoryStack[0].metadata?.color as string) || "white"
      : "white"

  const handleClose = () => {
    setCategoryStack([])
    onOpenChange(false)
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setCategoryStack([])
    onOpenChange(isOpen)
  }

  const handleCategoryClick = (category: HttpTypes.StoreProductCategory) => {
    if (category.category_children && category.category_children.length > 0) {
      setCategoryStack([...categoryStack, category])
    } else {
      const pathSegments = [...categoryStack, category].map((c) => c.handle)
      router.push(`/categories/${pathSegments.join("/")}`)
      handleClose()
    }
  }

  const filteredNavRoutes = NAV_ROUTES.filter((r) => r.href !== "/store")

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="p-0 flex flex-col gap-0"
        style={{ backgroundColor }}
      >
        <SheetHeader
          className={cn("p-4 pr-16 border-b-2 border-black", {
            "bg-green-400": categoryStack.length === 0,
          })}
        >
          <SheetTitle className="text-2xl font-black uppercase">
            {currentParent ? currentParent.name : "Menu"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Navigazione principale del sito
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          {categoryStack.length > 0 ? (
            // Livello sottocategoria
            <>
              <button
                onClick={() => setCategoryStack(categoryStack.slice(0, -1))}
                className="w-full text-left p-4 hover:bg-green-400 hover:text-black flex items-center font-medium cursor-pointer border-b border-black/10 transition-colors"
              >
                <ChevronLeftIcon className="size-4 mr-2" />
                Indietro
              </button>
              <LocalizedClientLink
                href={`/categories/${categoryStack
                  .map((c) => c.handle)
                  .join("/")}`}
                onClick={handleClose}
                className="w-full text-left p-4 hover:bg-green-400 hover:text-black font-black uppercase cursor-pointer border-b-2 border-black transition-colors block"
              >
                Vedi tutti in {currentParent?.name}
              </LocalizedClientLink>
            </>
          ) : (
            // Livello radice — sezione Categorie
            <>
              <p className="mx-4 pl-3 mt-4 mb-2 py-0.5 text-xs font-black uppercase tracking-widest text-black border-l-4 border-green-400">
                Categorie
              </p>
              <LocalizedClientLink
                href="/store"
                onClick={handleClose}
                className="w-full text-left p-4 hover:bg-green-400 hover:text-black font-semibold cursor-pointer border-b border-black/10 transition-colors block"
              >
                Tutti i prodotti
              </LocalizedClientLink>
            </>
          )}

          {currentCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="w-full text-left p-4 hover:bg-green-400 hover:text-black flex justify-between items-center font-medium cursor-pointer border-b border-black/10 transition-colors"
            >
              {category.name}
              {category.category_children &&
                category.category_children.length > 0 && (
                  <ChevronRightIcon className="size-4" />
                )}
            </button>
          ))}

          {/* Sezione Navigazione — solo al livello radice */}
          {categoryStack.length === 0 && (
            <div className="mt-6">
              <p className="mx-4 pl-3 mb-2 py-0.5 text-xs font-black uppercase tracking-widest text-black border-l-4 border-green-400">
                Navigazione
              </p>
              {filteredNavRoutes.map((item) => (
                <LocalizedClientLink
                  key={item.href}
                  href={item.href}
                  onClick={handleClose}
                  className="w-full text-left p-4 hover:bg-green-400 hover:text-black font-medium cursor-pointer border-b border-black/10 transition-colors block"
                >
                  {item.label}
                </LocalizedClientLink>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Account e Carrello — sempre su sfondo bianco, separati dal resto */}
        <div className="border-t-2 border-black bg-white">
          <LocalizedClientLink
            href="/account"
            onClick={handleClose}
            className="w-full text-left p-4 hover:bg-green-400 text-black font-medium cursor-pointer border-b border-black/10 transition-colors block"
          >
            Account
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/cart"
            onClick={handleClose}
            className="w-full text-left p-4 bg-black text-white hover:bg-green-400 hover:text-black font-medium cursor-pointer transition-colors block"
          >
            Carrello
          </LocalizedClientLink>
        </div>
      </SheetContent>
    </Sheet>
  )
}
