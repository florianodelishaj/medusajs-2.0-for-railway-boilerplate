import { Metadata } from "next"
import ForgotPasswordTemplate from "@modules/account/templates/forgot-password-template"

export const metadata: Metadata = {
  title: "Password Dimenticata",
  description: "Richiedi il reset della password",
}

export default function ForgotPassword() {
  return <ForgotPasswordTemplate />
}
