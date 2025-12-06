"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@components/ui/sheet"
import { ScrollArea } from "@components/ui/scroll-area"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { NAV_ROUTES } from "@lib/constants/nav-routes"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const NavMenuSidebar = ({ open, onOpenChange }: Props) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 bg-white flex flex-col">
        <SheetHeader className="p-4 border-b border-black">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          {NAV_ROUTES.map((item) => (
            <LocalizedClientLink
              key={item.href}
              href={item.href}
              onClick={() => onOpenChange(false)}
              className="w-full text-left p-4 hover:bg-black hover:text-white font-medium cursor-pointer border-b border-black/10 transition-colors block"
            >
              {item.label}
            </LocalizedClientLink>
          ))}
        </ScrollArea>

        {/* Account and Cart fixed at bottom */}
        <div className="border-t border-black">
          <LocalizedClientLink
            href="/account"
            onClick={() => onOpenChange(false)}
            className="w-full text-left p-4 hover:bg-rose-400 text-black font-medium cursor-pointer border-b border-black/10 transition-colors block"
          >
            Account
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/cart"
            onClick={() => onOpenChange(false)}
            className="w-full text-left p-4 bg-black text-white hover:bg-rose-400 hover:text-black font-medium cursor-pointer transition-colors block"
          >
            Cart
          </LocalizedClientLink>
        </div>
      </SheetContent>
    </Sheet>
  )
}
