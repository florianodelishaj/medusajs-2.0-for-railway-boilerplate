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
      className="w-full bg-white border border-black rounded-md overflow-hidden"
      data-testid="account-nav"
    >
      <div>
        <div className="bg-green-400 border-b-2 border-black px-4 py-2.5">
          <h3 className="text-xl font-black uppercase">Account</h3>
        </div>
        <div className="text-base p-6">
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
            <li>
              <button
                type="button"
                onClick={handleLogout}
                data-testid="logout-button"
                className="text-black/50 hover:text-black transition-colors font-medium"
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
        "block text-black/60 hover:text-black transition-colors font-medium",
        {
          "font-black text-black border-l-4 border-green-400 pl-2": active,
        }
      )}
      data-testid={dataTestId}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
