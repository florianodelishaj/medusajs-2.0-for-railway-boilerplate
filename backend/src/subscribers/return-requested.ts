import { Modules } from "@medusajs/framework/utils";
import {
  INotificationModuleService,
  IOrderModuleService,
} from "@medusajs/framework/types";
import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import { EmailTemplates } from "../modules/email-notifications/templates";

export default async function returnRequestedHandler({
  event: { data, name },
  container,
}: SubscriberArgs<any>) {
  const notificationModuleService: INotificationModuleService =
    container.resolve(Modules.NOTIFICATION);
  const orderModuleService: IOrderModuleService = container.resolve(
    Modules.ORDER,
  );

  console.log("[return-requested] Event data:", JSON.stringify(data));
  const returnOrder = data;
  const orderId = returnOrder.order_id;

  if (!orderId) {
    console.error("Return event missing order_id:", data);
    return;
  }

  const order = await orderModuleService.retrieveOrder(orderId, {
    relations: ["shipping_address"],
  });
  const shippingAddress = await (
    orderModuleService as any
  ).orderAddressService_.retrieve(order.shipping_address.id);
  const customerName = `${shippingAddress.first_name} ${shippingAddress.last_name}`;

  const returnStatus =
    name === "order.return_received" ? "received" : "requested";
  const statusLabel = returnStatus === "received" ? "ricevuto" : "richiesto";

  // Get return items if return_id is available
  let items: { title: string; quantity: number }[] = [];
  if (data.return_id) {
    try {
      const returnData = await (orderModuleService as any).retrieveReturn(
        data.return_id,
        {
          relations: ["items", "items.item"],
        },
      );
      items = (returnData.items || []).map((item: any) => ({
        title: item.item?.title || item.title || "Articolo",
        quantity: item.quantity || 1,
      }));
    } catch (e) {
      console.error("[return-requested] Error retrieving return items:", e);
    }
  }

  try {
    await notificationModuleService.createNotifications({
      to: order.email,
      channel: "email",
      template: EmailTemplates.RETURN_REQUESTED,
      data: {
        emailOptions: {
          replyTo: "ordini@ilcovodixur.com",
          subject: `Il Covo di Xur — Reso ${statusLabel} per ordine #${order.display_id}`,
        },
        orderDisplayId: String(order.display_id),
        customerName,
        items,
        returnStatus,
        preview: `Il tuo reso per l'ordine #${order.display_id} è stato ${statusLabel}.`,
      },
    });
  } catch (error) {
    console.error("Error sending return notification:", error);
  }

  try {
    await notificationModuleService.createNotifications({
      to: "admin",
      channel: "feed",
      template: "admin-ui",
      data: {
        title: `Reso ${statusLabel} — ordine #${order.display_id}`,
        description: `${customerName} — ${order.email}`,
      },
    });
  } catch (error) {
    console.error("Error sending admin feed notification:", error);
  }
}

export const config: SubscriberConfig = {
  event: ["order.return_requested", "order.return_received"],
};
