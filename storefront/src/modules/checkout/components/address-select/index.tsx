import { Listbox, Transition } from "@headlessui/react"
import { clx } from "@medusajs/ui"
import { Fragment, useMemo } from "react"
import { Check } from "lucide-react"

import compareAddresses from "@lib/util/compare-addresses"
import { HttpTypes } from "@medusajs/types"

type AddressSelectProps = {
  addresses: HttpTypes.StoreCustomerAddress[]
  addressInput: HttpTypes.StoreCartAddress | null
  onSelect: (
    address: HttpTypes.StoreCartAddress | undefined,
    email?: string
  ) => void
}

const AddressSelect = ({
  addresses,
  addressInput,
  onSelect,
}: AddressSelectProps) => {
  const handleSelect = (id: string) => {
    const savedAddress = addresses.find((a) => a.id === id)
    if (savedAddress) {
      onSelect(savedAddress as HttpTypes.StoreCartAddress)
    }
  }

  const selectedAddress = useMemo(() => {
    return addresses.find((a) => compareAddresses(a, addressInput))
  }, [addresses, addressInput])

  return (
    <Listbox onChange={handleSelect} value={selectedAddress?.id}>
      <div className="relative">
        <Listbox.Button
          className="relative w-full flex justify-between items-center px-4 h-12 text-left bg-white cursor-pointer focus:outline-none border border-black rounded-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-400 transition-all font-medium"
          data-testid="shipping-address-select"
        >
          <span className="block truncate text-sm">
            {selectedAddress
              ? selectedAddress.address_1
              : "Scegli un indirizzo"}
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className="absolute z-20 w-full mt-1 overflow-auto bg-white border border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-60 focus:outline-none"
            data-testid="shipping-address-options"
          >
            {addresses.map((address) => {
              const isSelected = selectedAddress?.id === address.id
              return (
                <Listbox.Option
                  key={address.id}
                  value={address.id}
                  className="cursor-pointer select-none relative px-4 py-3 hover:bg-green-400 transition-colors"
                  data-testid="shipping-address-option"
                >
                  <div className="flex gap-x-3 items-start">
                    <div className="mt-0.5 flex-shrink-0">
                      {isSelected && <Check className="h-4 w-4" strokeWidth={3} />}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-left text-sm font-semibold">
                        {address.first_name} {address.last_name}
                      </span>
                      {address.company && (
                        <span className="text-xs text-gray-600">
                          {address.company}
                        </span>
                      )}
                      <div className="flex flex-col text-left text-xs mt-1">
                        <span>
                          {address.address_1}
                          {address.address_2 && (
                            <span>, {address.address_2}</span>
                          )}
                        </span>
                        <span>
                          {address.postal_code}, {address.city}
                        </span>
                        <span>
                          {address.province && `${address.province}, `}
                          {address.country_code?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Listbox.Option>
              )
            })}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

export default AddressSelect
