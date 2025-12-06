"use client"

import { Menu } from "lucide-react"
import { useState } from "react"
import { NavMenuSidebar } from "../nav-menu-sidebar"

export const NavMenuButton = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        aria-label="Open menu"
      >
        <Menu className="size-6" />
      </button>
      <NavMenuSidebar open={open} onOpenChange={setOpen} />
    </>
  )
}
