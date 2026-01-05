"use client"

import { clx } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signout } from "@lib/data/customer"

const AccountNav = () => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <div
      className="w-full bg-white border border-black rounded-md p-6"
      data-testid="account-nav"
    >
      <div>
        <div className="pb-6 border-b border-black">
          <h3 className="text-xl font-bold">Account</h3>
        </div>
        <div className="text-base pt-6">
          <ul className="flex mb-0 justify-start items-start flex-col gap-y-4">
            <li>
              <AccountNavLink
                href="/account"
                route={route!}
                data-testid="overview-link"
              >
                Panoramica
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink
                href="/account/profile"
                route={route!}
                data-testid="profile-link"
              >
                Profilo
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink
                href="/account/addresses"
                route={route!}
                data-testid="addresses-link"
              >
                Indirizzi
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink
                href="/account/orders"
                route={route!}
                data-testid="orders-link"
              >
                Ordini
              </AccountNavLink>
            </li>
            <li className="text-gray-700">
              <button
                type="button"
                onClick={handleLogout}
                data-testid="logout-button"
                className="hover:text-green-600 transition-colors font-medium"
              >
                Esci
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href
  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "text-gray-700 hover:text-green-600 transition-colors font-medium",
        {
          "text-green-600 font-bold": active,
        }
      )}
      data-testid={dataTestId}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
