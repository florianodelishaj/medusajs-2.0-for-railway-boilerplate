import { INotificationModuleService } from '@medusajs/framework/types'
import { Modules } from '@medusajs/framework/utils'
import { SubscriberArgs, SubscriberConfig } from '@medusajs/framework'
import { FRONTEND_URL } from '../lib/constants'
import { EmailTemplates } from '../modules/email-notifications/templates'

export default async function passwordResetHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {

  const notificationModuleService: INotificationModuleService = container.resolve(
    Modules.NOTIFICATION,
  )

  // Log the event data to understand its structure
  console.log('Password reset event data:', JSON.stringify(data, null, 2))

  // The event data structure from MedusaJS auth.password_reset event
  const { entity_id, token } = data

  if (!entity_id || !token) {
    console.error('Missing entity_id or token in password reset event:', data)
    return
  }

  try {
    // entity_id is the email address for emailpass provider
    const email = entity_id

    // Create the reset link with token and email as query parameters
    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`

    await notificationModuleService.createNotifications({
      to: email,
      channel: 'email',
      template: EmailTemplates.RESET_PASSWORD,
      data: {
        emailOptions: {
          replyTo: 'info@example.com',
          subject: 'Reimposta la tua password'
        },
        resetLink,
        preview: 'Reimposta la tua password'
      }
    })

    console.log(`Password reset email sent successfully to: ${email}`)
  } catch (error) {
    console.error('Error sending password reset email:', error)
  }
}

export const config: SubscriberConfig = {
  event: 'auth.password_reset'
}
