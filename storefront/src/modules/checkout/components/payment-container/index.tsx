import { RadioGroup } from "@headlessui/react"
import { Text, clx } from "@medusajs/ui"
import React from "react"

import Radio from "@modules/common/components/radio"

import PaymentTest from "../payment-test"
import { isManual } from "@lib/constants"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <RadioGroup.Option
      key={paymentProviderId}
      value={paymentProviderId}
      disabled={disabled}
      className={clx(
        "flex flex-col gap-y-2 cursor-pointer py-4 px-6 mb-3 border border-black rounded-md bg-white transition-all hover:bg-pink-400 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        {
          "bg-pink-400": selectedPaymentOptionId === paymentProviderId,
        }
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Radio checked={selectedPaymentOptionId === paymentProviderId} />
          <Text className="text-sm font-medium">
            {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
          </Text>
          {isManual(paymentProviderId) && isDevelopment && (
            <PaymentTest className="hidden small:block" />
          )}
        </div>
        <span className="justify-self-end text-black">
          {paymentInfoMap[paymentProviderId]?.icon}
        </span>
      </div>
      {isManual(paymentProviderId) && isDevelopment && (
        <PaymentTest className="small:hidden text-[10px]" />
      )}
    </RadioGroup.Option>
  )
}

export default PaymentContainer
