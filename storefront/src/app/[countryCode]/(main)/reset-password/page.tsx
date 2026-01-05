import { Metadata } from "next"
import ResetPasswordTemplate from "@modules/account/templates/reset-password-template"

export const metadata: Metadata = {
  title: "Reimposta Password",
  description: "Reimposta la tua password",
}

export default function ResetPassword() {
  return <ResetPasswordTemplate />
}
