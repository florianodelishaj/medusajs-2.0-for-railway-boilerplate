import { Modules } from '@medusajs/framework/utils'
import { INotificationModuleService, ICustomerModuleService } from '@medusajs/framework/types'
import { SubscriberArgs, SubscriberConfig } from '@medusajs/medusa'
import { EmailTemplates } from '../modules/email-notifications/templates'

export default async function customerCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const notificationModuleService: INotificationModuleService = container.resolve(Modules.NOTIFICATION)
  const customerModuleService: ICustomerModuleService = container.resolve(Modules.CUSTOMER)

  const customer = await customerModuleService.retrieveCustomer(data.id)

  if (!customer.email) return

  const customerName = customer.first_name || 'collezionista'

  try {
    await notificationModuleService.createNotifications({
      to: customer.email,
      channel: 'email',
      template: EmailTemplates.WELCOME,
      data: {
        emailOptions: {
          replyTo: 'assistenza@ilcovodixur.com',
          subject: 'Benvenuto nel Covo di Xur!',
        },
        customerName,
        preview: `Ciao ${customerName}, benvenuto nel Covo di Xur!`,
      },
    })
  } catch (error) {
    console.error('Error sending welcome notification:', error)
  }
}

export const config: SubscriberConfig = {
  event: 'customer.created',
}
