import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductCentralInfo from "@modules/products/components/product-central-info"
import ProductDetails from "@modules/products/components/product-central-info/product-details"
import ProductPurchaseSidebar from "@modules/products/components/product-purchase-sidebar"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import { ProductCategoryContext } from "@modules/products/components/product-category-context"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  topLevelCategory?: HttpTypes.StoreProductCategory | null
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  topLevelCategory,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  // Check if all variants are out of stock
  const isOutOfStock = product.variants?.every((variant) => {
    if (!variant.manage_inventory) return false
    if (variant.allow_backorder) return false
    return (variant.inventory_quantity || 0) <= 0
  })

  // Check if any variant is in backorder (inventory ≤ 0 but allow_backorder is true)
  const isBackorder = product.variants?.some((variant) => {
    if (!variant.manage_inventory) return false
    return variant.allow_backorder && (variant.inventory_quantity || 0) <= 0
  })

  // Check if any variant has discount (sale price)
  const hasDiscount = product.variants?.some((variant) => {
    const calculatedAmount = variant.calculated_price?.calculated_amount
    const originalAmount = variant.calculated_price?.original_amount
    const priceListType =
      variant.calculated_price?.calculated_price?.price_list_type

    if (!calculatedAmount) return false

    return (
      priceListType === "sale" ||
      (originalAmount && originalAmount > calculatedAmount)
    )
  })

  // Check if product has selectable variants
  // A product has selectable variants if:
  // 1. It has more than one variant, OR
  // 2. It has at least one option with more than one value
  const hasSelectableVariants =
    (product.variants && product.variants.length > 1) ||
    (product.options &&
      product.options.some(
        (option) => option.values && option.values.length > 1
      ))

  // Ensure thumbnail is included in images array
  const allImages = [...(product.images || [])]
  if (
    product.thumbnail &&
    !allImages.find((img) => img.url === product.thumbnail)
  ) {
    allImages.unshift({
      id: "thumbnail",
      url: product.thumbnail,
    } as HttpTypes.StoreProductImage)
  }

  console.log("images", product.images)

  return (
    <>
      <ProductCategoryContext category={topLevelCategory || null} />
      <div className="content-container py-6" data-testid="product-container">
        <Suspense
          fallback={
            <ProductActions disabled={true} product={product} region={region}>
              <div className="flex flex-col xl:flex-row gap-6">
                {/* Immagine - order-1 */}
                <div className="w-full xl:w-auto xl:min-w-[300px] xl:max-w-[650px] xl:shrink xl:grow-0 xl:basis-[650px] order-1">
                  <ImageGallery
                    images={allImages}
                    isOutOfStock={isOutOfStock}
                    hasDiscount={hasDiscount}
                    isBackorder={isBackorder}
                  />
                </div>

                {/* Mobile: Titolo - order-2 */}
                <div className="xl:hidden order-2">
                  <Heading
                    level="h1"
                    className="text-3xl font-black uppercase text-black"
                    data-testid="product-title-mobile"
                  >
                    {product.title}
                  </Heading>
                </div>

                {/* Mobile: Selezione Varianti - order-3 */}
                {hasSelectableVariants && (
                  <div className="xl:hidden order-3">
                    <ProductOnboardingCta />
                    <ProductCentralInfo
                      product={product}
                      showTitle={false}
                      showVariants={true}
                      showDescription={false}
                      showDetails={false}
                    />
                  </div>
                )}

                {/* Mobile: Descrizione - order-4 */}
                <div className="xl:hidden order-4">
                  <ProductCentralInfo
                    product={product}
                    showTitle={false}
                    showVariants={false}
                    showDescription={true}
                    showDetails={false}
                  />
                </div>

                {/* Desktop: Info Centrale completa - order-2 */}
                <div className="hidden xl:block flex-1 w-full xl:min-w-[400px] xl:order-2">
                  <ProductOnboardingCta />
                  <ProductCentralInfo product={product} />
                </div>

                {/* Sidebar Acquisto - Mobile: order-5, Desktop: order-3 */}
                <div className="w-full xl:w-auto xl:min-w-[280px] xl:max-w-96 xl:shrink xl:grow-0 xl:basis-96 order-5 xl:order-3">
                  <ProductPurchaseSidebar product={product} region={region} />
                </div>

                {/* Mobile: Dettagli Prodotto - order-6 */}
                <div className="w-full xl:hidden order-6">
                  <ProductDetails product={product} />
                </div>
              </div>
            </ProductActions>
          }
        >
          <ProductActionsWrapper id={product.id} region={region}>
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Immagine - order-1 */}
              <div className="w-full xl:w-auto xl:min-w-[300px] xl:max-w-[650px] xl:shrink xl:grow-0 xl:basis-[650px] order-1">
                <ImageGallery
                  images={allImages}
                  isOutOfStock={isOutOfStock}
                  hasDiscount={hasDiscount}
                />
              </div>

              {/* Mobile: Titolo - order-2 */}
              <div className="xl:hidden order-2">
                <Heading
                  level="h1"
                  className="text-3xl font-black uppercase text-black"
                  data-testid="product-title-mobile"
                >
                  {product.title}
                </Heading>
              </div>

              {/* Mobile: Selezione Varianti - order-3 */}
              {hasSelectableVariants && (
                <div className="xl:hidden order-3">
                  <ProductOnboardingCta />
                  <ProductCentralInfo
                    product={product}
                    showTitle={false}
                    showVariants={true}
                    showDescription={false}
                    showDetails={false}
                  />
                </div>
              )}

              {/* Mobile: Descrizione - order-4 */}
              <div className="xl:hidden order-4">
                <ProductCentralInfo
                  product={product}
                  showTitle={false}
                  showVariants={false}
                  showDescription={true}
                  showDetails={false}
                />
              </div>

              {/* Desktop: Info Centrale completa - order-2 */}
              <div className="hidden xl:block flex-1 w-full xl:min-w-[400px] xl:order-2">
                <ProductOnboardingCta />
                <ProductCentralInfo product={product} />
              </div>

              {/* Sidebar Acquisto - Mobile: order-5, Desktop: order-3 */}
              <div className="w-full xl:w-auto xl:min-w-[280px] xl:max-w-96 xl:shrink xl:grow-0 xl:basis-96 order-5 xl:order-3">
                <ProductPurchaseSidebar product={product} region={region} />
              </div>

              {/* Mobile: Dettagli Prodotto - order-6 */}
              <div className="w-full xl:hidden order-6">
                <ProductDetails product={product} />
              </div>
            </div>
          </ProductActionsWrapper>
        </Suspense>
      </div>
      <div
        className="content-container my-12"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
