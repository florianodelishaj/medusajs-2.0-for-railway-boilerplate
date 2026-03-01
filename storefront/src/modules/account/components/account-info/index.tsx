import { Disclosure } from "@headlessui/react"
import { Badge, clx } from "@medusajs/ui"
import { useEffect } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import { useFormStatus } from "react-dom"
import { Button } from "@components/ui/button"
import { toast } from "sonner"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  successMessage?: string
  submitButtonText?: string
  clearState: () => void
  children?: React.ReactNode
  "data-testid"?: string
}

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "Si è verificato un errore, riprova",
  successMessage,
  submitButtonText = "Salva modifiche",
  children,
  "data-testid": dataTestid,
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState()

  const { pending } = useFormStatus()

  const handleToggle = () => {
    clearState()
    setTimeout(() => toggle(), 100)
  }

  useEffect(() => {
    if (isSuccess) {
      close()
      toast.success(successMessage || `${label} aggiornato con successo`)
    }
  }, [isSuccess, close, successMessage, label])

  useEffect(() => {
    if (isError) {
      toast.error(errorMessage)
    }
  }, [isError, errorMessage])

  return (
    <div
      className="text-sm bg-white border border-black rounded-md overflow-hidden"
      data-testid={dataTestid}
    >
      {/* Green header */}
      <div className="bg-green-400 border-b-2 border-black px-4 py-2.5">
        <span className="text-sm font-black uppercase">{label}</span>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            {typeof currentInfo === "string" ? (
              currentInfo ? (
                <span
                  className="font-semibold text-base"
                  data-testid="current-info"
                >
                  {currentInfo}
                </span>
              ) : (
                <span
                  className="text-black/40 text-sm italic"
                  data-testid="current-info"
                >
                  Non impostato
                </span>
              )
            ) : (
              currentInfo
            )}
          </div>
          <Button
            variant="elevated"
            className="hover:bg-green-400"
            onClick={handleToggle}
            type={state ? "reset" : "button"}
            data-testid="edit-button"
            data-active={state}
          >
            {state ? "Annulla" : "Modifica"}
          </Button>
        </div>

        {/* Success state */}
        <Disclosure>
          <Disclosure.Panel
            static
            className={clx(
              "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
              {
                "max-h-[1000px] opacity-100": isSuccess,
                "max-h-0 opacity-0": !isSuccess,
              }
            )}
            data-testid="success-message"
          >
            <Badge
              className="p-2 my-4 bg-green-400 text-black border-black"
              color="green"
            >
              <span>
                {successMessage || `${label} aggiornato con successo`}
              </span>
            </Badge>
          </Disclosure.Panel>
        </Disclosure>

        {/* Error state */}
        <Disclosure>
          <Disclosure.Panel
            static
            className={clx(
              "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
              {
                "max-h-[1000px] opacity-100": isError,
                "max-h-0 opacity-0": !isError,
              }
            )}
            data-testid="error-message"
          >
            <Badge
              className="p-2 my-4 bg-red-500 text-white border-black"
              color="red"
            >
              <span>{errorMessage}</span>
            </Badge>
          </Disclosure.Panel>
        </Disclosure>

        <Disclosure>
          <Disclosure.Panel
            static
            className={clx(
              "transition-[max-height,opacity] duration-300 ease-in-out",
              {
                "max-h-[1000px] opacity-100 overflow-visible": state,
                "max-h-0 opacity-0 overflow-hidden": !state,
              }
            )}
          >
            <div className="flex flex-col gap-y-4 py-4 border-t border-black mt-4">
              <div>{children}</div>
              <div className="flex items-center justify-end mt-2">
                <Button
                  variant="elevated"
                  isLoading={pending}
                  className="bg-black text-white hover:text-black hover:bg-green-400"
                  type="submit"
                  data-testid="save-button"
                >
                  {submitButtonText}
                </Button>
              </div>
            </div>
          </Disclosure.Panel>
        </Disclosure>
      </div>
    </div>
  )
}

export default AccountInfo
