"use client"

import { useState } from "react"
import { toast } from "sonner"
import { deleteCustomerAddress as deleteCustomerAddressAction } from "@lib/data/customer"

/**
 * Hook for deleting customer address with automatic error handling
 */
export function useDeleteCustomerAddress() {
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteAddress = async (addressId: string) => {
    setIsDeleting(true)
    try {
      await deleteCustomerAddressAction(addressId)
    } catch (error: any) {
      const errorMessage =
        error?.message || "Impossibile eliminare l'indirizzo"
      toast.error(errorMessage)
      throw error
    } finally {
      setIsDeleting(false)
    }
  }

  return { deleteAddress, isDeleting }
}
