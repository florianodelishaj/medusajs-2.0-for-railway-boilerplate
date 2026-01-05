import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"

export const metadata: Metadata = {
  title: "Ordini",
  description: "Panoramica dei tuoi ordini precedenti.",
}

export default async function Orders() {
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl font-bold">Ordini</h1>
        <p className="text-base text-gray-700">
          Visualizza i tuoi ordini precedenti e il loro stato. Puoi anche
          creare resi o cambi per i tuoi ordini se necessario.
        </p>
      </div>
      <div>
        <OrderOverview orders={orders} />
      </div>
    </div>
  )
}
