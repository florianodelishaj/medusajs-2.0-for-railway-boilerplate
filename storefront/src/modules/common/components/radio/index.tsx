import { cn } from "@lib/util/cn"

const Radio = ({ checked, 'data-testid': dataTestId }: { checked: boolean, 'data-testid'?: string }) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      className="group relative flex size-5 items-center justify-center outline-none"
      data-testid={dataTestId || 'radio-button'}
    >
      <div
        className={cn(
          "flex size-5 items-center justify-center rounded-full border-2 border-black bg-white transition-all",
          checked && "bg-green-400"
        )}
      >
        {checked && (
          <div className="size-2 rounded-full bg-black" />
        )}
      </div>
    </button>
  )
}

export default Radio
