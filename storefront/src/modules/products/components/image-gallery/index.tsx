"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0)

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Immagine principale */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100 border border-black rounded-md">
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
                      ? "border border-pink-400"
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
