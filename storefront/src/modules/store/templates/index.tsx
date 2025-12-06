import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  minPrice,
  maxPrice,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  minPrice?: string
  maxPrice?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div
      className="flex flex-col small:flex-row small:items-start content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} minPrice={minPrice} maxPrice={maxPrice} />
      <div className="w-full">
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            minPrice={minPrice}
            maxPrice={maxPrice}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
