import { Button } from "@components/ui/button"
import { HttpTypes } from "@medusajs/types"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = option.values?.map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm font-bold uppercase text-gray-700">
        Seleziona {title}
      </span>
      <div className="flex flex-wrap gap-3" data-testid={dataTestId}>
        {filteredOptions?.map((v) => {
          const isSelected = v === current
          return (
            <Button
              onClick={() => updateOption(option.title ?? "", v ?? "")}
              key={v}
              variant="elevated"
              className={`min-w-[80px] h-10 bg-black text-white hover:bg-green-400 hover:text-black transition-all 
                ${
                  isSelected
                    ? "bg-green-400 border border-black text-black"
                    : "bg-white border border-black text-black hover:bg-green-400 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px]"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                `}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
