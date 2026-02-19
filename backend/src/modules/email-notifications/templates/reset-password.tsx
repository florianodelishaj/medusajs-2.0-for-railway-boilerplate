import { Text, Section, Hr, Link, Button } from "@react-email/components"
import { KeyRoundIcon } from "./icons"
import { Base } from "./base"

export const RESET_PASSWORD = "reset-password"

export interface ResetPasswordEmailProps {
  resetLink: string
  preview?: string
}

export const isResetPasswordData = (
  data: any
): data is ResetPasswordEmailProps =>
  typeof data.resetLink === "string" &&
  (typeof data.preview === "string" || !data.preview)

export const ResetPasswordEmail = ({
  resetLink,
  preview = "Reimposta la tua password",
}: ResetPasswordEmailProps) => {
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
            <KeyRoundIcon size={28} color="#000" style={{ verticalAlign: "middle" }} />
          </div>
          <Text className="text-black text-[28px] font-black uppercase tracking-tight text-center m-0">
            Reimposta Password
          </Text>
        </div>

        {/* Body text */}
        <Text className="text-[#444] text-[15px] leading-[24px] m-0 mb-[28px]">
          Hai richiesto di reimpostare la tua password. Clicca il pulsante qui
          sotto per procedere.
        </Text>

        {/* CTA button */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Button
            href={resetLink}
            className="bg-[#4ade80] text-black text-[13px] font-black uppercase tracking-[0.05em] no-underline"
            style={{
              border: "2px solid #000",
              borderRadius: "6px",
              padding: "14px 32px",
              boxShadow: "3px 3px 0px 0px #000",
            }}
          >
            Reimposta Password
          </Button>
        </div>

        {/* Fallback link */}
        <Text className="text-[#999] text-[12px] text-center m-0 mb-[4px]">
          Oppure copia e incolla questo URL nel tuo browser:
        </Text>
        <Text
          className="text-[12px] text-center m-0 mb-[28px]"
          style={{
            maxWidth: "100%",
            wordBreak: "break-all",
            overflowWrap: "break-word",
          }}
        >
          <Link href={resetLink} className="text-[#4ade80] no-underline">
            {resetLink}
          </Link>
        </Text>

        {/* Disclaimer */}
        <Hr className="border-[#e5e5e5] my-0 mx-0 w-full mb-[20px]" />
        <Text className="text-[#999] text-[13px] leading-[20px] text-center m-0">
          Se non hai richiesto questa reimpostazione, puoi ignorare questa
          email. Il link scadrà automaticamente.
        </Text>
      </Section>
    </Base>
  )
}

ResetPasswordEmail.PreviewProps = {
  resetLink:
    "https://ilcovodixur.com/reset-password?token=abc123&email=user@example.com",
} as ResetPasswordEmailProps

export default ResetPasswordEmail
