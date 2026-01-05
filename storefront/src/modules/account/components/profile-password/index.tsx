"use client"

import React, { useEffect } from "react"

import AccountInfo from "../account-info"
import { useFormState } from "react-dom"
import { requestPasswordReset } from "@lib/data/customer"

const ProfilePassword: React.FC = () => {
  const [successState, setSuccessState] = React.useState(false)

  const [state, formAction] = useFormState(requestPasswordReset, {
    success: false,
    error: null,
  })

  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    setSuccessState(state?.success || false)
  }, [state])

  return (
    <form action={formAction} onReset={() => clearState()} className="w-full">
      <AccountInfo
        label="Password"
        currentInfo={
          <span>La password non viene mostrata per motivi di sicurezza</span>
        }
        isSuccess={successState}
        isError={!!state?.error}
        errorMessage={state?.error ?? undefined}
        successMessage="Ti abbiamo inviato un'email con il link per reimpostare la password"
        submitButtonText="Invia email"
        clearState={clearState}
        data-testid="account-password-editor"
      >
        <div className="text-small-regular">
          <p className="mb-3">
            Per motivi di sicurezza, non è possibile modificare direttamente la password.
            Clicca il pulsante qui sotto per ricevere un&apos;email con il link per reimpostare la password.
          </p>
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfilePassword
