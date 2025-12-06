import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chi Siamo",
  description: "Scopri la nostra storia.",
}

export default async function ChiSiamoPage() {
  return (
    <div className="flex flex-col small:flex-row small:items-start content-container">
      <h1 className="text-4xl font-bold mb-6">Chi Siamo</h1>
    </div>
  )
}
