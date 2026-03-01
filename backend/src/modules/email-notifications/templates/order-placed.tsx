import {
  Text,
  Section,
  Hr,
  Row,
  Column,
  Link,
  Button,
} from "@react-email/components";
import * as React from "react";
import { CircleCheckIcon } from "./icons";
import { Base } from "./base";
import { OrderDTO, OrderAddressDTO } from "@medusajs/framework/types";

export const ORDER_PLACED = "order-placed";

interface OrderPlacedPreviewProps {
  order: OrderDTO & {
    display_id: string;
    summary: { raw_current_order_total: { value: number } };
  };
  shippingAddress: OrderAddressDTO;
}

export interface OrderPlacedTemplateProps {
  order: OrderDTO & {
    display_id: string;
    summary: { raw_current_order_total: { value: number } };
  };
  shippingAddress: OrderAddressDTO;
  preview?: string;
}

export const isOrderPlacedTemplateData = (
  data: any,
): data is OrderPlacedTemplateProps =>
  typeof data.order === "object" && typeof data.shippingAddress === "object";

export const OrderPlacedTemplate: React.FC<OrderPlacedTemplateProps> & {
  PreviewProps: OrderPlacedPreviewProps;
} = ({
  order,
  shippingAddress,
  preview = "Il tuo ordine è stato confermato!",
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
        {/* Success icon + heading (da A) con badge ordine (da C) */}
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
            Ordine Confermato
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

        {/* Greeting (da A) */}
        <Text className="text-black text-[16px] leading-[24px] m-0 mb-[16px]">
          Ciao{" "}
          <strong>
            {shippingAddress.first_name} {shippingAddress.last_name}
          </strong>
          ,
        </Text>
        <Text className="text-[#444] text-[15px] leading-[24px] m-0 mb-[28px]">
          Grazie per il tuo ordine! Lo stiamo preparando con cura. Riceverai
          un&apos;email quando sarà stato spedito.
        </Text>

        {/* Items — card individuali (da C) */}
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

        {/* Total — mix: sfondo verde con bordo nero (A green + C box style) */}
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

        {/* Shipping address — card singola (senza pagamento) */}
        <div
          style={{
            border: "2px solid #000",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "28px",
          }}
        >
          <Text className="text-black text-[12px] font-black uppercase tracking-[0.1em] m-0 mb-[10px]">
            Indirizzo di Spedizione
          </Text>
          <Text className="text-[#444] text-[14px] leading-[22px] m-0">
            {shippingAddress.first_name} {shippingAddress.last_name}
            <br />
            {shippingAddress.address_1}
            <br />
            {shippingAddress.postal_code}, {shippingAddress.city}
            {shippingAddress.province && <> ({shippingAddress.province})</>}
            <br />
            {shippingAddress.country_code?.toUpperCase()}
          </Text>
        </div>

        {/* CTA button neobrutalist (da C) */}
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <Button
            href="https://ilcovodixur.com"
            className="bg-[#4ade80] text-black text-[13px] font-black uppercase tracking-[0.05em] no-underline"
            style={{
              border: "2px solid #000",
              borderRadius: "6px",
              padding: "12px 28px",
              boxShadow: "3px 3px 0px 0px #000",
            }}
          >
            Continua lo shopping
          </Button>
        </div>

        {/* Help note (da A) */}
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

OrderPlacedTemplate.PreviewProps = {
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
        product_title: "Funko Pop! Naruto",
        variant_title: "Standard",
        quantity: 2,
        unit_price: 14.99,
      },
      {
        id: "item-2",
        title: "Pokemon TCG - Booster Box Scarlet & Violet",
        product_title: "Pokemon TCG Box",
        variant_title: null,
        quantity: 1,
        unit_price: 149.99,
      },
      {
        id: "item-3",
        title: "Dragon Ball Super Card Game - Zenkai Series Set 06",
        product_title: "DBS Card Game",
        variant_title: "Display Box",
        quantity: 1,
        unit_price: 89.99,
      },
    ],
    shipping_address: {
      first_name: "Marco",
      last_name: "Rossi",
      address_1: "Via Roma 42",
      city: "Milano",
      province: "MI",
      postal_code: "20100",
      country_code: "IT",
    },
    summary: { raw_current_order_total: { value: 269.96 } },
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
} as OrderPlacedPreviewProps;

export default OrderPlacedTemplate;
