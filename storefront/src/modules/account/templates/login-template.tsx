"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Poppins } from "next/font/google"
import { cn } from "@lib/util/cn"
import Image from "next/image"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
})

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="min-h-screen flex flex-col xl:flex-row">
      {/* Left - Form section */}
      <div className="w-full xl:w-3/5 bg-[#F4F4F0] overflow-y-auto">
        <div className="flex flex-col gap-8 p-4 xl:p-16 w-full">
          {/* Header */}
          <div className="flex items-center justify-between w-full mb-8">
            <LocalizedClientLink href="/">
              <span
                className={cn(
                  "text-2xl font-bold uppercase",
                  poppins.className
                )}
              >
                il covo di xur
              </span>
            </LocalizedClientLink>
            <button
              onClick={() =>
                setCurrentView(
                  currentView === "sign-in"
                    ? LOGIN_VIEW.REGISTER
                    : LOGIN_VIEW.SIGN_IN
                )
              }
              className="text-base font-medium underline underline-offset-4 hover:text-green-600 transition-colors"
            >
              {currentView === "sign-in" ? "Registrati" : "Accedi"}
            </button>
          </div>

          {/* Form content */}
          <div className="w-full">
            {currentView === "sign-in" ? (
              <Login setCurrentView={setCurrentView} />
            ) : (
              <Register setCurrentView={setCurrentView} />
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

export default LoginTemplate
