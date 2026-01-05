import { getPricesForVariant } from "@lib/util/get-product-price"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"

type LineItemUnitPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
}

const LineItemUnitPrice = ({
  item,
  style = "default",
}: LineItemUnitPriceProps) => {
  const {
    original_price,
    calculated_price,
    original_price_number,
    calculated_price_number,
    percentage_diff,
  } = getPricesForVariant(item.variant) ?? {}

  // Check if there's a cart discount (promo code) applied
  const lineTotal = item.total ?? 0
  const originalLineTotal = item.original_total ?? lineTotal
  const hasCartDiscount = lineTotal < originalLineTotal

  // Calculate final unit price including cart discounts
  const finalUnitPrice = item.quantity && item.quantity > 0
    ? lineTotal / item.quantity
    : calculated_price_number

  const displayPrice = hasCartDiscount
    ? convertToLocale({
        amount: finalUnitPrice,
        currency_code: (item as any).cart?.currency_code || (item as any).currency_code || 'eur'
      })
    : calculated_price

  const hasReducedPrice = calculated_price_number < original_price_number || hasCartDiscount

  return (
    <div className="flex flex-col text-ui-fg-muted justify-center h-full">
      {hasReducedPrice && (
        <>
          <p>
            {style === "default" && (
              <span className="text-ui-fg-muted">Original: </span>
            )}
            <span
              className="line-through"
              data-testid="product-unit-original-price"
            >
              {original_price}
            </span>
          </p>
          {style === "default" && (
            <span className="text-ui-fg-interactive">-{percentage_diff}%</span>
          )}
        </>
      )}
      <span
        className={clx("text-base-regular", {
          "text-ui-fg-interactive": hasReducedPrice,
        })}
        data-testid="product-unit-price"
      >
        {displayPrice}
      </span>
    </div>
  )
}

export default LineItemUnitPrice
