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

  // prezzo unitario in minor units
  const unitPrice =
    item.quantity && item.quantity > 0 ? lineTotal / item.quantity : 0

  // totale riga originale (prima degli sconti), se disponibile
  const originalLineTotal = item.original_total ?? lineTotal

  // prezzo unitario originale in minor units
  const originalUnitPrice =
    item.quantity && item.quantity > 0
      ? originalLineTotal / item.quantity
      : unitPrice

  // Check for discount from cart (promo codes)
  const hasCartDiscount = lineTotal < originalLineTotal

  // Check for discount from price list (sale prices on variants)
  const variantCalcAmount = (item as any).variant?.calculated_price?.calculated_amount
  const variantOrigAmount = (item as any).variant?.calculated_price?.original_amount
  const variantPriceListType = (item as any).variant?.calculated_price?.calculated_price?.price_list_type

  const hasPriceListDiscount =
    variantCalcAmount &&
    (variantPriceListType === "sale" ||
     (variantOrigAmount && variantOrigAmount > variantCalcAmount))

  // Use price list discount if available, otherwise cart discount
  const hasReducedPrice = hasPriceListDiscount || hasCartDiscount

  const finalOriginalPrice = hasPriceListDiscount && variantOrigAmount
    ? variantOrigAmount
    : originalUnitPrice

  const finalCurrentPrice = hasPriceListDiscount && variantCalcAmount
    ? variantCalcAmount
    : unitPrice

  return (
    <div className="flex flex-col gap-x-2 items-end">
      <div className="flex flex-col items-center gap-y-1">
        {hasReducedPrice && (
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
                  amount: finalOriginalPrice,
                  currency_code: currencyCode,
                })}
              </span>
            </p>
            {style === "default" && (
              <span className="text-ui-fg-interactive">
                -{getPercentageDiff(finalOriginalPrice, finalCurrentPrice || 0)}%
              </span>
            )}
          </>
        )}
        <span
          className="px-2 py-1 border bg-green-400"
          data-testid="product-price"
        >
          {convertToLocale({
            amount: unitPrice,
            currency_code: currencyCode,
          })}
        </span>
      </div>
    </div>
  )
}

export default LineItemPrice
