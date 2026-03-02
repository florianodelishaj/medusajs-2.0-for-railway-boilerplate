import { Text, Section, Hr, Link } from "@react-email/components";
import * as React from "react";
import { Base } from "./base";
import { OrderDTO, OrderAddressDTO } from "@medusajs/framework/types";

export const ORDER_PICKUP_READY = "order-pickup-ready";

export interface OrderPickupReadyTemplateProps {
  order: OrderDTO & { display_id: string };
  shippingAddress: OrderAddressDTO;
  preview?: string;
}

export const isOrderPickupReadyTemplateData = (
  data: any,
): data is OrderPickupReadyTemplateProps =>
  typeof data.order === "object" && typeof data.shippingAddress === "object";

export const OrderPickupReadyTemplate = ({
  order,
  shippingAddress,
  preview = "Il tuo ordine è pronto per il ritiro!",
}: OrderPickupReadyTemplateProps) => {
  return (
    <Base preview={preview}>
      <Section>
        {/* Icon + heading */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "#4ade80",
              border: "2px solid #000",
              display: "inline-block",
              marginBottom: "16px",
              lineHeight: "56px",
              textAlign: "center",
              fontSize: "28px",
            }}
          >
            🏪
          </div>
          <Text className="text-black text-[28px] font-black uppercase tracking-tight text-center m-0">
            Pronto per il Ritiro
          </Text>
          <Text className="text-[#666] text-[14px] text-center m-0 mt-[6px]">
            Ordine #{order.display_id}
          </Text>
        </div>

        {/* Greeting */}
        <Text className="text-black text-[16px] leading-[24px] m-0 mb-[16px]">
          Ciao{" "}
          <strong>
            {shippingAddress.first_name} {shippingAddress.last_name}
          </strong>
          ,
        </Text>
        <Text className="text-[#444] text-[15px] leading-[24px] m-0 mb-[28px]">
          Il tuo ordine è pronto! Puoi passare a ritirarlo direttamente in
          negozio durante gli orari di apertura.
        </Text>

        {/* Store info */}
        <div
          style={{
            backgroundColor: "#4ade80",
            border: "2px solid #000",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "28px",
          }}
        >
          <Text className="text-black text-[12px] font-black uppercase tracking-[0.1em] m-0 mb-[12px]">
            Dove trovarci
          </Text>
          <Text className="text-black text-[14px] leading-[22px] m-0 mb-[12px]">
            <strong>Il Covo di Xur</strong>
            <br />
            Via Galileo Galilei
            <br />
            64100 San Nicolò a Tordino (TE)
          </Text>
          <Text className="text-black text-[12px] font-black uppercase tracking-[0.1em] m-0 mb-[8px]">
            Orari
          </Text>
          <Text className="text-black text-[14px] leading-[22px] m-0">
            Lunedì – Martedì – Mercoledì: 18:00 – 22:00
            <br />
            Giovedì: 18:00 – 00:00
            <br />
            Venerdì: 18:00 – 02:00
            <br />
            Sabato: 10:00 – 02:00
            <br />
            Domenica: 14:00 – 00:00
          </Text>
        </div>

        {/* Items reminder */}
        <Text className="text-black text-[12px] font-black uppercase tracking-[0.1em] m-0 mb-[10px]">
          Ricorda di portare con te
        </Text>
        <div
          style={{
            border: "2px solid #000",
            borderRadius: "8px",
            padding: "16px 20px",
            marginBottom: "28px",
            backgroundColor: "#fff",
          }}
        >
          <Text className="text-[#444] text-[14px] leading-[22px] m-0">
            • Un documento d&apos;identità valido
            <br />• Il numero d&apos;ordine:{" "}
            <strong>#{order.display_id}</strong>
            <br />• Questa email (o screenshot)
          </Text>
        </div>

        {/* Help note */}
        <Hr className="border-[#e5e5e5] my-[20px] mx-0 w-full" />
        <Text className="text-[#999] text-[13px] leading-[20px] text-center m-0">
          Hai bisogno di aiuto? Scrivici a{" "}
          <Link
            href="mailto:ordini@ilcovodixur.com"
            className="text-black font-medium no-underline"
          >
            ordini@ilcovodixur.com
          </Link>
        </Text>
      </Section>
    </Base>
  );
};

OrderPickupReadyTemplate.PreviewProps = {
  order: {
    id: "test-order-id",
    display_id: "1042",
    email: "test@example.com",
  },
  shippingAddress: {
    first_name: "Marco",
    last_name: "Rossi",
    address_1: "Via Roma 42",
    city: "Milano",
    province: "MI",
    postal_code: "20100",
    country_code: "IT",
  },
} as OrderPickupReadyTemplateProps;

export default OrderPickupReadyTemplate;
