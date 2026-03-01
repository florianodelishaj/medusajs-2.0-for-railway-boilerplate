"use client"

import { ArrowLeft } from "lucide-react"
import React from "react"

import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@components/ui/button"
import { HttpTypes } from "@medusajs/types"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex gap-2 justify-between items-center mb-4">
        <h1 className="text-2xl font-black uppercase">Dettagli ordine</h1>
        <Button variant="elevated" size="sm" asChild>
          <LocalizedClientLink
            href="/account/orders"
            className="flex items-center gap-1.5 font-black uppercase hover:bg-green-400"
            data-testid="back-to-overview-button"
          >
            <ArrowLeft size={14} strokeWidth={3} /> Ordini
          </LocalizedClientLink>
        </Button>
      </div>
      <div
        className="flex flex-col gap-6 bg-white border border-black rounded-md p-6"
        data-testid="order-details-container"
      >
        <OrderDetails order={order} showStatus />
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider mb-3 border-l-4 border-green-400 pl-2">
            Articoli
          </h2>
          <Items items={order.items} currencyCode={order.currency_code} />
        </div>
        <ShippingDetails order={order} />
        <OrderSummary order={order} />
        <Help />
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
