import { Text, Section, Hr } from '@react-email/components'
import * as React from 'react'
import { Base } from './base'
import { OrderDTO, OrderAddressDTO } from '@medusajs/framework/types'

export const ORDER_PLACED = 'order-placed'

interface OrderPlacedPreviewProps {
  order: OrderDTO & { display_id: string; summary: { raw_current_order_total: { value: number } } }
  shippingAddress: OrderAddressDTO
}

export interface OrderPlacedTemplateProps {
  order: OrderDTO & { display_id: string; summary: { raw_current_order_total: { value: number } } }
  shippingAddress: OrderAddressDTO
  preview?: string
}

export const isOrderPlacedTemplateData = (data: any): data is OrderPlacedTemplateProps =>
  typeof data.order === 'object' && typeof data.shippingAddress === 'object'

export const OrderPlacedTemplate: React.FC<OrderPlacedTemplateProps> & {
  PreviewProps: OrderPlacedPreviewProps
} = ({ order, shippingAddress, preview = 'Il tuo ordine è stato effettuato!' }) => {
  const formatPrice = (value: number, currency: string) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currency
    }).format(value / 100)
  }

  return (
    <Base preview={preview}>
      <Section>
        <Text className="text-black text-[32px] font-bold text-center mt-0 mb-4">
          Conferma Ordine
        </Text>

        <Text className="text-gray-700 text-[16px] leading-[24px] mb-4">
          Ciao {shippingAddress.first_name} {shippingAddress.last_name},
        </Text>

        <Text className="text-gray-700 text-[16px] leading-[24px] mb-6">
          Grazie per il tuo ordine! Ecco i dettagli:
        </Text>

        <Text className="text-black text-[20px] font-bold mb-3">
          Riepilogo Ordine
        </Text>
        <Text className="text-gray-700 text-[14px] mb-2">
          <strong>ID Ordine:</strong> #{order.display_id}
        </Text>
        <Text className="text-gray-700 text-[14px] mb-2">
          <strong>Data:</strong> {new Date(order.created_at).toLocaleDateString('it-IT')}
        </Text>
        <Text className="text-gray-700 text-[14px] mb-4">
          <strong>Totale:</strong> {formatPrice(order.summary.raw_current_order_total.value, order.currency_code)}
        </Text>

        <Hr className="border-2 border-solid border-black my-6 mx-0 w-full" />

        <Text className="text-black text-[20px] font-bold mb-3">
          Indirizzo di Spedizione
        </Text>
        <Text className="text-gray-700 text-[14px] mb-1">
          {shippingAddress.address_1}
        </Text>
        <Text className="text-gray-700 text-[14px] mb-1">
          {shippingAddress.postal_code}, {shippingAddress.city}
        </Text>
        {shippingAddress.province && (
          <Text className="text-gray-700 text-[14px] mb-1">
            {shippingAddress.province}
          </Text>
        )}
        <Text className="text-gray-700 text-[14px] mb-4">
          {shippingAddress.country_code?.toUpperCase()}
        </Text>

        <Hr className="border-2 border-solid border-black my-6 mx-0 w-full" />

        <Text className="text-black text-[20px] font-bold mb-4">
          Articoli Ordinati
        </Text>

        <div style={{
          width: '100%',
          border: '2px solid #000',
          borderRadius: '6px',
          overflow: 'hidden',
          margin: '10px 0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: '#F4F4F0',
            padding: '12px',
            borderBottom: '2px solid #000'
          }}>
            <Text className="font-bold text-[14px] m-0" style={{ flex: 2 }}>Prodotto</Text>
            <Text className="font-bold text-[14px] m-0 text-center" style={{ flex: 1 }}>Qtà</Text>
            <Text className="font-bold text-[14px] m-0 text-right" style={{ flex: 1 }}>Prezzo</Text>
          </div>
          {order.items.map((item) => (
            <div key={item.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px',
              borderBottom: '1px solid #ddd'
            }}>
              <Text className="text-[14px] text-gray-700 m-0" style={{ flex: 2 }}>
                {item.title}
              </Text>
              <Text className="text-[14px] text-gray-700 m-0 text-center" style={{ flex: 1 }}>
                {item.quantity}
              </Text>
              <Text className="text-[14px] text-gray-700 m-0 text-right" style={{ flex: 1 }}>
                {formatPrice(item.unit_price, order.currency_code)}
              </Text>
            </div>
          ))}
        </div>
      </Section>
    </Base>
  )
}

OrderPlacedTemplate.PreviewProps = {
  order: {
    id: 'test-order-id',
    display_id: 'ORD-123',
    created_at: new Date().toISOString(),
    email: 'test@example.com',
    currency_code: 'USD',
    items: [
      { id: 'item-1', title: 'Item 1', product_title: 'Product 1', quantity: 2, unit_price: 10 },
      { id: 'item-2', title: 'Item 2', product_title: 'Product 2', quantity: 1, unit_price: 25 }
    ],
    shipping_address: {
      first_name: 'Test',
      last_name: 'User',
      address_1: '123 Main St',
      city: 'Anytown',
      province: 'CA',
      postal_code: '12345',
      country_code: 'US'
    },
    summary: { raw_current_order_total: { value: 45 } }
  },
  shippingAddress: {
    first_name: 'Test',
    last_name: 'User',
    address_1: '123 Main St',
    city: 'Anytown',
    province: 'CA',
    postal_code: '12345',
    country_code: 'US'
  }
} as OrderPlacedPreviewProps

export default OrderPlacedTemplate
