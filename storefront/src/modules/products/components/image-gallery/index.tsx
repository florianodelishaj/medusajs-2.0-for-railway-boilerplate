"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState, useContext } from "react"
import { ProductSelectionContext } from "@modules/products/components/product-actions/context"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  isOutOfStock?: boolean
  hasDiscount?: boolean
  isBackorder?: boolean
}

const ImageGallery = ({
  images,
  isOutOfStock,
  hasDiscount,
  isBackorder: isBackorderProp,
}: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0)

  // Use context value if available (product detail page), otherwise use prop (product lists)
  const context = useContext(ProductSelectionContext)
  const isBackorder = context ? context.isBackorder : isBackorderProp

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Immagine principale */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100 border border-black rounded-md">
        {isOutOfStock && (
          <div className="absolute top-4 -left-10 z-10 w-40 text-center bg-gray-800 border-2 border-black py-1 transform -rotate-45 shadow-lg">
            <span className="text-xs font-bold uppercase text-white">
              Esaurito
            </span>
          </div>
        )}
        {!isOutOfStock && isBackorder && (
          <div className="absolute top-4 -left-10 z-10 w-40 text-center bg-yellow-400 border-2 border-black py-1 transform -rotate-45 shadow-lg">
            <span className="text-xs font-bold uppercase text-black">
              Preordina
            </span>
          </div>
        )}
        {!isOutOfStock && !isBackorder && hasDiscount && (
          <div className="absolute top-4 -left-10 z-10 w-40 text-center bg-red-500 border-2 border-black py-1 transform -rotate-45 shadow-lg">
            <span className="text-xs font-bold uppercase text-white">
              Sconto
            </span>
          </div>
        )}
        {images[selectedImage]?.url && (
          <Image
            src={images[selectedImage].url}
            priority
            className="absolute inset-0"
            alt={`Product image ${selectedImage + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            style={{
              objectFit: "cover",
            }}
          />
        )}
      </div>

      {/* Thumbnail grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 small:grid-cols-5 gap-3">
          {images.map((image, index) => {
            const isSelected = index === selectedImage
            return (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`
                  relative aspect-square w-full overflow-hidden rounded-md transition-all cursor-pointer
                  ${
                    isSelected
                      ? "border border-green-400"
                      : "border border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  }
                `}
              >
                {image.url && (
                  <Image
                    src={image.url}
                    className="absolute inset-0"
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    sizes="100px"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
