import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef, useState } from "react"

interface Props {
  category: HttpTypes.StoreProductCategory
  categoryPath: string[] // Array of parent category handles
  isOpen: boolean
  position: { top: number; left: number }
  backgroundColor?: string // Background color inherited from root category
  openOnLeft?: boolean // Whether dropdown should open on the left side
}

export const SubcategoryMenu = ({
  category,
  categoryPath,
  isOpen,
  position,
  backgroundColor,
  openOnLeft = false,
}: Props) => {
  const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(
    null
  )
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const menuRef = useRef<HTMLDivElement>(null)

  if (!isOpen || !category.category_children?.length) {
    return null
  }

  return (
    <div
      className="fixed z-[100]"
      style={{
        top: position.top,
        left: openOnLeft ? position.left : position.left - 12,
      }}
    >
      {/* Hover bridge covering vertical and horizontal gaps */}
      <div className="relative">
        <div className="h-3 w-[calc(240px+12px)]" />
        <div
          className="absolute top-0 h-full w-3"
          style={{ [openOnLeft ? "right" : "left"]: 0 }}
        />
      </div>
      <div className={`w-60 ${openOnLeft ? "mr-3" : "ml-3"}`}>
        <div
          ref={menuRef}
          className="text-black rounded-md overflow-hidden border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: backgroundColor || "#F5F5F5" }}
        >
          {category.category_children.map((subcategory) => {
            const hasChildren = Boolean(subcategory.category_children?.length)
            const fullPath = [...categoryPath, subcategory.handle].join("/")

            if (!hasChildren) {
              return (
                <LocalizedClientLink
                  key={subcategory.id}
                  href={`/categories/${fullPath}`}
                  className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center underline font-medium"
                >
                  {subcategory.name}
                </LocalizedClientLink>
              )
            }

            const itemRef = itemRefs.current[subcategory.id]
            const itemRect = itemRef?.getBoundingClientRect()
            const menuWidth = menuRef.current?.offsetWidth || 240
            const gap = 12

            // Maintain parent's direction preference
            let fitsOnRight: boolean
            if (itemRect) {
              if (openOnLeft) {
                // Parent opens on left, prefer left for children
                const fitsOnLeft = itemRect.left - menuWidth - gap >= 0
                fitsOnRight =
                  !fitsOnLeft &&
                  itemRect.right + gap + menuWidth <= window.innerWidth
              } else {
                // Parent opens on right, prefer right for children
                fitsOnRight =
                  itemRect.right + gap + menuWidth <= window.innerWidth
                if (!fitsOnRight) {
                  // Check if left works as fallback
                  fitsOnRight = !(itemRect.left - menuWidth - gap >= 0)
                }
              }
            } else {
              fitsOnRight = !openOnLeft
            }

            const nestedPosition = itemRect
              ? fitsOnRight
                ? {
                    top: itemRect.top - 12,
                    left: itemRect.right + gap,
                  }
                : {
                    top: itemRect.top - 12,
                    left: itemRect.left - menuWidth - gap,
                  }
              : position

            const isHovered = hoveredSubcategory === subcategory.id

            return (
              <div
                key={subcategory.id}
                ref={(el) => {
                  itemRefs.current[subcategory.id] = el
                }}
                className="relative"
                onMouseEnter={() => setHoveredSubcategory(subcategory.id)}
                onMouseLeave={() => setHoveredSubcategory(null)}
              >
                <div className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center font-medium cursor-default">
                  <span>{subcategory.name}</span>
                  {fitsOnRight ? (
                    <ChevronRight className="size-4" />
                  ) : (
                    <ChevronLeft className="size-4" />
                  )}
                </div>

                {isHovered && itemRect && (
                  <>
                    {/* Arrow pointing to nested menu */}
                    <div
                      className={`fixed w-0 h-0 z-[101] ${
                        fitsOnRight
                          ? "border-t-[10px] border-b-[10px] border-l-[10px] border-t-transparent border-b-transparent border-l-black"
                          : "border-t-[10px] border-b-[10px] border-r-[10px] border-t-transparent border-b-transparent border-r-black"
                      }`}
                      style={{
                        top: itemRect.top + itemRect.height / 2 - 10,
                        left: fitsOnRight
                          ? itemRect.right + 5
                          : itemRect.left - 11,
                      }}
                    />
                    <SubcategoryMenu
                      category={subcategory}
                      categoryPath={[...categoryPath, subcategory.handle]}
                      isOpen={true}
                      position={nestedPosition}
                      backgroundColor={backgroundColor}
                      openOnLeft={!fitsOnRight}
                    />
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
