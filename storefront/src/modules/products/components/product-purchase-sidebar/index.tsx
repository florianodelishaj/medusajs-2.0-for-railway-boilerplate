"use client"

import { useState, useMemo, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select"
import ProductPrice from "@modules/products/components/product-price"
import { useAddToCart } from "@lib/hooks/use-cart-actions"
import { useProductSelection } from "@modules/products/components/product-actions/context"
import { HttpTypes } from "@medusajs/types"
import ShippingInfoCards from "./shipping-info-cards"
import { AlertTriangle } from "lucide-react"

type ProductPurchaseSidebarProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

const ProductPurchaseSidebar = ({
  product: _product,
  region,
}: ProductPurchaseSidebarProps) => {
  const { product, selectedVariant, inStock, availableInventory, disabled } =
    useProductSelection()
  const [quantity, setQuantity] = useState(1)
  const { addToCart, isAdding } = useAddToCart()
  const countryCode = useParams().countryCode as string

  // Max quantità selezionabile (min tra 10 e inventory disponibile)
  const maxQuantity = Math.min(10, availableInventory)

  // Array quantità per select
  const quantityOptions = useMemo(() => {
    if (!selectedVariant || !inStock) return []
    return Array.from({ length: maxQuantity }, (_, i) => i + 1)
  }, [maxQuantity, selectedVariant, inStock])

  // Mostra messaggio "Ultimi rimasti" se inventory < 10
  const showLowStockWarning = useMemo(() => {
    if (!selectedVariant) return false
    return (
      selectedVariant.manage_inventory &&
      !selectedVariant.allow_backorder &&
      availableInventory > 0 &&
      availableInventory < 10
    )
  }, [selectedVariant, availableInventory])

  // Reset quantità quando cambia variante o quando non è più in stock
  useEffect(() => {
    if (!inStock || quantity > maxQuantity) {
      setQuantity(1)
    }
  }, [selectedVariant?.id, inStock, maxQuantity])

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity,
        countryCode,
      })
      // Reset quantità dopo aggiunta al carrello
      setQuantity(1)
    } catch (error) {
      // Error toast is already handled by useAddToCart hook
    }
  }

  return (
    <div className="bg-white border border-black rounded-md p-6 flex flex-col gap-6 xl:sticky xl:top-24">
      {/* Prezzo */}
      <div className="pb-4 border-b-2 border-black">
        <ProductPrice product={product} variant={selectedVariant} />
      </div>

      {/* Select Quantità */}
      {selectedVariant && inStock && (
        <div className="flex flex-col gap-2">
          <label
            htmlFor="quantity-select"
            className="text-sm font-bold uppercase text-gray-700"
          >
            Quantità
          </label>
          <Select
            value={quantity.toString()}
            onValueChange={(val) => setQuantity(parseInt(val))}
            disabled={disabled || isAdding}
          >
            <SelectTrigger
              id="quantity-select"
              className="h-10 border-black"
              data-testid="quantity-select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {quantityOptions.map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Messaggio "Ultimi X rimasti" */}
      {showLowStockWarning && (
        <div
          className="bg-red-500 border border-black rounded-md p-3"
          data-testid="low-stock-warning"
        >
          <p className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Ultimi {availableInventory} rimasti!
          </p>
        </div>
      )}

      {/* Bottone Aggiungi al Carrello */}
      <Button
        onClick={handleAddToCart}
        disabled={!inStock || !selectedVariant || disabled || isAdding}
        variant="elevated"
        isLoading={isAdding}
        data-testid="add-product-button"
        className="w-full h-12 bg-black text-white hover:bg-pink-400 hover:text-black"
      >
        {!selectedVariant
          ? "Seleziona variante"
          : !inStock
          ? "Esaurito"
          : "Aggiungi al carrello"}
      </Button>

      {/* Card Info Spedizioni */}
      <ShippingInfoCards />
    </div>
  )
}

export default ProductPurchaseSidebar
