import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: { absolute: "Accedi | Il Covo di Xur" },
  description: "Accedi alla tua area personale.",
  robots: { index: false },
}

export default function Login() {
  return <LoginTemplate />
}
