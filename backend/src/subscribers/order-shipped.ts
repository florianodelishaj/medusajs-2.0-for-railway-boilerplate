import { Modules } from "@medusajs/framework/utils";
import { INotificationModuleService } from "@medusajs/framework/types";
import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import { EmailTemplates } from "../modules/email-notifications/templates";

export default async function orderShippedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const notificationModuleService: INotificationModuleService =
    container.resolve(Modules.NOTIFICATION);

  const fulfillmentId = data.id;
  if (!fulfillmentId) {
    console.error("[order-shipped] No fulfillment id in event data");
    return;
  }

  // Retrieve fulfillment with labels (tracking info)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const fulfillment = await (
    fulfillmentModuleService as any
  ).retrieveFulfillment(fulfillmentId, { relations: ["labels"] });

  const trackingNumber = fulfillment?.labels?.[0]?.tracking_number || undefined;
  const trackingUrl = fulfillment?.labels?.[0]?.tracking_url || undefined;

  // Get the order linked to this fulfillment via remote query
  const query = container.resolve("query");
  const {
    data: [fulfillmentWithOrder],
  } = await query.graph({
    entity: "fulfillment",
    filters: { id: fulfillmentId },
    fields: ["order.id"],
  });

  const orderId = fulfillmentWithOrder?.order?.id;
  if (!orderId) {
    console.error(
      "[order-shipped] Could not find order for fulfillment",
      fulfillmentId,
    );
    return;
  }

  // Retrieve full order with items and shipping address
  const orderModuleService = container.resolve(Modules.ORDER);
  const order = await (orderModuleService as any).retrieveOrder(orderId, {
    relations: ["items", "shipping_address"],
  });
  const shippingAddress = await (
    orderModuleService as any
  ).orderAddressService_.retrieve(order.shipping_address.id);

  try {
    await notificationModuleService.createNotifications({
      to: order.email,
      channel: "email",
      template: EmailTemplates.ORDER_SHIPPED,
      data: {
        emailOptions: {
          replyTo: "ordini@ilcovodixur.com",
          subject: `Il Covo di Xur — Il tuo ordine #${order.display_id} è stato spedito!`,
        },
        order,
        shippingAddress,
        trackingNumber,
        trackingUrl,
        preview: `Il tuo ordine #${order.display_id} è in viaggio!`,
      },
    });
  } catch (error) {
    console.error("Error sending order shipped notification:", error);
  }
}

export const config: SubscriberConfig = {
  event: "shipment.created",
};
