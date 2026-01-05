"use client"

import React, { useEffect, useMemo } from "react"

import Input from "@modules/common/components/input"
import CountrySelect from "@modules/checkout/components/country-select"

import AccountInfo from "../account-info"
import { useFormState } from "react-dom"
import { HttpTypes } from "@medusajs/types"
import { updateCustomerAddress } from "@lib/data/customer"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
  regions: HttpTypes.StoreRegion[]
}

const ProfileBillingAddress: React.FC<MyInformationProps> = ({
  customer,
  regions,
}) => {
  // Create a merged region with all countries from all regions
  const mergedRegion = useMemo(() => {
    const allCountries = regions
      ?.map((region) => region.countries || [])
      .flat()
      .filter((country, index, self) =>
        index === self.findIndex((c) => c.iso_2 === country.iso_2)
      ) || []

    return {
      countries: allCountries,
    } as HttpTypes.StoreRegion
  }, [regions])

  const regionOptions = useMemo(() => {
    return (
      regions
        ?.map((region) => {
          return region.countries?.map((country) => ({
            value: country.iso_2,
            label: country.display_name,
          }))
        })
        .flat() || []
    )
  }, [regions])

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  const [successState, setSuccessState] = React.useState(false)

  const [state, formAction] = useFormState(updateCustomerAddress, {
    addressId: billingAddress?.id,
  } as any)

  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    console.log('[ProfileBillingAddress] State changed:', state)
    setSuccessState(state?.success === true)
  }, [state])

  const currentInfo = useMemo(() => {
    if (!billingAddress) {
      return "Nessun indirizzo di fatturazione"
    }

    const country =
      regionOptions?.find(
        (country) => country?.value === billingAddress.country_code
      )?.label || billingAddress.country_code?.toUpperCase()

    return (
      <div className="flex flex-col font-semibold" data-testid="current-info">
        <span>
          {billingAddress.first_name} {billingAddress.last_name}
        </span>
        <span>{billingAddress.company}</span>
        <span>
          {billingAddress.address_1}
          {billingAddress.address_2 ? `, ${billingAddress.address_2}` : ""}
        </span>
        <span>
          {billingAddress.postal_code}, {billingAddress.city}
        </span>
        <span>{country}</span>
      </div>
    )
  }, [billingAddress, regionOptions])

  return (
    <form
      action={formAction}
      onReset={() => clearState()}
      onSubmit={(e) => {
        console.log('[ProfileBillingAddress] Form submitted')
      }}
      className="w-full"
    >
      <AccountInfo
        label="Indirizzo di fatturazione"
        currentInfo={currentInfo}
        isSuccess={successState}
        isError={!!state?.error}
        errorMessage={state?.error}
        clearState={clearState}
        data-testid="account-billing-address-editor"
      >
        <div className="grid grid-cols-1 gap-y-2">
          <div className="grid grid-cols-2 gap-x-2">
            <Input
              label="Nome"
              name="first_name"
              defaultValue={billingAddress?.first_name || undefined}
              required
              data-testid="billing-first-name-input"
            />
            <Input
              label="Cognome"
              name="last_name"
              defaultValue={billingAddress?.last_name || undefined}
              required
              data-testid="billing-last-name-input"
            />
          </div>
          <Input
            label="Azienda"
            name="company"
            defaultValue={billingAddress?.company || undefined}
            data-testid="billing-company-input"
          />
          <Input
            label="Indirizzo"
            name="address_1"
            defaultValue={billingAddress?.address_1 || undefined}
            required
            data-testid="billing-address-1-input"
          />
          <Input
            label="Appartamento, piano, ecc."
            name="address_2"
            defaultValue={billingAddress?.address_2 || undefined}
            data-testid="billing-address-2-input"
          />
          <div className="grid grid-cols-[144px_1fr] gap-x-2">
            <Input
              label="CAP"
              name="postal_code"
              defaultValue={billingAddress?.postal_code || undefined}
              required
              data-testid="billing-postcal-code-input"
            />
            <Input
              label="Città"
              name="city"
              defaultValue={billingAddress?.city || undefined}
              required
              data-testid="billing-city-input"
            />
          </div>
          <Input
            label="Provincia"
            name="province"
            defaultValue={billingAddress?.province || undefined}
            data-testid="billing-province-input"
          />
          <CountrySelect
            region={mergedRegion}
            name="country_code"
            value={billingAddress?.country_code || undefined}
            label="Paese"
            required
            data-testid="billing-country-code-select"
          />
          <Input
            label="Telefono"
            name="phone"
            defaultValue={billingAddress?.phone || undefined}
            data-testid="billing-phone-input"
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfileBillingAddress
