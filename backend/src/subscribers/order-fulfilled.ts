import { Modules } from "@medusajs/framework/utils";
import { INotificationModuleService } from "@medusajs/framework/types";
import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import { EmailTemplates } from "../modules/email-notifications/templates";

export default async function orderFulfilledHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  console.log("[order-fulfilled] Event fired, data:", JSON.stringify(data));

  const notificationModuleService: INotificationModuleService =
    container.resolve(Modules.NOTIFICATION);

  // order.fulfillment_created payload: { order_id, fulfillment_id, no_notification }
  const fulfillmentId = data.fulfillment_id;
  const orderId = data.order_id;

  if (!fulfillmentId || !orderId) {
    console.error(
      "[order-fulfilled] Missing fulfillment_id or order_id in event data",
      data,
    );
    return;
  }

  console.log("[order-fulfilled] fulfillmentId:", fulfillmentId, "orderId:", orderId);

  // Retrieve order with shipping_methods to detect pickup (avoids query.graph MikroORM crash)
  const orderModuleService = container.resolve(Modules.ORDER);
  const order = await (orderModuleService as any).retrieveOrder(orderId, {
    relations: ["items", "summary", "shipping_address", "shipping_methods"],
  });

  const shippingMethods: any[] = order.shipping_methods ?? [];
  console.log("[order-fulfilled] shippingMethods:", JSON.stringify(shippingMethods));

  const isPickup = shippingMethods.some((sm: any) => {
    const name = (sm.name ?? "").toLowerCase();
    const byName = name.includes("ritiro") || name.includes("pickup");
    console.log(`[order-fulfilled] sm.name="${sm.name}" byName=${byName}`);
    return byName;
  });

  console.log("[order-fulfilled] isPickup:", isPickup);

  const shippingAddress = await (
    orderModuleService as any
  ).orderAddressService_.retrieve(order.shipping_address.id);

  if (isPickup) {
    console.log(
      "[order-fulfilled] Sending pickup-ready email to",
      order.email,
    );
    try {
      await notificationModuleService.createNotifications({
        to: order.email,
        channel: "email",
        template: EmailTemplates.ORDER_PICKUP_READY,
        data: {
          emailOptions: {
            replyTo: "ordini@ilcovodixur.com",
            subject: `Il Covo di Xur — Il tuo ordine #${order.display_id} è pronto per il ritiro!`,
          },
          order,
          shippingAddress,
          preview: `Il tuo ordine #${order.display_id} ti aspetta in negozio!`,
        },
      });
      console.log("[order-fulfilled] Pickup email sent OK");
    } catch (error) {
      console.error("[order-fulfilled] Error sending pickup email:", error);
    }
    return;
  }

  console.log(
    "[order-fulfilled] Sending order-confirmed email to",
    order.email,
  );
  try {
    await notificationModuleService.createNotifications({
      to: order.email,
      channel: "email",
      template: EmailTemplates.ORDER_PLACED,
      data: {
        emailOptions: {
          replyTo: "ordini@ilcovodixur.com",
          subject: `Il Covo di Xur — Ordine #${order.display_id} confermato!`,
        },
        order,
        shippingAddress,
        preview: `Il tuo ordine #${order.display_id} è confermato e in preparazione!`,
      },
    });
    console.log("[order-fulfilled] Confirmed email sent OK");
  } catch (error) {
    console.error("[order-fulfilled] Error sending confirmed email:", error);
  }
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
};
