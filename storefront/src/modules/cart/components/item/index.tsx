"use client"

import { Table, Text, clx } from "@medusajs/ui"

import { useUpdateLineItem } from "@lib/hooks/use-cart-actions"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, currencyCode, type = "full" }: ItemProps) => {
  const { updateLineItem, isUpdating } = useUpdateLineItem()
  const [error, setError] = useState<string | null>(null)

  const { handle } = item.variant?.product ?? {}

  const changeQuantity = async (quantity: number) => {
    setError(null)

    try {
      await updateLineItem({
        lineId: item.id,
        quantity,
      })
    } catch (err: any) {
      // Error toast is already handled by useUpdateLineItem hook
      // Keep local error message for inline display
      setError(err.message)
    }
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell className="!pl-3 small:!pl-6 p-2 small:p-4 w-14 small:w-24">
        <LocalizedClientLink href={`/products/${handle}`} className="flex">
          <div className="w-12 h-12 small:w-20 small:h-20 border border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-md overflow-hidden">
            <Thumbnail
              thumbnail={item.variant?.product?.thumbnail}
              images={item.variant?.product?.images}
              size="square"
            />
          </div>
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="text-left py-2 small:py-4 px-2 small:px-4">
        <Text
          className="txt-small small:txt-medium-plus text-ui-fg-base"
          data-testid="product-title"
        >
          {item.product_title}
        </Text>
        {item.variant &&
          (item.variant.title !== "Default variant" ||
            item.product_title !== item.variant.title) && (
            <LineItemOptions
              variant={item.variant}
              data-testid="product-variant"
            />
          )}
      </Table.Cell>

      {type === "full" && (
        <Table.Cell className="py-2 small:py-4 px-1 small:px-4">
          <div className="flex gap-1 small:gap-2 items-center w-18 small:w-28">
            <DeleteButton id={item.id} data-testid="product-delete-button" />
            <Select
              value={String(item.quantity)}
              onValueChange={(value) => changeQuantity(parseInt(value))}
              disabled={isUpdating}
            >
              <SelectTrigger
                className="w-12 small:w-16 h-8 small:h-10 text-xs small:text-sm border text-black border-black rounded-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-400 transition-all"
                data-testid="product-select-button"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {Array.from(
                  {
                    length: Math.min(maxQuantity, 10),
                  },
                  (_, i) => (
                    <SelectItem
                      value={String(i + 1)}
                      key={i}
                      className="hover:bg-green-400 cursor-pointer"
                    >
                      {i + 1}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            {isUpdating && <Spinner />}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      <Table.Cell className="!pr-3 small:!pr-6 py-2 small:py-4 px-1 small:px-4 font-bold text-xs small:text-sm shrink-0 text-black">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <Text className="text-ui-fg-muted">{item.quantity}x </Text>
              <LineItemUnitPrice item={item} style="tight" />
            </span>
          )}
          <LineItemPrice
            item={item}
            currencyCode={currencyCode}
            style="tight"
          />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
