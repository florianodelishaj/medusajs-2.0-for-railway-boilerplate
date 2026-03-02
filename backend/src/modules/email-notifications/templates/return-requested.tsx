import { Text, Section, Hr, Row, Column, Link } from "@react-email/components";
import { Undo2Icon, CircleCheckIcon } from "./icons";
import { Base } from "./base";

export const RETURN_REQUESTED = "return-requested";

export interface ReturnRequestedTemplateProps {
  orderDisplayId: string;
  customerName: string;
  items: Array<{
    title: string;
    quantity: number;
  }>;
  returnStatus: "requested" | "received";
  preview?: string;
}

export const isReturnRequestedTemplateData = (
  data: any,
): data is ReturnRequestedTemplateProps =>
  typeof data.orderDisplayId === "string" &&
  typeof data.customerName === "string" &&
  Array.isArray(data.items);

export const ReturnRequestedTemplate = ({
  orderDisplayId,
  customerName,
  items,
  returnStatus,
  preview,
}: ReturnRequestedTemplateProps) => {
  const isReceived = returnStatus === "received";
  const defaultPreview = isReceived
    ? "Il tuo reso è stato ricevuto!"
    : "Il tuo reso è stato richiesto";

  return (
    <Base preview={preview || defaultPreview}>
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
            {isReceived ? (
              <CircleCheckIcon
                size={28}
                color="#000"
                style={{ verticalAlign: "middle" }}
              />
            ) : (
              <Undo2Icon
                size={28}
                color="#000"
                style={{ verticalAlign: "middle" }}
              />
            )}
          </div>
          <Text className="text-black text-[28px] font-black uppercase tracking-tight text-center m-0">
            {isReceived ? "Reso Ricevuto" : "Reso Richiesto"}
          </Text>
          <Text className="text-[#666] text-[14px] text-center m-0 mt-[6px]">
            Ordine #{orderDisplayId}
          </Text>
        </div>

        {/* Greeting */}
        <Text className="text-black text-[16px] leading-[24px] m-0 mb-[16px]">
          Ciao <strong>{customerName}</strong>,
        </Text>
        <Text className="text-[#444] text-[15px] leading-[24px] m-0 mb-[28px]">
          {isReceived ? (
            "Abbiamo ricevuto il tuo reso. Procederemo con la verifica e il rimborso il prima possibile."
          ) : (
            <>
              La tua richiesta di reso è stata registrata. Consulta la nostra{" "}
              <Link
                href="https://ilcovodixur.com/it/politica-resi"
                className="text-black font-medium underline"
              >
                Politica Resi
              </Link>{" "}
              per tutte le istruzioni su come procedere con la restituzione degli articoli.
            </>
          )}
        </Text>

        {/* Items to return */}
        <Text className="text-black text-[12px] font-black uppercase tracking-[0.1em] m-0 mb-[12px]">
          Articoli in reso
        </Text>

        {items.map((item, index) => (
          <div
            key={index}
            style={{
              border: "2px solid #000",
              borderRadius: "8px",
              padding: "14px 16px",
              marginBottom: "8px",
              backgroundColor: "#fff",
            }}
          >
            <Row>
              <Column style={{ width: "80%", verticalAlign: "middle" }}>
                <Text className="text-black text-[14px] font-bold m-0">
                  {item.title}
                </Text>
              </Column>
              <Column
                style={{
                  width: "20%",
                  textAlign: "right",
                  verticalAlign: "middle",
                }}
              >
                <Text className="text-[#666] text-[13px] m-0">
                  ×{item.quantity}
                </Text>
              </Column>
            </Row>
          </div>
        ))}

        {/* Status badge */}
        <div style={{ textAlign: "center", margin: "24px 0 28px" }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "#4ade80",
              border: "2px solid #000",
              borderRadius: "6px",
              padding: "8px 20px",
            }}
          >
            <Text className="text-black text-[12px] font-black uppercase tracking-[0.1em] m-0">
              {isReceived ? "Reso completato" : "In attesa di ricezione"}
            </Text>
          </div>
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

ReturnRequestedTemplate.PreviewProps = {
  orderDisplayId: "1042",
  customerName: "Marco Rossi",
  items: [
    { title: "Funko Pop! Naruto Uzumaki #727", quantity: 1 },
    { title: "Pokemon TCG - Booster Box Scarlet & Violet", quantity: 1 },
  ],
  returnStatus: "requested",
} as ReturnRequestedTemplateProps;

export default ReturnRequestedTemplate;
