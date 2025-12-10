"use client"

import { Badge, Heading, Text, Tooltip, TooltipProvider } from "@medusajs/ui"
import React from "react"
import { useFormState } from "react-dom"

import { applyPromotions, submitPromotionForm } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { InformationCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const { items = [], promotions = [] } = cart
  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter(
      (promotion) => promotion.code !== code
    )

    await applyPromotions(
      validPromotions.filter((p) => p.code === undefined).map((p) => p.code!)
    )
  }

  const [message, formAction] = useFormState(submitPromotionForm, null)

  return (
    <div className="w-full bg-white flex flex-col">
      <div className="txt-medium">
        <form action={formAction} className="w-full">
          <div className="flex items-center gap-x-2 my-2">
            <Button
              variant="elevated"
              className="hover:bg-pink-400"
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              data-testid="add-discount-button"
            >
              Aggiungi codice sconto
            </Button>

            <TooltipProvider>
              <Tooltip
                content="Puoi aggiungere più codici promozionali"
                className="bg-white border rounded-md border-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <InformationCircleSolid className="cursor-help" />
              </Tooltip>
            </TooltipProvider>
          </div>

          {isOpen && (
            <>
              <div className="flex w-full gap-x-4 items-center mt-4">
                <Input
                  id="promotion-input"
                  name="code"
                  type="text"
                  autoFocus={false}
                  data-testid="discount-input"
                  className="h-10"
                />
                <Button
                  variant="elevated"
                  data-testid="discount-apply-button"
                  className="bg-black text-white hover:bg-pink-400 hover:text-black"
                >
                  Applica
                </Button>
              </div>

              <ErrorMessage
                error={message}
                data-testid="discount-error-message"
              />
            </>
          )}
        </form>

        {promotions.length > 0 && (
          <div className="w-full flex items-center">
            <div className="flex flex-col w-full">
              <Heading className="txt-medium my-2">
                {promotions.length === 1
                  ? "Promozione applicata:"
                  : "Promozioni applicate:"}
              </Heading>

              {promotions.map((promotion) => {
                // Skip if promotion was deleted from DB but still referenced in cart
                if (!promotion) return null

                return (
                  <div
                    key={promotion.id}
                    className="flex items-center justify-between w-full max-w-full mb-2"
                    data-testid="discount-row"
                  >
                    <Text className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                      <span className="truncate" data-testid="discount-code">
                        <Badge
                          color={promotion.is_automatic ? "green" : "grey"}
                          className="rounded-none border border-black px-2 py-1 text-black mr-1"
                          size="small"
                        >
                          {promotion.code}
                        </Badge>{" "}
                        (
                        {promotion.application_method?.value !== undefined &&
                          promotion.application_method.currency_code !==
                            undefined && (
                            <>
                              {promotion.application_method.type ===
                              "percentage"
                                ? `${promotion.application_method.value}%`
                                : convertToLocale({
                                    amount: Number(
                                      promotion.application_method.value
                                    ),
                                    currency_code:
                                      promotion.application_method
                                        .currency_code,
                                  })}
                            </>
                          )}
                        )
                        {/* {promotion.is_automatic && (
                          <Tooltip content="This promotion is automatically applied">
                            <InformationCircleSolid className="inline text-zinc-400" />
                          </Tooltip>
                        )} */}
                      </span>
                    </Text>
                    {!promotion.is_automatic && (
                      <button
                        className="flex items-center"
                        onClick={() => {
                          if (!promotion.code) {
                            return
                          }

                          removePromotionCode(promotion.code)
                        }}
                        data-testid="remove-discount-button"
                      >
                        <Trash size={14} />
                        <span className="sr-only">
                          Remove discount code from order
                        </span>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscountCode
