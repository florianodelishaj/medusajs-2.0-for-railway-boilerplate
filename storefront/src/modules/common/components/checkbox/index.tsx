import React from "react"
import { Check } from "lucide-react"
import { cn } from "@lib/util/cn"

type CheckboxProps = {
  checked?: boolean
  onChange?: () => void
  label: string
  name?: string
  "data-testid"?: string
}

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
  checked = true,
  onChange,
  label,
  name,
  "data-testid": dataTestId,
}) => {
  const id = React.useId()

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        data-testid={dataTestId}
        className="sr-only peer"
      />
      <label
        htmlFor={id}
        className={cn(
          "!m-0 !p-0 !translate-y-0 size-5 border border-black rounded bg-white cursor-pointer transition-all flex items-center justify-center flex-shrink-0 hover:bg-pink-400 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]",
          checked && "bg-pink-400"
        )}
      >
        <Check
          className={cn(
            "size-full p-0.5 text-black opacity-0 transition-opacity",
            checked && "opacity-100"
          )}
          strokeWidth={3}
        />
      </label>
      <label
        htmlFor={id}
        className="!translate-y-0 !text-sm font-medium cursor-pointer select-none leading-tight"
      >
        {label}
      </label>
    </div>
  )
}

export default CheckboxWithLabel
