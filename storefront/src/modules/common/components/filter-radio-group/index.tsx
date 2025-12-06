"use client"

import { Text, clx } from "@medusajs/ui"
import { ChevronRight, ChevronUp } from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@components/ui/input"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  minPrice?: string
  maxPrice?: string
  handleChange: (...args: any[]) => void
  handlePriceChange?: (name: string, value: string) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  minPrice: initialMinPrice,
  maxPrice: initialMaxPrice,
  handleChange,
  handlePriceChange,
}: FilterRadioGroupProps) => {
  const [isPriceOpen, setIsPriceOpen] = useState(false)
  const [minPrice, setMinPrice] = useState(initialMinPrice || "")
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice || "")

  useEffect(() => {
    setMinPrice(initialMinPrice || "")
    setMaxPrice(initialMaxPrice || "")
  }, [initialMinPrice, initialMaxPrice])

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = e.target.value
    setMinPrice(newMin)
    if (handlePriceChange) {
      handlePriceChange("min_price", newMin)
    }
  }

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = e.target.value
    setMaxPrice(newMax)
    if (handlePriceChange) {
      handlePriceChange("max_price", newMax)
    }
  }

  return (
    <>
      <Text className="p-4 border rounded-md flex items-center justify-between font-medium">
        {title}
      </Text>
      <div className="w-full lg:w-auto border rounded-md bg-white">
        {/* Ordinamento per prezzo */}
        {items?.map((i) => (
          <div
            key={i.value}
            className={clx("p-4 flex flex-col gap-2 border-b", {
              "bg-pink-400": i.value === value,
              "bg-white": i.value !== value,
            })}
          >
            <div
              className={clx(
                "flex items-center justify-between cursor-pointer"
              )}
              onClick={() => handleChange(i.value)}
            >
              <Text className="font-medium">{i.label}</Text>
            </div>
          </div>
        ))}

        {/* Filtro per range di prezzo */}
        <div className="p-4 flex flex-col gap-2 border-b-0">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsPriceOpen(!isPriceOpen)}
          >
            <Text className="font-medium">Prezzo</Text>
            {isPriceOpen ? (
              <ChevronUp className="size-5" />
            ) : (
              <ChevronRight className="size-5" />
            )}
          </div>
          {isPriceOpen && (
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex flex-col gap-1.5">
                <Text className="font-medium">Prezzo minimo</Text>
                <Input
                  id="min-price"
                  type="number"
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  placeholder="€0"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Text className="font-medium">Prezzo massimo</Text>

                <Input
                  id="max-price"
                  type="number"
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  placeholder="∞"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default FilterRadioGroup
