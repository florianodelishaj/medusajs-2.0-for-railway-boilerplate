"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type ActionResult = {
  success?: boolean
  redirectTo?: string
  error?: string
} | null

/**
 * Hook per gestire i redirect dalle server actions con notifica toast
 */
export function useActionRedirect(result: ActionResult) {
  const router = useRouter()

  useEffect(() => {
    if (result?.redirectTo) {
      toast.info("Il metodo di pagamento deve essere riselezionato a causa della modifica del totale")
      router.push(result.redirectTo)
    }
  }, [result, router])
}
