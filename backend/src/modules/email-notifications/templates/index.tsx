import { ReactNode } from 'react'
import { MedusaError } from '@medusajs/framework/utils'
import { InviteUserEmail, INVITE_USER, isInviteUserData } from './invite-user'
import { OrderPlacedTemplate, ORDER_PLACED, isOrderPlacedTemplateData } from './order-placed'
import { OrderReceivedTemplate, ORDER_RECEIVED, isOrderReceivedTemplateData } from './order-received'
import { ResetPasswordEmail, RESET_PASSWORD, isResetPasswordData } from './reset-password'
import { OrderShippedTemplate, ORDER_SHIPPED, isOrderShippedTemplateData } from './order-shipped'
import { RefundProcessedTemplate, REFUND_PROCESSED, isRefundProcessedTemplateData } from './refund-processed'
import { WelcomeTemplate, WELCOME, isWelcomeTemplateData } from './welcome'
import { OrderCancelledTemplate, ORDER_CANCELLED, isOrderCancelledTemplateData } from './order-cancelled'
import { ReturnRequestedTemplate, RETURN_REQUESTED, isReturnRequestedTemplateData } from './return-requested'
import { OrderPickupReadyTemplate, ORDER_PICKUP_READY, isOrderPickupReadyTemplateData } from './order-pickup-ready'
import { OrderDeliveredTemplate, ORDER_DELIVERED, isOrderDeliveredTemplateData } from './order-delivered'
import { OrderShippingDeliveredTemplate, ORDER_SHIPPING_DELIVERED, isOrderShippingDeliveredTemplateData } from './order-shipping-delivered'

export const EmailTemplates = {
  INVITE_USER,
  ORDER_PLACED,
  ORDER_RECEIVED,
  ORDER_PICKUP_READY,
  ORDER_DELIVERED,
  ORDER_SHIPPING_DELIVERED,
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

    case EmailTemplates.ORDER_RECEIVED:
      if (!isOrderReceivedTemplateData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.ORDER_RECEIVED}"`
        )
      }
      return <OrderReceivedTemplate {...data} />

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

    case EmailTemplates.ORDER_PICKUP_READY:
      if (!isOrderPickupReadyTemplateData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.ORDER_PICKUP_READY}"`
        )
      }
      return <OrderPickupReadyTemplate {...data} />

    case EmailTemplates.ORDER_DELIVERED:
      if (!isOrderDeliveredTemplateData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.ORDER_DELIVERED}"`
        )
      }
      return <OrderDeliveredTemplate {...data} />

    case EmailTemplates.ORDER_SHIPPING_DELIVERED:
      if (!isOrderShippingDeliveredTemplateData(data)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid data for template "${EmailTemplates.ORDER_SHIPPING_DELIVERED}"`
        )
      }
      return <OrderShippingDeliveredTemplate {...data} />

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
  OrderReceivedTemplate,
  ResetPasswordEmail,
  OrderShippedTemplate,
  RefundProcessedTemplate,
  WelcomeTemplate,
  OrderCancelledTemplate,
  ReturnRequestedTemplate,
  OrderPickupReadyTemplate,
  OrderDeliveredTemplate,
  OrderShippingDeliveredTemplate,
}
