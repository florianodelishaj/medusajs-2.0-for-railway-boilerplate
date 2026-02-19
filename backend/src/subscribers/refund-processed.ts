import { Modules } from '@medusajs/framework/utils'
import { INotificationModuleService } from '@medusajs/framework/types'
import { SubscriberArgs, SubscriberConfig } from '@medusajs/medusa'
import { EmailTemplates } from '../modules/email-notifications/templates'

export default async function refundProcessedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const notificationModuleService: INotificationModuleService = container.resolve(Modules.NOTIFICATION)

  const paymentId = data.id
  if (!paymentId) {
    console.error('[refund-processed] No payment id in event data')
    return
  }

  // Get the payment with its captures and refunds
  const paymentModuleService = container.resolve(Modules.PAYMENT)
  const payment = await (paymentModuleService as any).retrievePayment(paymentId, {
    relations: ['captures', 'refunds', 'payment_collection'],
  })

  // Get refund amount from the latest refund
  const latestRefund = payment.refunds?.sort(
    (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )?.[0]
  const refundAmount = latestRefund?.amount || 0

  // Get the order linked to this payment's collection via remote query
  const query = container.resolve('query')
  const { data: [paymentWithOrder] } = await query.graph({
    entity: 'payment',
    filters: { id: paymentId },
    fields: ['payment_collection.order.id'],
  })

  const orderId = paymentWithOrder?.payment_collection?.order?.id
  if (!orderId) {
    console.error('[refund-processed] Could not find order for payment', paymentId)
    return
  }

  // Retrieve full order
  const orderModuleService = container.resolve(Modules.ORDER)
  const order = await (orderModuleService as any).retrieveOrder(orderId, {
    relations: ['shipping_address'],
  })
  const shippingAddress = await (orderModuleService as any).orderAddressService_.retrieve(order.shipping_address.id)
  const customerName = `${shippingAddress.first_name} ${shippingAddress.last_name}`

  try {
    await notificationModuleService.createNotifications({
      to: order.email,
      channel: 'email',
      template: EmailTemplates.REFUND_PROCESSED,
      data: {
        emailOptions: {
          replyTo: 'assistenza@ilcovodixur.com',
          subject: `Il Covo di Xur — Rimborso per ordine #${order.display_id} processato`,
        },
        order,
        refundAmount,
        currencyCode: order.currency_code,
        customerName,
        reason: latestRefund?.note || undefined,
        preview: `Il rimborso per il tuo ordine #${order.display_id} è stato processato.`,
      },
    })
  } catch (error) {
    console.error('Error sending refund notification:', error)
  }
}

export const config: SubscriberConfig = {
  event: 'payment.refunded',
}
