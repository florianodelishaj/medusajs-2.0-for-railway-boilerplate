import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { ICustomerModuleService } from "@medusajs/framework/types";
import {
  requestOrderTransferWorkflow,
  acceptOrderTransferWorkflow,
} from "@medusajs/medusa/core-flows";

/**
 * Subscriber per trasferire automaticamente gli ordini guest al cliente registrato.
 *
 * Quando un cliente si registra con un'email già usata per ordini guest,
 * questo subscriber:
 * 1. Trova tutti gli ordini guest con quella email
 * 2. Avvia il trasferimento con requestOrderTransferWorkflow
 * 3. Lo accetta immediatamente con acceptOrderTransferWorkflow
 *    (bypassa la conferma manuale via email)
 */
export default async function customerOrderTransferHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const customerId = data.id;

  // Recupera il cliente appena creato
  const customerModule: ICustomerModuleService = container.resolve(
    Modules.CUSTOMER,
  );
  const customer = await customerModule.retrieveCustomer(customerId);

  if (!customer?.email || !customer.has_account) return;

  // Trova ordini guest con la stessa email
  const query = container.resolve("query");
  const { data: orders } = await query.graph({
    entity: "order",
    filters: { email: customer.email },
    fields: ["id", "status", "customer.has_account"],
  });

  // Filtra: solo ordini di clienti guest, non cancellati
  const guestOrders = (orders as any[]).filter(
    (o) => o.customer?.has_account === false && o.status !== "canceled",
  );

  if (guestOrders.length === 0) return;

  console.log(
    `[Order Transfer] Customer ${customer.email} — trovati ${guestOrders.length} ordini guest da trasferire`,
  );

  for (const order of guestOrders) {
    try {
      // Step 1: richiedi il trasferimento
      const { result } = await requestOrderTransferWorkflow(container).run({
        input: {
          order_id: order.id,
          customer_id: customerId,
          logged_in_user: customerId,
        },
      });

      // Il token si trova in result.actions[0].details.token
      const token = (result as any)?.actions?.[0]?.details?.token;

      if (!token) {
        console.warn(
          `[Order Transfer] Ordine ${order.id}: token non trovato nel result`,
        );
        continue;
      }

      await acceptOrderTransferWorkflow(container).run({
        input: { token, order_id: order.id },
      });

      console.log(
        `[Order Transfer] Ordine ${order.id} trasferito con successo`,
      );
    } catch (error) {
      console.error(`[Order Transfer] Errore per ordine ${order.id}:`, error);
    }
  }
}

export const config: SubscriberConfig = {
  event: "customer.created",
};
