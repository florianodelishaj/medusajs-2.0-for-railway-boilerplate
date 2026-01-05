"use client"

import { XMark } from "@medusajs/icons"
import React from "react"

import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
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
        <h1 className="text-2xl font-bold">Dettagli ordine</h1>
        <LocalizedClientLink
          href="/account/orders"
          className="flex gap-2 items-center text-gray-700 hover:text-green-600 transition-colors"
          data-testid="back-to-overview-button"
        >
          <XMark /> Torna alla panoramica
        </LocalizedClientLink>
      </div>
      <div
        className="flex flex-col gap-6 bg-white border border-black rounded-md p-6"
        data-testid="order-details-container"
      >
        <OrderDetails order={order} showStatus />
        <Items items={order.items} currencyCode={order.currency_code} />
        <ShippingDetails order={order} />
        <OrderSummary order={order} />
        <Help />
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
