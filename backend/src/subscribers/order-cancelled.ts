import { Modules } from '@medusajs/framework/utils'
import { INotificationModuleService, IOrderModuleService } from '@medusajs/framework/types'
import { SubscriberArgs, SubscriberConfig } from '@medusajs/medusa'
import { EmailTemplates } from '../modules/email-notifications/templates'

export default async function orderCancelledHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const notificationModuleService: INotificationModuleService = container.resolve(Modules.NOTIFICATION)
  const orderModuleService: IOrderModuleService = container.resolve(Modules.ORDER)

  const order = await orderModuleService.retrieveOrder(data.id, {
    relations: ['items', 'summary', 'shipping_address'],
  })
  const shippingAddress = await (orderModuleService as any).orderAddressService_.retrieve(order.shipping_address.id)

  try {
    await notificationModuleService.createNotifications({
      to: order.email,
      channel: 'email',
      template: EmailTemplates.ORDER_CANCELLED,
      data: {
        emailOptions: {
          replyTo: 'assistenza@ilcovodixur.com',
          subject: `Il Covo di Xur — Ordine #${order.display_id} annullato`,
        },
        order,
        shippingAddress,
        preview: `Il tuo ordine #${order.display_id} è stato annullato.`,
      },
    })
  } catch (error) {
    console.error('Error sending order cancelled notification:', error)
  }
}

export const config: SubscriberConfig = {
  event: 'order.canceled',
}
