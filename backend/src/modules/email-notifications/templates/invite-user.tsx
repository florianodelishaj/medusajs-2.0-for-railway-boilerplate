import { Text, Section, Hr, Link, Button } from "@react-email/components"
import { ShieldCheckIcon } from "./icons"
import { Base } from "./base"

export const INVITE_USER = "invite-user"

export interface InviteUserEmailProps {
  inviteLink: string
  preview?: string
}

export const isInviteUserData = (
  data: any
): data is InviteUserEmailProps =>
  typeof data.inviteLink === "string" &&
  (typeof data.preview === "string" || !data.preview)

export const InviteUserEmail = ({
  inviteLink,
  preview = "Sei stato invitato come amministratore!",
}: InviteUserEmailProps) => {
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
            <ShieldCheckIcon size={28} color="#000" style={{ verticalAlign: "middle" }} />
          </div>
          <Text className="text-black text-[28px] font-black uppercase tracking-tight text-center m-0">
            Invito Admin
          </Text>
        </div>

        {/* Body text */}
        <Text className="text-[#444] text-[15px] leading-[24px] m-0 mb-[28px]">
          Sei stato invitato come amministratore su{" "}
          <strong>Il Covo di Xur</strong>. Clicca il pulsante qui sotto per
          accettare l&apos;invito e configurare il tuo account.
        </Text>

        {/* CTA button */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Button
            href={inviteLink}
            className="bg-[#4ade80] text-black text-[13px] font-black uppercase tracking-[0.05em] no-underline"
            style={{
              border: "2px solid #000",
              borderRadius: "6px",
              padding: "14px 32px",
              boxShadow: "3px 3px 0px 0px #000",
            }}
          >
            Accetta Invito
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
          <Link href={inviteLink} className="text-[#4ade80] no-underline">
            {inviteLink}
          </Link>
        </Text>

        {/* Disclaimer */}
        <Hr className="border-[#e5e5e5] my-0 mx-0 w-full mb-[20px]" />
        <Text className="text-[#999] text-[13px] leading-[20px] text-center m-0">
          Se non ti aspettavi questo invito, puoi ignorare questa email.
          L&apos;invito scadrà dopo 24 ore.
        </Text>
      </Section>
    </Base>
  )
}

InviteUserEmail.PreviewProps = {
  inviteLink:
    "https://ilcovodixur.com/app/invite?token=abc123",
} as InviteUserEmailProps

export default InviteUserEmail
