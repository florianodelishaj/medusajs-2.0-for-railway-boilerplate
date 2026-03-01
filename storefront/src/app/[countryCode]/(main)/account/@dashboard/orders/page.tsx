import { Metadata } from "next"
import { HttpTypes } from "@medusajs/types"

import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"
import { enrichLineItems } from "@lib/data/cart"

export const metadata: Metadata = {
  title: { absolute: "Ordini | Il Covo di Xur" },
  description: "Panoramica dei tuoi ordini precedenti.",
  robots: { index: false },
}

export default async function Orders() {
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  const enrichedOrders = (await Promise.all(
    orders.map(async (order) => ({
      ...order,
      items: await enrichLineItems(order.items, order.region_id!),
    }))
  )) as unknown as HttpTypes.StoreOrder[]

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl font-black uppercase border-l-4 border-green-400 pl-2">
          Ordini
        </h1>
        <p className="text-base text-black/50">
          Visualizza i tuoi ordini precedenti e il loro stato. Puoi anche creare
          resi o cambi per i tuoi ordini se necessario.
        </p>
      </div>
      <div>
        <OrderOverview orders={enrichedOrders} />
      </div>
    </div>
  )
}
