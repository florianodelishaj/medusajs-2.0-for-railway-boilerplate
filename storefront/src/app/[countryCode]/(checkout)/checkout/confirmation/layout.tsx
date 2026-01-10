"use client"

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

export default function ConfirmationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!stripePromise) {
    return <div className="flex-1 flex flex-col">{children}</div>
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="content-container py-12 bg-[#F4F4F0] flex-1 flex flex-col">
        {children}
      </div>
    </Elements>
  )
}
