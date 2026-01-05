"use client"

import { Plus } from "@medusajs/icons"
import { Heading } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useFormState } from "react-dom"

import useToggleState from "@lib/hooks/use-toggle-state"
import CountrySelect from "@modules/checkout/components/country-select"
import Input from "@modules/common/components/input"
import Checkbox from "@modules/common/components/checkbox"
import Modal from "@modules/common/components/modal"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { HttpTypes } from "@medusajs/types"
import { addCustomerAddress } from "@lib/data/customer"
import { Button } from "@components/ui/button"

const AddAddress = ({ region }: { region: HttpTypes.StoreRegion }) => {
  const [successState, setSuccessState] = useState(false)
  const [isBillingAddress, setIsBillingAddress] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useFormState(addCustomerAddress, {} as any)

  const close = () => {
    setSuccessState(false)
    setIsBillingAddress(false) // Reset checkbox when closing
    closeModal()
  }

  useEffect(() => {
    if (successState) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  return (
    <>
      <Button
        variant="elevated"
        className="p-5 min-h-[220px] h-full w-full flex flex-col justify-between hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-green-400"
        onClick={open}
        data-testid="add-address-button"
      >
        <span className="text-base-semi self-center">Nuovo indirizzo</span>
        <Plus className="self-start" />
      </Button>

      <Modal isOpen={state} close={close} data-testid="add-address-modal">
        <Modal.Title>
          <Heading className="mb-4">Aggiungi indirizzo</Heading>
        </Modal.Title>
        <form action={formAction}>
          <Modal.Body>
            <div className="flex flex-col gap-y-2">
              <Input
                label="Nome indirizzo (es. Casa, Ufficio, ecc.)"
                name="address_name"
                autoComplete="off"
                data-testid="address-name-input"
              />
              <div className="grid grid-cols-2 gap-x-2">
                <Input
                  label="Nome"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  data-testid="first-name-input"
                />
                <Input
                  label="Cognome"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label="Azienda"
                name="company"
                autoComplete="organization"
                data-testid="company-input"
              />
              <Input
                label="Indirizzo"
                name="address_1"
                required
                autoComplete="address-line1"
                data-testid="address-1-input"
              />
              <Input
                label="Appartamento, piano, ecc."
                name="address_2"
                autoComplete="address-line2"
                data-testid="address-2-input"
              />
              <div className="grid grid-cols-[144px_1fr] gap-x-2">
                <Input
                  label="CAP"
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  data-testid="postal-code-input"
                />
                <Input
                  label="Città"
                  name="city"
                  required
                  autoComplete="locality"
                  data-testid="city-input"
                />
              </div>
              <Input
                label="Provincia"
                name="province"
                required
                autoComplete="address-level1"
                data-testid="state-input"
              />
              <CountrySelect
                region={region}
                name="country_code"
                required
                autoComplete="country"
                data-testid="country-select"
              />
              <Input
                label="Telefono"
                name="phone"
                autoComplete="phone"
                data-testid="phone-input"
              />
              <div>
                <Checkbox
                  label="Imposta come indirizzo di fatturazione predefinito"
                  checked={isBillingAddress}
                  onChange={() => setIsBillingAddress(!isBillingAddress)}
                  data-testid="billing-checkbox"
                />
                {/* Hidden input to send value in form */}
                <input
                  type="hidden"
                  name="is_default_billing"
                  value={isBillingAddress ? "on" : "off"}
                />
              </div>
            </div>
            {formState.error && (
              <div
                className="text-rose-500 text-small-regular py-2"
                data-testid="address-error"
              >
                {formState.error}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="flex gap-3 mt-6">
              <Button
                type="reset"
                variant="elevated"
                onClick={close}
                className="hover:bg-green-400"
                data-testid="cancel-button"
              >
                Annulla
              </Button>
              <SubmitButton
                data-testid="save-button"
                className="bg-black text-white hover:text-black hover:bg-green-400"
              >
                Salva
              </SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default AddAddress
