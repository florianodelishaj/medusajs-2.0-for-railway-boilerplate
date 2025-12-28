"use client"

import { useFormState } from "react-dom"

import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useFormState(signup, null)

  return (
    <div className="w-full" data-testid="register-page">
      <h1 className="text-4xl font-medium mb-8">Entra nel Covo di Xur</h1>
      <form className="w-full flex flex-col gap-6" action={formAction}>
        <Input
          label="Nome"
          name="first_name"
          required
          autoComplete="given-name"
          data-testid="first-name-input"
        />
        <Input
          label="Cognome"
          name="last_name"
          required
          autoComplete="family-name"
          data-testid="last-name-input"
        />
        <Input
          label="Email"
          name="email"
          required
          type="email"
          autoComplete="email"
          data-testid="email-input"
        />
        <Input
          label="Telefono"
          name="phone"
          type="tel"
          autoComplete="tel"
          data-testid="phone-input"
        />
        <Input
          label="Password"
          name="password"
          required
          type="password"
          autoComplete="new-password"
          data-testid="password-input"
        />
        <ErrorMessage error={message} data-testid="register-error" />
        <span className="text-sm text-gray-700">
          Creando un account, accetti la{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="underline hover:text-green-600"
          >
            Informativa sulla Privacy
          </LocalizedClientLink>{" "}
          e i{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline hover:text-green-600"
          >
            Termini di utilizzo
          </LocalizedClientLink>
          .
        </span>

        <SubmitButton
          className="w-full h-12 bg-black text-white hover:bg-green-400 hover:text-black transition-all border border-black rounded-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px]"
          data-testid="register-button"
        >
          Registrati
        </SubmitButton>
      </form>
    </div>
  )
}

export default Register
