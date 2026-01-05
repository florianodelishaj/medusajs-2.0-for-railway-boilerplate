"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

type DynamicBackgroundProps = {
  children: React.ReactNode
  categories: any[]
}

export default function DynamicBackground({
  children,
  categories,
}: DynamicBackgroundProps) {
  const pathname = usePathname()
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)

  useEffect(() => {
    // Check if we're on the store page (Tutti)
    // const storeMatch = pathname.match(/\/[^\/]+\/store/)

    // if (storeMatch) {
    //   // For testing: use pokemon background on "Tutti" page
    //   setBackgroundImage("pokemon.jpg")
    //   return
    // }

    // Check if we're on a product page
    const productMatch = pathname.match(/\/[^\/]+\/products\/([^\/]+)/)

    if (productMatch) {
      const productHandle = productMatch[1]

      // Fetch product to get its categories
      const fetchProductCategories = async () => {
        try {
          // Extract country code from pathname
          const countryCode = pathname.split("/")[1]

          const response = await fetch(
            `/api/products/${productHandle}?countryCode=${countryCode}`
          )

          if (response.ok) {
            const product = await response.json()

            // Get product categories
            if (product.categories && product.categories.length > 0) {
              // Helper function to find if a category exists in children recursively
              const findInChildren = (
                children: any[],
                categoryId: string
              ): boolean => {
                if (!children) return false

                for (const child of children) {
                  if (child.id === categoryId) return true
                  if (findInChildren(child.category_children, categoryId)) {
                    return true
                  }
                }

                return false
              }

              // Find which top-level category this product belongs to
              const findTopLevelCategory = (categoryId: string): any => {
                // First check if it's directly a top-level category
                const topLevel = categories.find((cat) => cat.id === categoryId)
                if (topLevel) return topLevel

                // Otherwise search recursively in category children
                for (const topCat of categories) {
                  if (findInChildren(topCat.category_children, categoryId)) {
                    return topCat
                  }
                }

                return null
              }

              // Try to find top-level category for the first product category
              const topLevelCategory = findTopLevelCategory(
                product.categories[0].id
              )

              if (topLevelCategory?.metadata?.backgroundImage) {
                setBackgroundImage(
                  topLevelCategory.metadata.backgroundImage as string
                )
                return
              }
            }
          }

          setBackgroundImage(null)
        } catch (error) {
          console.error("Error fetching product categories:", error)
          setBackgroundImage(null)
        }
      }

      fetchProductCategories()
      return
    }

    // Check if we're on a category page
    const categoryMatch = pathname.match(/\/[^\/]+\/categories\/(.+)/)

    if (categoryMatch) {
      const categoryPath = categoryMatch[1].split("/")

      // Always get the first category (top-level parent) for the background
      const topLevelHandle = categoryPath[0]

      // Find the top-level category
      const topLevelCategory = categories.find(
        (cat) => cat.handle === topLevelHandle
      )

      if (topLevelCategory?.metadata?.backgroundImage) {
        setBackgroundImage(topLevelCategory.metadata.backgroundImage as string)
      } else {
        setBackgroundImage(null)
      }
    } else {
      setBackgroundImage(null)
    }
  }, [pathname, categories])

  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `url(/images/categories/${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "scroll",
      }
    : {}

  return (
    <div className="flex-1 bg-[#F4F4F0] relative" style={backgroundStyle}>
      {/* Semi-transparent overlay for better readability */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-white/40 pointer-events-none"
          style={{ zIndex: 0 }}
        />
      )}
      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
