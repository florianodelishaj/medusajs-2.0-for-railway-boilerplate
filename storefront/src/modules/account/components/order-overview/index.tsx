"use client"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@components/ui/button"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-4 w-full mb-8">
        {orders.map((o) => (
          <div key={o.id}>
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-md"
      data-testid="no-orders-container"
    >
      <h2 className="text-2xl font-bold">Nessun ordine trovato</h2>
      <p className="text-base text-gray-700">
        Non hai ancora effettuato ordini, cambiamo la situazione {":)"}
      </p>
      <LocalizedClientLink href="/store" passHref>
        <Button
          data-testid="continue-shopping-button"
          variant="elevated"
          className="bg-black text-white hover:text-black hover:bg-green-400"
        >
          Continua lo shopping
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default OrderOverview
