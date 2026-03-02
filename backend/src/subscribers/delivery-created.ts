import { Modules } from "@medusajs/framework/utils";
import { INotificationModuleService } from "@medusajs/framework/types";
import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import { EmailTemplates } from "../modules/email-notifications/templates";

export default async function deliveryCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  console.log("[delivery-created] Event fired, data:", JSON.stringify(data));

  const fulfillmentId = data.id;
  if (!fulfillmentId) {
    console.error("[delivery-created] No fulfillment id in event data");
    return;
  }

  // Get order_id via query.graph with minimal fields (only order.id — no cross-module joins)
  const query = container.resolve("query");
  const { data: [fulfillmentWithOrder] } = await query.graph({
    entity: "fulfillment",
    filters: { id: fulfillmentId },
    fields: ["order.id"],
  });

  const orderId = fulfillmentWithOrder?.order?.id;
  if (!orderId) {
    console.error("[delivery-created] Could not find order for fulfillment", fulfillmentId);
    return;
  }

  console.log("[delivery-created] orderId:", orderId);
  const orderModuleService = container.resolve(Modules.ORDER);
  const order = await (orderModuleService as any).retrieveOrder(orderId, {
    relations: ["items", "shipping_address", "shipping_methods"],
  });
  const shippingAddress = await (
    orderModuleService as any
  ).orderAddressService_.retrieve(order.shipping_address.id);

  // Detect pickup by shipping method name
  const shippingMethods: any[] = order.shipping_methods ?? [];
  const isPickup = shippingMethods.some((sm: any) => {
    const name = (sm.name ?? "").toLowerCase();
    return name.includes("ritiro") || name.includes("pickup");
  });

  console.log("[delivery-created] isPickup:", isPickup);

  const notificationModuleService: INotificationModuleService =
    container.resolve(Modules.NOTIFICATION);

  if (isPickup) {
    try {
      await notificationModuleService.createNotifications({
        to: order.email,
        channel: "email",
        template: EmailTemplates.ORDER_DELIVERED,
        data: {
          emailOptions: {
            replyTo: "ordini@ilcovodixur.com",
            subject: `Il Covo di Xur — Ordine #${order.display_id} ritirato!`,
          },
          order,
          shippingAddress,
          preview: `Grazie per essere passato a ritirare il tuo ordine #${order.display_id}!`,
        },
      });
      console.log("[delivery-created] Pickup confirmed email sent OK to", order.email);
    } catch (error) {
      console.error("[delivery-created] Error sending pickup confirmed email:", error);
    }
    return;
  }

  try {
    await notificationModuleService.createNotifications({
      to: order.email,
      channel: "email",
      template: EmailTemplates.ORDER_SHIPPING_DELIVERED,
      data: {
        emailOptions: {
          replyTo: "ordini@ilcovodixur.com",
          subject: `Il Covo di Xur — Ordine #${order.display_id} consegnato!`,
        },
        order,
        shippingAddress,
        preview: `Il tuo ordine #${order.display_id} è stato consegnato. Grazie!`,
      },
    });
    console.log("[delivery-created] Shipping delivered email sent OK to", order.email);
  } catch (error) {
    console.error("[delivery-created] Error sending shipping delivered email:", error);
  }
}

export const config: SubscriberConfig = {
  event: "delivery.created",
};
