import { Text, Section, Hr, Row, Column, Link } from "@react-email/components";
import { RotateCcwIcon } from "./icons";
import { Base } from "./base";
import { OrderDTO } from "@medusajs/framework/types";

export const REFUND_PROCESSED = "refund-processed";

export interface RefundProcessedTemplateProps {
  order: OrderDTO & { display_id: string };
  refundAmount: number;
  currencyCode: string;
  customerName: string;
  reason?: string;
  preview?: string;
}

export const isRefundProcessedTemplateData = (
  data: any,
): data is RefundProcessedTemplateProps =>
  typeof data.order === "object" &&
  typeof data.refundAmount === "number" &&
  typeof data.customerName === "string";

export const RefundProcessedTemplate = ({
  order,
  refundAmount,
  currencyCode,
  customerName,
  reason,
  preview = "Il tuo rimborso è stato processato!",
}: RefundProcessedTemplateProps) => {
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
            <RotateCcwIcon
              size={28}
              color="#000"
              style={{ verticalAlign: "middle" }}
            />
          </div>
          <Text className="text-black text-[28px] font-black uppercase tracking-tight text-center m-0">
            Rimborso Processato
          </Text>
          <Text className="text-[#666] text-[14px] text-center m-0 mt-[6px]">
            Ordine #{order.display_id}
          </Text>
        </div>

        {/* Greeting */}
        <Text className="text-black text-[16px] leading-[24px] m-0 mb-[16px]">
          Ciao <strong>{customerName}</strong>,
        </Text>
        <Text className="text-[#444] text-[15px] leading-[24px] m-0 mb-[28px]">
          Ti confermiamo che il rimborso per il tuo ordine è stato processato.
          L&apos;importo verrà accreditato sul tuo metodo di pagamento originale
          entro 5-10 giorni lavorativi.
        </Text>

        {/* Refund details */}
        <div
          style={{
            backgroundColor: "#4ade80",
            border: "2px solid #000",
            borderRadius: "8px",
            padding: "16px 20px",
            marginBottom: "24px",
          }}
        >
          <Row>
            <Column>
              <Text className="text-black text-[15px] font-black uppercase m-0">
                Importo Rimborsato
              </Text>
            </Column>
            <Column style={{ textAlign: "right" }}>
              <Text className="text-black text-[20px] font-black m-0">
                {formatPrice(refundAmount, currencyCode)}
              </Text>
            </Column>
          </Row>
        </div>

        {reason && (
          <div
            style={{
              border: "2px solid #000",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "28px",
            }}
          >
            <Text className="text-black text-[12px] font-black uppercase tracking-[0.1em] m-0 mb-[10px]">
              Motivo del rimborso
            </Text>
            <Text className="text-[#444] text-[14px] leading-[22px] m-0">
              {reason}
            </Text>
          </div>
        )}

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

RefundProcessedTemplate.PreviewProps = {
  order: {
    id: "test-order-id",
    display_id: "1042",
  },
  refundAmount: 14999,
  currencyCode: "EUR",
  customerName: "Marco Rossi",
  reason: "Prodotto non conforme alla descrizione",
} as RefundProcessedTemplateProps;

export default RefundProcessedTemplate;
