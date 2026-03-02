import {
  Text,
  Section,
  Hr,
  Row,
  Column,
  Link,
} from "@react-email/components";
import * as React from "react";
import { CircleCheckIcon } from "./icons";
import { Base } from "./base";
import { OrderDTO, OrderAddressDTO } from "@medusajs/framework/types";

export const ORDER_RECEIVED = "order-received";

export interface OrderReceivedTemplateProps {
  order: OrderDTO & {
    display_id: string;
    summary: { raw_current_order_total: { value: number } };
    shipping_methods?: Array<{ name: string; amount: number | string | bigint }>;
  };
  shippingAddress: OrderAddressDTO;
  preview?: string;
}

export const isOrderReceivedTemplateData = (
  data: any,
): data is OrderReceivedTemplateProps =>
  typeof data.order === "object" && typeof data.shippingAddress === "object";

export const OrderReceivedTemplate: React.FC<OrderReceivedTemplateProps> & {
  PreviewProps: OrderReceivedTemplateProps;
} = ({
  order,
  shippingAddress,
  preview = "Grazie per il tuo ordine! Ti confermeremo a breve.",
}) => {
  const formatPrice = (value: number, currency: string) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: currency,
    }).format(value);
  };

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
            }}
          >
            <CircleCheckIcon
              size={28}
              color="#000"
              style={{ verticalAlign: "middle" }}
            />
          </div>
          <Text className="text-black text-[28px] font-black uppercase tracking-tight text-center m-0">
            Ordine Ricevuto
          </Text>
          <Text className="text-[#666] text-[14px] text-center m-0 mt-[6px]">
            Ordine #{order.display_id} —{" "}
            {new Date(order.created_at).toLocaleDateString("it-IT", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
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
          Grazie per aver effettuato l&apos;ordine! Lo stiamo verificando e
          riceverai a breve un&apos;email di conferma con tutti i dettagli.
        </Text>

        {/* Items */}
        <Text className="text-black text-[12px] font-black uppercase tracking-[0.1em] m-0 mb-[12px]">
          I tuoi articoli
        </Text>

        {order.items.map((item) => (
          <div
            key={item.id}
            style={{
              border: "2px solid #000",
              borderRadius: "8px",
              padding: "14px 16px",
              marginBottom: "8px",
              backgroundColor: "#fff",
            }}
          >
            <Row>
              <Column style={{ width: "65%", verticalAlign: "middle" }}>
                <Text className="text-black text-[14px] font-bold m-0">
                  {item.title}
                </Text>
                {item.variant_title && (
                  <Text className="text-[#888] text-[11px] m-0 mt-[2px]">
                    {item.variant_title}
                  </Text>
                )}
              </Column>
              <Column
                style={{
                  width: "10%",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
              >
                <Text className="text-[#666] text-[13px] m-0">
                  ×{item.quantity}
                </Text>
              </Column>
              <Column
                style={{
                  width: "25%",
                  textAlign: "right",
                  verticalAlign: "middle",
                }}
              >
                <Text className="text-black text-[15px] font-black m-0">
                  {formatPrice(item.unit_price, order.currency_code)}
                </Text>
              </Column>
            </Row>
          </div>
        ))}

        {/* Shipping method */}
        {(order.shipping_methods ?? []).map((sm, i) => (
          <div
            key={i}
            style={{
              border: "2px solid #000",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "8px",
              backgroundColor: "#fff",
            }}
          >
            <Row>
              <Column style={{ verticalAlign: "middle" }}>
                <Text className="text-black text-[14px] font-bold m-0">
                  Spedizione:{" "}
                  <span style={{ fontWeight: "normal", color: "#666", fontSize: "13px" }}>
                    {sm.name}
                  </span>
                </Text>
              </Column>
              <Column style={{ textAlign: "right", verticalAlign: "middle" }}>
                <Text className="text-black text-[13px] font-bold m-0">
                  {Number(sm.amount) === 0
                    ? "Gratuita"
                    : formatPrice(Number(sm.amount), order.currency_code)}
                </Text>
              </Column>
            </Row>
          </div>
        ))}

        {/* Total */}
        <div
          style={{
            backgroundColor: "#4ade80",
            border: "2px solid #000",
            borderRadius: "8px",
            padding: "16px 20px",
            marginTop: "4px",
            marginBottom: "28px",
          }}
        >
          <Row>
            <Column>
              <Text className="text-black text-[15px] font-black uppercase m-0">
                Totale
              </Text>
            </Column>
            <Column style={{ textAlign: "right" }}>
              <Text className="text-black text-[20px] font-black m-0">
                {formatPrice(
                  order.summary.raw_current_order_total.value,
                  order.currency_code,
                )}
              </Text>
            </Column>
          </Row>
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

OrderReceivedTemplate.PreviewProps = {
  order: {
    id: "test-order-id",
    display_id: "1042",
    created_at: new Date().toISOString(),
    email: "test@example.com",
    currency_code: "EUR",
    items: [
      {
        id: "item-1",
        title: "Funko Pop! Naruto Uzumaki #727",
        variant_title: "Standard",
        quantity: 2,
        unit_price: 14.99,
      },
      {
        id: "item-2",
        title: "Pokemon TCG - Booster Box Scarlet & Violet",
        variant_title: null,
        quantity: 1,
        unit_price: 149.99,
      },
    ],
    shipping_methods: [{ name: "Spedizione Standard", amount: 5.99 }],
    summary: { raw_current_order_total: { value: 179.97 } },
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
} as OrderReceivedTemplateProps;

export default OrderReceivedTemplate;
