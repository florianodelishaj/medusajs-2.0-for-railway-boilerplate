import { Button, Link, Section, Text, Hr, Img } from '@react-email/components'
import { Base } from './base'

/**
 * The key for the ResetPasswordEmail template, used to identify it
 */
export const RESET_PASSWORD = 'reset-password'

/**
 * The props for the ResetPasswordEmail template
 */
export interface ResetPasswordEmailProps {
  /**
   * The link that the user can click to reset their password
   */
  resetLink: string
  /**
   * The preview text for the email, appears next to the subject
   * in mail providers like Gmail
   */
  preview?: string
}

/**
 * Type guard for checking if the data is of type ResetPasswordEmailProps
 * @param data - The data to check
 */
export const isResetPasswordData = (data: any): data is ResetPasswordEmailProps =>
  typeof data.resetLink === 'string' && (typeof data.preview === 'string' || !data.preview)

/**
 * The ResetPasswordEmail template component built with react-email
 */
export const ResetPasswordEmail = ({
  resetLink,
  preview = 'Reimposta la tua password',
}: ResetPasswordEmailProps) => {
  return (
    <Base preview={preview}>
      <Section className="text-center mb-8">
        <table align="center" border={0} cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: '0 auto' }}>
          <tbody>
            <tr>
              <td style={{ paddingRight: '16px', verticalAlign: 'middle' }}>
                <Img
                  src={`${process.env.FRONTEND_URL || 'http://localhost:8000'}/images/logo.png`}
                  alt="Il Covo di Xur Logo"
                  width="50"
                  height="50"
                />
              </td>
              <td style={{ verticalAlign: 'middle' }}>
                <Text className="text-black text-[24px] font-bold uppercase tracking-wide" style={{ margin: 0, letterSpacing: '0.05em' }}>
                  IL COVO DI XUR
                </Text>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>
      <Hr className="border border-solid border-gray-300 my-6 mx-0 w-full" />
      <Section className="text-center mb-6">
        <Text className="text-black text-[32px] font-bold leading-[40px] mt-0 mb-2">
          Reimposta la tua password
        </Text>
        <Text className="text-gray-700 text-[16px] leading-[24px] mb-6">
          Hai richiesto di reimpostare la tua password. Clicca il pulsante qui sotto per procedere.
        </Text>
        <Section className="mt-6 mb-8">
          <Button
            className="bg-black text-white text-[14px] font-bold no-underline px-8 py-4 rounded-md border-2 border-solid border-black inline-block"
            href={resetLink}
          >
            Reimposta Password
          </Button>
        </Section>
        <Text className="text-gray-600 text-[14px] leading-[24px] mb-3">
          oppure copia e incolla questo URL nel tuo browser:
        </Text>
        <Text style={{
          maxWidth: '100%',
          wordBreak: 'break-all',
          overflowWrap: 'break-word',
          fontSize: '12px',
          color: '#0066cc'
        }}>
          <Link
            href={resetLink}
            className="text-blue-600 no-underline"
          >
            {resetLink}
          </Link>
        </Text>
      </Section>
      <Hr className="border-2 border-solid border-black my-6 mx-0 w-full" />
      <Text className="text-gray-600 text-[14px] leading-[24px] text-center">
        Se non hai richiesto questa reimpostazione, puoi ignorare questa email.
        Il link scadrà automaticamente dopo un certo periodo di tempo.
      </Text>
    </Base>
  )
}

ResetPasswordEmail.PreviewProps = {
  resetLink: 'https://mywebsite.com/reset-password?token=abc123&email=user@example.com'
} as ResetPasswordEmailProps

export default ResetPasswordEmail
