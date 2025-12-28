import { useFormState } from "react-dom"

import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import Input from "@modules/common/components/input"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { login } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useFormState(login, null)

  return (
    <div className="w-full" data-testid="login-page">
      <h1 className="text-4xl font-medium mb-8">Entra nel Covo di Xur</h1>
      <form className="w-full flex flex-col gap-6" action={formAction}>
        <Input
          label="Email"
          name="email"
          type="email"
          title="Enter a valid email address."
          autoComplete="email"
          required
          data-testid="email-input"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          data-testid="password-input"
        />
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton
          data-testid="sign-in-button"
          className="w-full h-12 bg-black text-white hover:bg-green-400 hover:text-black transition-all border border-black rounded-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px]"
        >
          Accedi
        </SubmitButton>
      </form>
    </div>
  )
}

export default Login
