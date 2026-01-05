import { Metadata } from "next"

import ProfilePhone from "@modules/account//components/profile-phone"
import ProfileName from "@modules/account/components/profile-name"
import ProfilePassword from "@modules/account/components/profile-password"

import { notFound } from "next/navigation"
import { getCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Profilo",
  description: "Visualizza e modifica il tuo profilo.",
}

export default async function Profile() {
  const customer = await getCustomer()

  if (!customer) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="profile-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl font-bold">Profilo</h1>
        <p className="text-base text-gray-700">
          Visualizza e aggiorna le informazioni del tuo profilo, inclusi nome
          e numero di telefono. Puoi anche cambiare la password.
        </p>
      </div>
      <div className="flex flex-col gap-y-8 mb-8 w-full">
        <ProfileName customer={customer} />
        {/* <Divider /> */}
        <ProfilePhone customer={customer} />
        {/* <Divider /> */}
        <ProfilePassword />
      </div>
    </div>
  )
}

const Divider = () => {
  return <div className="w-full h-px bg-black" />
}
