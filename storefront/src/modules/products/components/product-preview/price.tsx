import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  const hasDiscount =
    price.price_type === "sale" ||
    (price.original_price_number > price.calculated_price_number)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 flex-wrap">
        <Text
          className="text-black font-bold text-lg"
          data-testid="price"
        >
          {price.calculated_price}
        </Text>
        {hasDiscount && (
          <span className="px-1.5 py-0.5 bg-red-500 text-white font-bold text-xs rounded border border-black">
            -{price.percentage_diff}%
          </span>
        )}
      </div>
      {hasDiscount && (
        <Text
          className="line-through text-gray-800 text-sm"
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      )}
    </div>
  )
}
