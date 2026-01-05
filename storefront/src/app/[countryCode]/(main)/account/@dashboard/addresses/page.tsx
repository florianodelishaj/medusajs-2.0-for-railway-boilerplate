import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { headers } from "next/headers"
import { getRegion } from "@lib/data/regions"
import { getCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Indirizzi",
  description: "Visualizza i tuoi indirizzi",
}

export default async function Addresses({
  params,
}: {
  params: { countryCode: string }
}) {
  const { countryCode } = params
  const customer = await getCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl font-bold">Indirizzi</h1>
        <p className="text-base text-gray-700">
          Visualizza e aggiorna i tuoi indirizzi di spedizione e fatturazione.
          Puoi aggiungerne quanti ne vuoi e contrassegnare uno di essi come
          indirizzo di fatturazione predefinito. Salvando i tuoi indirizzi li
          renderai disponibili durante il checkout.
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
