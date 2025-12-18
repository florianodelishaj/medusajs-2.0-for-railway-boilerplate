import { HttpTypes } from "@medusajs/types"

/**
 * Calcola lo sconto totale combinando:
 * 1. Sconto da promo code (cart.discount_total)
 * 2. Sconto da price list (sale prices sulle varianti)
 */
export function getTotalDiscount(
  cart: HttpTypes.StoreCart | HttpTypes.StoreOrder
): number {
  // Sconto da promo code (cart-based)
  const cartDiscount = cart?.discount_total ?? 0

  // Sconto da price list (sale prices)
  const priceListDiscount =
    cart?.items?.reduce((acc, item) => {
      const variantCalcAmount = (item as any).variant?.calculated_price
        ?.calculated_amount
      const variantOrigAmount = (item as any).variant?.calculated_price
        ?.original_amount
      const variantPriceListType = (item as any).variant?.calculated_price
        ?.calculated_price?.price_list_type

      const hasPriceListDiscount =
        variantCalcAmount &&
        (variantPriceListType === "sale" ||
          (variantOrigAmount && variantOrigAmount > variantCalcAmount))

      if (hasPriceListDiscount && variantOrigAmount) {
        const discountPerUnit = variantOrigAmount - variantCalcAmount
        return acc + discountPerUnit * item.quantity
      }

      return acc
    }, 0) ?? 0

  return cartDiscount + priceListDiscount
}
