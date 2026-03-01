"use client"

import React, { useEffect, useState } from "react"
import { PencilSquare as Edit, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"

import useToggleState from "@lib/hooks/use-toggle-state"
import CountrySelect from "@modules/checkout/components/country-select"
import Input from "@modules/common/components/input"
import Checkbox from "@modules/common/components/checkbox"
import Modal from "@modules/common/components/modal"
import Spinner from "@modules/common/icons/spinner"
import { useFormState } from "react-dom"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { HttpTypes } from "@medusajs/types"
import { updateCustomerAddress } from "@lib/data/customer"
import { useDeleteCustomerAddress } from "@lib/hooks/use-customer-actions"
import { Button } from "@components/ui/button"

type EditAddressProps = {
  region: HttpTypes.StoreRegion
  address: HttpTypes.StoreCustomerAddress
  isActive?: boolean
}

const EditAddress: React.FC<EditAddressProps> = ({
  region,
  address,
  isActive = false,
}) => {
  const [successState, setSuccessState] = useState(false)
  const [isBillingAddress, setIsBillingAddress] = useState(
    address.is_default_billing || false
  )
  const { state, open, close: closeModal } = useToggleState(false)
  const {
    state: deleteModalState,
    open: openDeleteModal,
    close: closeDeleteModal,
  } = useToggleState(false)
  const { deleteAddress, isDeleting } = useDeleteCustomerAddress()

  const [formState, formAction] = useFormState(updateCustomerAddress, {
    addressId: address.id,
  } as any)

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  // Reset billing address state when modal opens
  useEffect(() => {
    if (state) {
      setIsBillingAddress(address.is_default_billing || false)
    }
  }, [state, address.is_default_billing])

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

  const confirmRemoveAddress = async () => {
    try {
      await deleteAddress(address.id)
      closeDeleteModal()
    } catch (error) {
      // Error toast is already handled by useDeleteCustomerAddress hook
    }
  }

  return (
    <>
      <div
        className={clx(
          "rounded-md overflow-hidden min-h-[220px] h-full w-full flex flex-col bg-white",
          isActive
            ? "border-2 border-green-400"
            : "border border-black"
        )}
        data-testid="address-container"
      >
        {/* Green header */}
        <div className="bg-green-400 border-b-2 border-black px-4 py-2.5 flex items-center justify-between">
          <h3 className="text-sm font-black uppercase" data-testid="address-name">
            {address.address_name || "Indirizzo"}
          </h3>
          {address.is_default_billing && (
            <span
              className="text-xs font-bold px-2 py-0.5 bg-black text-white rounded"
              data-testid="billing-badge"
            >
              Fatturazione
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 justify-between p-4">
          <div className="flex flex-col">
            <p className="text-sm font-bold">
              {address.first_name} {address.last_name}
            </p>
            {address.company && (
              <p className="text-sm text-black/60" data-testid="address-company">
                {address.company}
              </p>
            )}
            <p className="flex flex-col text-left text-sm mt-2 text-black/70">
              <span data-testid="address-address">
                {address.address_1}
                {address.address_2 && <span>, {address.address_2}</span>}
              </span>
              <span data-testid="address-postal-city">
                {address.postal_code}, {address.city}
              </span>
              <span data-testid="address-province-country">
                {address.province && `${address.province}, `}
                {address.country_code?.toUpperCase()}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-x-4 mt-4 pt-3 border-t border-black/10">
            <button
              className="text-sm text-black/50 hover:text-black flex items-center gap-x-1.5 transition-colors"
              onClick={open}
              data-testid="address-edit-button"
            >
              <Edit />
              Modifica
            </button>
            <button
              className="text-sm text-black/50 hover:text-red-600 flex items-center gap-x-1.5 transition-colors"
              onClick={openDeleteModal}
              data-testid="address-delete-button"
              disabled={isDeleting}
            >
              {isDeleting ? <Spinner /> : <Trash />}
              Rimuovi
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={state} close={close} data-testid="edit-address-modal">
        <Modal.Title>
          <h2 className="text-xl font-black uppercase mb-4 border-l-4 border-green-400 pl-2">
            Modifica indirizzo
          </h2>
        </Modal.Title>
        <form action={formAction} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <Modal.Body>
            <div className="grid grid-cols-1 gap-y-2">
              <Input
                label="Nome indirizzo (es. Casa, Ufficio, ecc.)"
                name="address_name"
                autoComplete="off"
                defaultValue={address.address_name || undefined}
                data-testid="address-name-input"
              />
              <div className="grid grid-cols-2 gap-x-2">
                <Input
                  label="Nome"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  defaultValue={address.first_name || undefined}
                  data-testid="first-name-input"
                />
                <Input
                  label="Cognome"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  defaultValue={address.last_name || undefined}
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label="Azienda"
                name="company"
                autoComplete="organization"
                defaultValue={address.company || undefined}
                data-testid="company-input"
              />
              <Input
                label="Indirizzo"
                name="address_1"
                required
                autoComplete="address-line1"
                defaultValue={address.address_1 || undefined}
                data-testid="address-1-input"
              />
              <Input
                label="Appartamento, piano, ecc."
                name="address_2"
                autoComplete="address-line2"
                defaultValue={address.address_2 || undefined}
                data-testid="address-2-input"
              />
              <div className="grid grid-cols-[144px_1fr] gap-x-2">
                <Input
                  label="CAP"
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  defaultValue={address.postal_code || undefined}
                  data-testid="postal-code-input"
                />
                <Input
                  label="Città"
                  name="city"
                  required
                  autoComplete="locality"
                  defaultValue={address.city || undefined}
                  data-testid="city-input"
                />
              </div>
              <Input
                label="Provincia"
                name="province"
                required
                autoComplete="address-level1"
                defaultValue={address.province || undefined}
                data-testid="state-input"
              />
              <CountrySelect
                name="country_code"
                region={region}
                required
                autoComplete="country"
                value={address.country_code || undefined}
                data-testid="country-select"
              />
              <Input
                label="Telefono"
                name="phone"
                autoComplete="phone"
                defaultValue={address.phone || undefined}
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
              <div className="text-rose-500 text-small-regular py-2">
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

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModalState}
        close={closeDeleteModal}
        data-testid="delete-address-modal"
      >
        <Modal.Title>
          <h2 className="text-xl font-black uppercase mb-6 text-center border-b-2 border-red-500 pb-3">
            Conferma eliminazione
          </h2>
        </Modal.Title>
        <Modal.Body>
          <div className="flex flex-col gap-6 text-center">
            <p className="text-base">
              Sei sicuro di voler eliminare questo indirizzo?
            </p>

            {address.address_name && (
              <div className="px-4 py-3 bg-[#F4F4F0] rounded-md border border-black">
                <p className="font-semibold text-lg">
                  {address.address_name}
                </p>
              </div>
            )}

            <p className="text-sm text-black/50 italic">
              Questa azione non può essere annullata.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex gap-3 mt-6 justify-end">
            <Button
              type="button"
              variant="elevated"
              onClick={closeDeleteModal}
              className="hover:bg-green-400"
              data-testid="cancel-delete-button"
              disabled={isDeleting}
            >
              Annulla
            </Button>
            <Button
              type="button"
              variant="elevated"
              onClick={confirmRemoveAddress}
              className="bg-red-600 text-white hover:bg-red-700"
              data-testid="confirm-delete-button"
              disabled={isDeleting}
            >
              {isDeleting ? <Spinner /> : "Elimina"}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default EditAddress
