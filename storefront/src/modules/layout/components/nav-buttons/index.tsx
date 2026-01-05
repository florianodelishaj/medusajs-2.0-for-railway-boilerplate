"use client"

import { Button } from "@components/ui/button"
import { cn } from "@lib/util/cn"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname } from "next/navigation"

interface NavRoute {
  href: string
  label: string
}

interface NavButtonsProps {
  routes: NavRoute[]
}

export const NavButtons = ({ routes }: NavButtonsProps) => {
  const pathname = usePathname()

  // Remove country code from pathname to get clean path
  const cleanPath = pathname?.split("/").slice(2).join("/") || ""

  const isRouteActive = (href: string) => {
    const routePath = href.replace(/^\//, "")
    // Home route (/) should only be active on the home page
    if (routePath === "") {
      return cleanPath === ""
    }
    return cleanPath === routePath
  }

  return (
    <div className="items-center gap-4 hidden xl:flex">
      {routes.map((route) => (
        <Button
          key={route.href}
          asChild
          className={cn(
            "h-11 px-4 border border-transparent rounded-full text-xl hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]",
            isRouteActive(route.href)
              ? "bg-black text-white hover:bg-green-400 hover:text-black hover:border-black"
              : "bg-transparent hover:bg-white hover:border-black text-black"
          )}
        >
          <LocalizedClientLink href={route.href}>
            {route.label}
          </LocalizedClientLink>
        </Button>
      ))}
    </div>
  )
}
