"use client"

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  items?: HttpTypes.StoreCartLineItem[]
  currencyCode: string
}

const ItemsPreviewTemplate = ({ items, currencyCode }: ItemsTemplateProps) => {
  const hasOverflow = items && items.length > 4

  return (
    <div
      className={
        hasOverflow
          ? "pl-[1px] overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]"
          : ""
      }
    >
      <div className="divide-y divide-gray-200" data-testid="items-table">
        {items
          ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => {
                return (
                  <Item
                    key={item.id}
                    item={item}
                    currencyCode={currencyCode}
                    type="preview"
                  />
                )
              })
          : repeat(5).map((i) => {
              return <SkeletonLineItem key={i} />
            })}
      </div>
    </div>
  )
}

export default ItemsPreviewTemplate
