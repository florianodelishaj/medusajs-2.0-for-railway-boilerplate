"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  minPrice?: string
  maxPrice?: string
  setQueryParams: (name: string, value: string) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at",
    label: "Ultimi arrivi",
  },
  {
    value: "price_asc",
    label: "Prezzo crescente",
  },
  {
    value: "price_desc",
    label: "Prezzo decrescente",
  },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  minPrice,
  maxPrice,
  setQueryParams,
}: SortProductsProps) => {
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  const handlePriceChange = (name: string, value: string) => {
    setQueryParams(name, value)
  }

  return (
    <FilterRadioGroup
      title="Filtri"
      items={sortOptions}
      value={sortBy}
      minPrice={minPrice}
      maxPrice={maxPrice}
      handleChange={handleChange}
      handlePriceChange={handlePriceChange}
      data-testid={dataTestId}
    />
  )
}

export default SortProducts
