import { Text, Section, Hr, Link } from "@react-email/components";
import * as React from "react";
import { Base } from "./base";
import { OrderDTO, OrderAddressDTO } from "@medusajs/framework/types";

export const ORDER_DELIVERED = "order-delivered";

export interface OrderDeliveredTemplateProps {
  order: OrderDTO & { display_id: string };
  shippingAddress: OrderAddressDTO;
  preview?: string;
}

export const isOrderDeliveredTemplateData = (
  data: any,
): data is OrderDeliveredTemplateProps =>
  typeof data.order === "object" && typeof data.shippingAddress === "object";

export const OrderDeliveredTemplate = ({
  order,
  shippingAddress,
  preview = "Il tuo ordine è stato consegnato!",
}: OrderDeliveredTemplateProps) => {
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
            ✅
          </div>
          <Text className="text-black text-[28px] font-black uppercase tracking-tight text-center m-0">
            Ordine Ritirato
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
          Grazie per essere passato a ritirare il tuo ordine! Speriamo che i
          tuoi acquisti ti soddisfino pienamente.
        </Text>

        {/* Thank you box */}
        <div
          style={{
            backgroundColor: "#4ade80",
            border: "2px solid #000",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "28px",
            textAlign: "center",
          }}
        >
          <Text className="text-black text-[15px] leading-[24px] m-0">
            Grazie per aver scelto <strong>Il Covo di Xur</strong>.<br />
            Ci vediamo presto!
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

OrderDeliveredTemplate.PreviewProps = {
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
} as OrderDeliveredTemplateProps;

export default OrderDeliveredTemplate;
