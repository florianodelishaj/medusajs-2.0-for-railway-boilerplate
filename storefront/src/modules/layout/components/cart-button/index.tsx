"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import CartDropdown from "../cart-dropdown"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { fetchCartData } from "./actions"

export default function CartButton() {
  const [cart, setCart] = useState<Awaited<ReturnType<typeof fetchCartData>>>(undefined as any)
  const [loaded, setLoaded] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    fetchCartData().then((data) => {
      setCart(data)
      setLoaded(true)
    })
  }, [pathname])

  if (!loaded) {
    return (
      <LocalizedClientLink
        className="flex items-center h-full px-12 py-2 border-l border-black bg-black text-white hover:bg-green-400 hover:border-green-400 hover:text-black transition-colors duration-200 font-semibold gap-2"
        href="/cart"
        data-testid="nav-cart-link"
      >
        Carrello (0)
      </LocalizedClientLink>
    )
  }

  return <CartDropdown cart={cart} />
}
