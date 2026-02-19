import {
  Html,
  Body,
  Container,
  Preview,
  Tailwind,
  Head,
  Section,
  Text,
  Link,
} from "@react-email/components"
import * as React from "react"

interface BaseProps {
  preview?: string
  children: React.ReactNode
}

const STORE_URL = "https://ilcovodixur.com"

/**
 * Variante D — Mix A+C
 * Container con bordo nero (da C), header nero (da A), barra verde (da A),
 * footer nero (da A). Il meglio di entrambi.
 */
export const Base: React.FC<BaseProps> = ({ preview, children }) => {
  return (
    <Html>
      <Head />
      {preview && <Preview>{preview}</Preview>}
      <Tailwind>
        <Body className="bg-[#F4F4F0] my-auto mx-auto font-sans">
          <Container
            className="my-[40px] mx-auto max-w-[600px] w-full"
            style={{
              border: "3px solid #000",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* Header nero */}
            <Section className="bg-black px-[30px] py-[24px] text-center">
              <Text className="text-white text-[22px] font-black tracking-[0.05em] uppercase m-0">
                Il Covo di Xur
              </Text>
            </Section>

            {/* Green accent bar */}
            <div
              style={{
                height: "4px",
                backgroundColor: "#4ade80",
                width: "100%",
              }}
            />

            {/* Content */}
            <Section className="bg-white px-[30px] py-[32px]">
              <div className="max-w-full break-words">{children}</div>
            </Section>

            {/* Footer nero */}
            <Section
              className="bg-[#1a1a1a] px-[30px] py-[24px] text-center"
              style={{ borderTop: "3px solid #000" }}
            >
              <Text className="text-[#a1a1a1] text-[12px] leading-[18px] m-0 mb-[8px]">
                &copy; {new Date().getFullYear()} Il Covo di Xur — S.M.N.
                S.r.l.s.
              </Text>
              <Text className="text-[#a1a1a1] text-[12px] leading-[18px] m-0 mb-[12px]">
                Collezionabili, Funko Pop, Carte e molto altro.
              </Text>
              <Link
                href={STORE_URL}
                className="text-[#4ade80] text-[12px] font-bold uppercase tracking-[0.05em] no-underline"
              >
                Visita il negozio →
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
