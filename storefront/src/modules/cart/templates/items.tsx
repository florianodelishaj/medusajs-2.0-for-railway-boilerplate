import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  items?: HttpTypes.StoreCartLineItem[]
  currencyCode: string
}

const ItemsTemplate = ({ items, currencyCode }: ItemsTemplateProps) => {
  return (
    <div className="border border-black rounded-md bg-white overflow-hidden">
      <div className="p-4 border-b border-black bg-green-400">
        <h2 className="flex flex-row text-2xl font-black uppercase items-baseline">
          Carrello
        </h2>
      </div>
      <div className="hidden small:flex items-center text-sm text-black/60 font-medium border-b border-black px-6 py-2">
        <div className="w-24 shrink-0">Oggetto</div>
        <div className="flex-1 px-4"></div>
        <div className="px-4 w-28">Quantità</div>
        <div className="px-4 text-right">Totale</div>
      </div>
      <div className="divide-y divide-black/10">
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

export default ItemsTemplate
