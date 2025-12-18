"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  minPrice?: string
  maxPrice?: string
  search?: boolean
  "data-testid"?: string
}

const RefinementList = ({
  sortBy,
  minPrice,
  maxPrice,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  return (
    <div className="flex flex-col gap-6 small:px-0 mr-0 small:mr-6 mb-6 small:min-w-[250px] lg:sticky lg:top-6">
      <SortProducts
        sortBy={sortBy}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setQueryParams={setQueryParams}
        data-testid={dataTestId}
      />
    </div>
  )
}

export default RefinementList
