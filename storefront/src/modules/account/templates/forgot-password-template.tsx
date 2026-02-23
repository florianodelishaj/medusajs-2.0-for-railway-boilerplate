"use client"

import { useEffect } from "react"
import { useFormState } from "react-dom"
import { forgotPassword } from "@lib/data/customer"
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

const ForgotPasswordTemplate = () => {
  const [state, formAction] = useFormState(forgotPassword, {
    success: false,
    error: null,
  })

  useEffect(() => {
    if (state.success) {
      toast.success(
        "Se l'email è registrata, riceverai un link per reimpostare la password."
      )
    }
  }, [state.success])

  useEffect(() => {
    if (state.error) {
      toast.error(state.error)
    }
  }, [state.error])

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
                src={`https://${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}/medusa-media/logo.png`}
                alt="Logo"
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
            <h1 className="text-4xl font-medium mb-2">Password dimenticata</h1>
            <p className="text-gray-600 mb-8">
              Inserisci la tua email e ti invieremo un link per reimpostare la
              password.
            </p>

            {state.success ? (
              <div className="bg-green-400 border border-black p-4 rounded-md mb-4">
                <p className="font-medium">
                  Se l&apos;email è registrata, riceverai un link per
                  reimpostare la password. Controlla anche la cartella spam.
                </p>
              </div>
            ) : (
              <form action={formAction} className="flex flex-col gap-6">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  data-testid="forgot-email-input"
                />

                {state.error && (
                  <div className="bg-red-500 text-white border border-black p-4 rounded-md">
                    <p>{state.error}</p>
                  </div>
                )}
                <LocalizedClientLink
                  href="/account"
                  className="text-base font-medium underline underline-offset-4 hover:text-green-600 transition-colors"
                >
                  Torna all&apos;accesso
                </LocalizedClientLink>
                <Button
                  variant="elevated"
                  type="submit"
                  className="w-full h-12 bg-black text-white hover:text-black hover:bg-green-400"
                  data-testid="forgot-submit-button"
                >
                  Invia link di reset
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Right - Background section */}
      <div className="hidden xl:block xl:w-2/5 relative overflow-hidden">
        <Image
          src={`https://${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}/medusa-media/login.jpg`}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}

export default ForgotPasswordTemplate
