import { Text, Section, Hr, Link, Button } from "@react-email/components";
import { UserPlusIcon } from "./icons";
import { Base } from "./base";

export const WELCOME = "welcome";

export interface WelcomeTemplateProps {
  customerName: string;
  preview?: string;
}

export const isWelcomeTemplateData = (
  data: any,
): data is WelcomeTemplateProps => typeof data.customerName === "string";

export const WelcomeTemplate = ({
  customerName,
  preview = "Benvenuto nel Covo di Xur!",
}: WelcomeTemplateProps) => {
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
            <UserPlusIcon
              size={28}
              color="#000"
              style={{ verticalAlign: "middle" }}
            />
          </div>
          <Text className="text-black text-[28px] font-black uppercase tracking-tight text-center m-0">
            Benvenuto!
          </Text>
        </div>

        {/* Greeting */}
        <Text className="text-black text-[16px] leading-[24px] m-0 mb-[16px]">
          Ciao <strong>{customerName}</strong>,
        </Text>
        <Text className="text-[#444] text-[15px] leading-[24px] m-0 mb-[28px]">
          Il tuo account su <strong>Il Covo di Xur</strong> è stato creato con
          successo! Ora puoi esplorare il nostro catalogo di collezionabili,
          Funko Pop, carte e molto altro.
        </Text>

        {/* CTA button */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Button
            href="https://ilcovodixur.com"
            className="bg-[#4ade80] text-black text-[13px] font-black uppercase tracking-[0.05em] no-underline"
            style={{
              border: "2px solid #000",
              borderRadius: "6px",
              padding: "14px 32px",
              boxShadow: "3px 3px 0px 0px #000",
            }}
          >
            Inizia lo shopping
          </Button>
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

WelcomeTemplate.PreviewProps = {
  customerName: "Marco",
} as WelcomeTemplateProps;

export default WelcomeTemplate;
