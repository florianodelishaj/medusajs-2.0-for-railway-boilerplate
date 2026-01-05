import { getPercentageDiff } from "@lib/util/get-precentage-diff"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type LineItemPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
  style?: "default" | "tight"
}

const LineItemPrice = ({
  item,
  currencyCode,
  style = "default",
}: LineItemPriceProps) => {
  // totale riga (sconti + tasse inclusi), in minor units
  const lineTotal = item.total ?? 0

  // totale riga originale (prima dei coupon, ma con price list discount), se disponibile
  const originalLineTotal = item.original_total ?? lineTotal

  // Check for discount from cart (promo codes)
  const hasCartDiscount = lineTotal < originalLineTotal

  return (
    <div className="flex flex-col gap-x-2 items-end">
      <div className="flex flex-col items-center gap-y-1">
        {/* Show crossed out total before cart discount when coupon is applied */}
        {/* originalLineTotal is the total after price list discount but before cart discount */}
        {hasCartDiscount && (
          <>
            <p>
              {style === "default" && (
                <span className="text-ui-fg-subtle">Original: </span>
              )}
              <span
                className="line-through text-ui-fg-muted"
                data-testid="product-original-price"
              >
                {convertToLocale({
                  amount: originalLineTotal,
                  currency_code: currencyCode,
                })}
              </span>
            </p>
            {style === "default" && (
              <span className="text-ui-fg-interactive">
                -{getPercentageDiff(originalLineTotal, lineTotal || 0)}%
              </span>
            )}
          </>
        )}
        <span
          className="px-2 py-1 border bg-green-400"
          data-testid="product-price"
        >
          {convertToLocale({
            amount: lineTotal,
            currency_code: currencyCode,
          })}
        </span>
      </div>
    </div>
  )
}

export default LineItemPrice
