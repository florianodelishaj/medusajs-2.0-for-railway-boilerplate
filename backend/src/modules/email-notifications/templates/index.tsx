import { ReactNode } from 'react'
import { MedusaError } from '@medusajs/framework/utils'
import { InviteUserEmail, INVITE_USER, isInviteUserData } from './invite-user'
import { OrderPlacedTemplate, ORDER_PLACED, isOrderPlacedTemplateData } from './order-placed'
import { ResetPasswordEmail, RESET_PASSWORD, isResetPasswordData } from './reset-password'
import { OrderShippedTemplate, ORDER_SHIPPED, isOrderShippedTemplateData } from './order-shipped'
import { RefundProcessedTemplate, REFUND_PROCESSED, isRefundProcessedTemplateData } from './refund-processed'
import { WelcomeTemplate, WELCOME, isWelcomeTemplateData } from './welcome'
import { OrderCancelledTemplate, ORDER_CANCELLED, isOrderCancelledTemplateData } from './order-cancelled'
import { ReturnRequestedTemplate, RETURN_REQUESTED, isReturnRequestedTemplateData } from './return-requested'

export const EmailTemplates = {
  INVITE_USER,
  ORDER_PLACED,
  RESET_PASSWORD,
  ORDER_SHIPPED,
  REFUND_PROCESSED,
  WELCOME,
  ORDER_CANCELLED,
  RETURN_REQUESTED,
} as const

export type EmailTemplateType = keyof typeof EmailTemplates

export function generateEmailTemplate(templateKey: string, data: unknown): ReactNode {
  switch (templateKey) {
    case EmailTemplates.INVITE_USER:
      if (!isInviteUserData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.INVITE_USER}"`
        )
      }
      return <InviteUserEmail {...data} />

    case EmailTemplates.ORDER_PLACED:
      if (!isOrderPlacedTemplateData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.ORDER_PLACED}"`
        )
      }
      return <OrderPlacedTemplate {...data} />

    case EmailTemplates.RESET_PASSWORD:
      if (!isResetPasswordData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.RESET_PASSWORD}"`
        )
      }
      return <ResetPasswordEmail {...data} />

    case EmailTemplates.ORDER_SHIPPED:
      if (!isOrderShippedTemplateData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.ORDER_SHIPPED}"`
        )
      }
      return <OrderShippedTemplate {...data} />

    case EmailTemplates.REFUND_PROCESSED:
      if (!isRefundProcessedTemplateData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.REFUND_PROCESSED}"`
        )
      }
      return <RefundProcessedTemplate {...data} />

    case EmailTemplates.WELCOME:
      if (!isWelcomeTemplateData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.WELCOME}"`
        )
      }
      return <WelcomeTemplate {...data} />

    case EmailTemplates.ORDER_CANCELLED:
      if (!isOrderCancelledTemplateData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.ORDER_CANCELLED}"`
        )
      }
      return <OrderCancelledTemplate {...data} />

    case EmailTemplates.RETURN_REQUESTED:
      if (!isReturnRequestedTemplateData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.RETURN_REQUESTED}"`
        )
      }
      return <ReturnRequestedTemplate {...data} />

    default:
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Unknown template key: "${templateKey}"`
      )
  }
}

export {
  InviteUserEmail,
  OrderPlacedTemplate,
  ResetPasswordEmail,
  OrderShippedTemplate,
  RefundProcessedTemplate,
  WelcomeTemplate,
  OrderCancelledTemplate,
  ReturnRequestedTemplate,
}
