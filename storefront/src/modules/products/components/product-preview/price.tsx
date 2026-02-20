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
    <div className="flex items-stretch min-h-[2.5rem]">
      <div className="flex-1 bg-green-400 px-4 py-2 flex items-center gap-2">
        {hasDiscount && (
          <Text
            className="text-sm text-black/50 line-through"
            data-testid="original-price"
          >
            {price.original_price}
          </Text>
        )}
        <Text className="font-black text-base" data-testid="price">
          {price.calculated_price}
        </Text>
      </div>
      {hasDiscount && price.percentage_diff && (
        <div className="hidden md:flex bg-red-500 border-l border-black px-3 items-center justify-center shrink-0">
          <span className="text-white font-black text-sm whitespace-nowrap">
            -{price.percentage_diff}%
          </span>
        </div>
      )}
    </div>
  )
}
