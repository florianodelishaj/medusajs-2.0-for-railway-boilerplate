import { Modules } from "@medusajs/framework/utils";
import {
  INotificationModuleService,
  IOrderModuleService,
} from "@medusajs/framework/types";
import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import { EmailTemplates } from "../modules/email-notifications/templates";

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const notificationModuleService: INotificationModuleService =
    container.resolve(Modules.NOTIFICATION);
  const orderModuleService: IOrderModuleService = container.resolve(
    Modules.ORDER,
  );

  const order = await orderModuleService.retrieveOrder(data.id, {
    relations: ["items", "summary", "shipping_address", "shipping_methods"],
  });
  const shippingAddress = await (
    orderModuleService as any
  ).orderAddressService_.retrieve(order.shipping_address.id);

  try {
    await notificationModuleService.createNotifications({
      to: order.email,
      channel: "email",
      template: EmailTemplates.ORDER_RECEIVED,
      data: {
        emailOptions: {
          replyTo: "ordini@ilcovodixur.com",
          subject: `Il Covo di Xur — Grazie per il tuo ordine #${order.display_id}!`,
        },
        order,
        shippingAddress,
        preview: `Ordine #${order.display_id} ricevuto! Ti confermeremo a breve.`,
      },
    });
  } catch (error) {
    console.error("Error sending order received notification:", error);
  }

  try {
    await notificationModuleService.createNotifications({
      to: "admin",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: `Nuovo ordine #${order.display_id}`,
        description: `${shippingAddress.first_name} ${shippingAddress.last_name} — ${order.email}`,
      },
    });
  } catch (error) {
    console.error("Error sending admin feed notification:", error);
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
};
