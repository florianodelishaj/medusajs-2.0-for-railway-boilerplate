"use client"

import { Heading, Text, clx } from "@medusajs/ui"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Button } from "@components/ui/button"
import { useCallback } from "react"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "review"

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleContinueToPayment = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="bg-white border border-black rounded-md p-6">
      <div
        className={clx("flex flex-row items-center justify-between", {
          "mb-6": isOpen,
        })}
      >
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-2xl font-black uppercase gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Riepilogo
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Rivedi il tuo ordine prima di procedere al pagamento.
              </Text>
            </div>
          </div>
          <Button
            variant="elevated"
            size="lg"
            className="w-full bg-black text-white hover:bg-green-400 hover:text-black"
            onClick={handleContinueToPayment}
            data-testid="continue-to-payment-button"
          >
            Continua al pagamento
          </Button>
        </>
      )}
    </div>
  )
}

export default Review
