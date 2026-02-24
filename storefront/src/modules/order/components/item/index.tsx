import { HttpTypes } from "@medusajs/types"

import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
}

const Item = ({ item, currencyCode }: ItemProps) => {
  return (
    <div
      className="flex items-center gap-4 border border-black rounded-md p-4"
      data-testid="product-row"
    >
      <div className="w-16 h-16 shrink-0">
        <Thumbnail thumbnail={item.thumbnail} size="square" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate" data-testid="product-name">
          {item.title}
        </p>
        {item.variant && item.variant.title !== "Default variant" && (
            <LineItemOptions
              variant={item.variant}
              data-testid="product-variant"
            />
          )}
      </div>

      <div className="flex flex-col items-end shrink-0">
        <span className="flex items-center gap-1 text-sm">
          <span className="text-gray-500" data-testid="product-quantity">
            {item.quantity}×
          </span>
          <LineItemUnitPrice item={item} style="tight" />
        </span>
        <LineItemPrice item={item} currencyCode={currencyCode} style="tight" />
      </div>
    </div>
  )
}

export default Item
