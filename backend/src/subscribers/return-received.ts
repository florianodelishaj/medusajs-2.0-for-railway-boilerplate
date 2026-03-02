import { Modules } from "@medusajs/framework/utils";
import {
  INotificationModuleService,
  IOrderModuleService,
} from "@medusajs/framework/types";
import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import { EmailTemplates } from "../modules/email-notifications/templates";

export default async function returnReceivedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const notificationModuleService: INotificationModuleService =
    container.resolve(Modules.NOTIFICATION);
  const orderModuleService: IOrderModuleService = container.resolve(
    Modules.ORDER,
  );

  const orderId = data.order_id;

  if (!orderId) {
    console.error("[return-received] Missing order_id:", data);
    return;
  }

  const order = await orderModuleService.retrieveOrder(orderId, {
    relations: ["shipping_address"],
  });
  const shippingAddress = await (
    orderModuleService as any
  ).orderAddressService_.retrieve(order.shipping_address.id);
  const customerName = `${shippingAddress.first_name} ${shippingAddress.last_name}`;

  let items: { title: string; quantity: number }[] = [];
  if (data.return_id) {
    try {
      const returnData = await (orderModuleService as any).retrieveReturn(
        data.return_id,
        { relations: ["items", "items.item"] },
      );

      // Guard: fire only when the return has actually been received
      if (returnData.status !== "received") {
        console.log(
          `[return-received] Skipping — return ${data.return_id} status is "${returnData.status}", not "received"`,
        );
        return;
      }

      items = (returnData.items || []).map((item: any) => ({
        title: item.item?.title || item.title || "Articolo",
        quantity: item.quantity || 1,
      }));
    } catch (e) {
      console.error("[return-received] Error retrieving return:", e);
      return;
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
          subject: `Il Covo di Xur — Reso ricevuto per ordine #${order.display_id}`,
        },
        orderDisplayId: String(order.display_id),
        customerName,
        items,
        returnStatus: "received",
        preview: `Il tuo reso per l'ordine #${order.display_id} è stato ricevuto.`,
      },
    });
  } catch (error) {
    console.error("[return-received] Error sending email:", error);
  }

}

export const config: SubscriberConfig = {
  event: "order.return_received",
};
