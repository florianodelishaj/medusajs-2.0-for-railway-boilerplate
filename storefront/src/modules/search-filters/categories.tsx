"use client"

import { HttpTypes } from "@medusajs/types"
import { useEffect, useRef, useState } from "react"
import { CategoryDropdown } from "./category-dropdown"
import { Funnel } from "@medusajs/icons"
import { Button } from "@components/ui/button"
import { cn } from "@lib/util/cn"
import { usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface Props {
  data: HttpTypes.StoreProductCategory[]
  onViewAllClick: () => void
}

export const Categories = ({ data, onViewAllClick }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const [visibleCount, setVisibleCount] = useState(data.length)

  // Check if we're on /store or in a category
  const isOnStore = pathname?.includes("/store")
  const pathParts = pathname?.split("/") || []
  const categoryIndex = pathParts.indexOf("categories")
  const activeCategory =
    categoryIndex !== -1 && pathParts[categoryIndex + 1]
      ? pathParts[categoryIndex + 1]
      : null

  const activeCategoryIndex = data.findIndex(
    (cat) => cat.handle === activeCategory
  )
  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1

  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const buttons = container.querySelectorAll("[data-category-button]")
      if (buttons.length === 0) return

      const containerWidth = container.offsetWidth
      const allButton = container.querySelector("[data-all-button]")
      const allButtonWidth = allButton?.getBoundingClientRect().width || 0
      const viewAllWidth = 140 // Stima per "Vedi Tutte" button
      const gap = 8 // gap-2 = 8px

      const availableWidth =
        containerWidth - allButtonWidth - viewAllWidth - gap * 2

      let totalWidth = 0
      let count = 0

      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i] as HTMLElement
        const buttonWidth = button.getBoundingClientRect().width
        const widthWithGap = count === 0 ? buttonWidth : buttonWidth + gap

        if (totalWidth + widthWithGap > availableWidth) break

        totalWidth += widthWithGap
        count++
      }

      const newCount = Math.max(1, count)
      setVisibleCount((prev) => (prev === newCount ? prev : newCount))
    }

    // Initial calculation
    const timer = setTimeout(calculateVisible, 100)

    // Debounced resize observer
    let resizeTimer: NodeJS.Timeout
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(calculateVisible, 100)
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      // clearTimeout(timer)
      clearTimeout(resizeTimer)
      resizeObserver.disconnect()
    }
  }, [data.length])

  return (
    <div
      ref={containerRef}
      className="flex flex-nowrap items-center gap-2 w-full"
    >
      <div className="shrink-0" data-all-button>
        <LocalizedClientLink href="/store">
          <Button
            variant="elevated"
            className={cn(
              "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-black text-black transition-all",
              isOnStore && "bg-white border-black"
            )}
          >
            Tutti
          </Button>
        </LocalizedClientLink>
      </div>
      {data.map((category, index) => (
        <div
          key={category.id}
          data-category-button
          className={cn(index >= visibleCount && "invisible absolute")}
        >
          <CategoryDropdown
            category={category}
            isActive={activeCategory === category.handle}
          />
        </div>
      ))}

      {visibleCount < data.length && (
        <div className="shrink-0" data-view-all-button>
          <Button
            variant="elevated"
            onClick={onViewAllClick}
            className={cn(
              "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-black text-black transition-all",
              isActiveCategoryHidden && "bg-white border-black"
            )}
          >
            Vedi Tutte
            <Funnel className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
