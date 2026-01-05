"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useFormState } from "react-dom"
import { resetPassword } from "@lib/data/customer"
import Input from "@modules/common/components/input"
import { Button } from "@components/ui/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Poppins } from "next/font/google"
import { cn } from "@lib/util/cn"
import Image from "next/image"
import { toast } from "sonner"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
})

const ResetPasswordTemplate = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [state, formAction] = useFormState(resetPassword, {
    success: false,
    error: null,
  })

  useEffect(() => {
    if (state.success) {
      toast.success("Password reimpostata con successo! Verrai reindirizzato alla pagina di accesso...")
      setTimeout(() => {
        router.push("/account")
      }, 2000)
    }
  }, [state.success, router])

  useEffect(() => {
    if (state.error) {
      toast.error(state.error)
    }
  }, [state.error])

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F4F0]">
        <div className="bg-white border border-black rounded-md p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Link non valido</h1>
          <p className="mb-4">
            Il link per reimpostare la password non è valido o è scaduto.
          </p>
          <LocalizedClientLink href="/account">
            <Button variant="elevated" className="w-full hover:bg-green-400">
              Torna all&apos;account
            </Button>
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col xl:flex-row">
      {/* Left - Form section */}
      <div className="w-full xl:w-3/5 bg-[#F4F4F0] overflow-y-auto">
        <div className="flex flex-col gap-8 p-4 xl:p-16 w-full">
          {/* Header */}
          <div className="flex items-center justify-between w-full mb-8">
            <LocalizedClientLink
              href="/"
              className={cn(
                "flex justify-center items-center gap-4 text-2xl font-bold uppercase",
                poppins.className
              )}
            >
              <Image
                src="/images/logo.png"
                alt="Anime illustration"
                width={50}
                height={50}
              />
              IL COVO DI XUR
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/account"
              className="text-base font-medium underline underline-offset-4 hover:text-green-600 transition-colors"
            >
              Accedi
            </LocalizedClientLink>
          </div>

          {/* Form content */}
          <div className="w-full">
            <h1 className="text-4xl font-medium mb-2">Reimposta Password</h1>
            <p className="text-gray-600 mb-8">
              Inserisci la tua nuova password
            </p>

            {state.success ? (
              <div className="bg-green-400 border border-black p-4 rounded-md mb-4">
                <p className="font-medium">
                  Password reimpostata con successo! Verrai reindirizzato alla
                  pagina di accesso...
                </p>
              </div>
            ) : (
              <form action={formAction} className="flex flex-col gap-6">
                <input type="hidden" name="token" value={token} />
                <input type="hidden" name="email" value={email} />

                <Input
                  label="Nuova password"
                  name="new_password"
                  type="password"
                  required
                  autoComplete="new-password"
                  data-testid="new-password-input"
                />
                <Input
                  label="Conferma password"
                  name="confirm_password"
                  type="password"
                  required
                  autoComplete="new-password"
                  data-testid="confirm-password-input"
                />

                {state.error && (
                  <div className="bg-red-500 text-white border border-black p-4 rounded-md">
                    <p>{state.error}</p>
                  </div>
                )}

                <Button
                  variant="elevated"
                  type="submit"
                  className="w-full h-12 bg-black text-white hover:text-black hover:bg-green-400"
                  data-testid="reset-button"
                >
                  Reimposta password
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Right - Background section */}
      <div className="hidden xl:block xl:w-2/5 relative overflow-hidden">
        <Image
          src="/images/anime-8337660_1280.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}

export default ResetPasswordTemplate
