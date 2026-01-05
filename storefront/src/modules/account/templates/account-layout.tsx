import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  // For login page (no customer), render without container constraints
  if (!customer) {
    return (
      <div className="flex-1" data-testid="account-page">
        {children}
      </div>
    )
  }

  // For logged-in customer, use the regular layout with sidebar
  return (
    <div
      className="flex-1 content-container h-full flex flex-col bg-[#F4F4F0]"
      data-testid="account-page"
    >
      <div className="grid grid-cols-1 small:grid-cols-[280px_1fr] gap-8">
        <div>{customer && <AccountNav />}</div>
        <div className="flex-1">{children}</div>
      </div>
      {/* <div className="flex flex-col small:flex-row items-end justify-between small:border-t border-black py-12 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">Hai domande?</h3>
          <span className="text-base text-gray-700">
            Puoi trovare le domande frequenti e le risposte nella nostra pagina
            di assistenza clienti.
          </span>
        </div>
        <div>
          <UnderlineLink href="/customer-service">
            Assistenza Clienti
          </UnderlineLink>
        </div>
      </div> */}
    </div>
  )
}

export default AccountLayout
