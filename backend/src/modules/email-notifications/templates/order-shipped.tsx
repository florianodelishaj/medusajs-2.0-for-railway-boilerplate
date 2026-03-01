import {
  Text,
  Section,
  Hr,
  Row,
  Column,
  Link,
  Button,
} from "@react-email/components";
import { PackageIcon } from "./icons";
import { Base } from "./base";
import { OrderDTO, OrderAddressDTO } from "@medusajs/framework/types";

export const ORDER_SHIPPED = "order-shipped";

export interface OrderShippedTemplateProps {
  order: OrderDTO & { display_id: string };
  shippingAddress: OrderAddressDTO;
  trackingNumber?: string;
  trackingUrl?: string;
  preview?: string;
}

export const isOrderShippedTemplateData = (
  data: any,
): data is OrderShippedTemplateProps =>
  typeof data.order === "object" && typeof data.shippingAddress === "object";

export const OrderShippedTemplate = ({
  order,
  shippingAddress,
  trackingNumber,
  trackingUrl,
  preview = "Il tuo ordine è stato spedito!",
}: OrderShippedTemplateProps) => {
  console.log("trackingNumber", trackingNumber);
  console.log("trackingUrl", trackingUrl);
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
            <PackageIcon
              size={28}
              color="#000"
              style={{ verticalAlign: "middle" }}
            />
          </div>
          <Text className="text-black text-[28px] font-black uppercase tracking-tight text-center m-0">
            Ordine Spedito
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
          Il tuo ordine è stato spedito e sta arrivando da te!
        </Text>

        {/* Tracking info */}
        {trackingNumber && (
          <div
            style={{
              border: "2px solid #000",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "24px",
              backgroundColor: "#fff",
            }}
          >
            <Text className="text-black text-[12px] font-black uppercase tracking-[0.1em] m-0 mb-[10px]">
              Tracciamento Spedizione
            </Text>
            <Text className="text-[#444] text-[14px] m-0 mb-[4px]">
              <strong>Numero tracking:</strong> {trackingNumber}
            </Text>
            {trackingUrl && (
              <div style={{ marginTop: "12px" }}>
                <Button
                  href={trackingUrl}
                  className="bg-[#4ade80] text-black text-[12px] font-black uppercase tracking-[0.05em] no-underline"
                  style={{
                    border: "2px solid #000",
                    borderRadius: "6px",
                    padding: "10px 24px",
                    boxShadow: "3px 3px 0px 0px #000",
                  }}
                >
                  Traccia il pacco
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Shipping address */}
        <div
          style={{
            border: "2px solid #000",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "28px",
          }}
        >
          <Text className="text-black text-[12px] font-black uppercase tracking-[0.1em] m-0 mb-[10px]">
            Indirizzo di Consegna
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

        {/* Help note */}
        <Hr className="border-[#e5e5e5] my-0 mx-0 w-full mb-[20px]" />
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

OrderShippedTemplate.PreviewProps = {
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
  trackingNumber: "BRT-123456789",
  trackingUrl: "https://www.brt.it/tracking?id=BRT-123456789",
} as OrderShippedTemplateProps;

export default OrderShippedTemplate;
