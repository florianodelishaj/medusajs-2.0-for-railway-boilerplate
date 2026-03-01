"use client"

import { Menu } from "lucide-react"
import { useState } from "react"
import { NavMenuSidebar } from "../nav-menu-sidebar"
import { HttpTypes } from "@medusajs/types"

interface Props {
  categories: HttpTypes.StoreProductCategory[]
}

export const NavMenuButton = ({ categories }: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 hover:bg-green-400 rounded-md transition-colors"
        aria-label="Open menu"
      >
        <Menu className="size-6" />
      </button>
      <NavMenuSidebar open={open} onOpenChange={setOpen} categories={categories} />
    </>
  )
}
