"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { cache } from "react"
import { getAuthHeaders, removeAuthToken, setAuthToken } from "./cookies"

export const getCustomer = cache(async function () {
  return await sdk.store.customer
    .retrieve({}, { next: { tags: ["customer"] }, ...getAuthHeaders() })
    .then(({ customer }) => customer)
    .catch(() => null)
})

export const updateCustomer = cache(async function (
  body: HttpTypes.StoreUpdateCustomer
) {
  const updateRes = await sdk.store.customer
    .update(body, {}, getAuthHeaders())
    .then(({ customer }) => customer)
    .catch(medusaError)

  revalidateTag("customer")
  return updateRes
})

export async function signup(_currentState: unknown, formData: FormData) {
  const password = formData.get("password") as string
  const customerForm = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    phone: formData.get("phone") as string,
  }

  try {
    const token = await sdk.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    })

    const customHeaders = { authorization: `Bearer ${token}` }
    
    const { customer: createdCustomer } = await sdk.store.customer.create(
      customerForm,
      {},
      customHeaders
    )

    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    })

    setAuthToken(typeof loginToken === 'string' ? loginToken : loginToken.location)

    revalidateTag("customer")
    return createdCustomer
  } catch (error: any) {
    return error.toString()
  }
}

export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await sdk.auth
      .login("customer", "emailpass", { email, password })
      .then((token) => {
        setAuthToken(typeof token === 'string' ? token : token.location)
        revalidateTag("customer")
      })
  } catch (error: any) {
    return error.toString()
  }
}

export async function signout(countryCode: string) {
  await sdk.auth.logout()
  removeAuthToken()
  revalidateTag("auth")
  revalidateTag("customer")
  redirect(`/${countryCode}/account`)
}

export const addCustomerAddress = async (
  _currentState: unknown,
  formData: FormData
): Promise<any> => {
  const address = {
    address_name: formData.get("address_name") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    phone: formData.get("phone") as string,
    is_default_billing: formData.get("is_default_billing") === "on",
  }

  return sdk.store.customer
    .createAddress(address, {}, getAuthHeaders())
    .then(({ customer }) => {
      revalidateTag("customer")
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const deleteCustomerAddress = async (
  addressId: string
): Promise<void> => {
  await sdk.store.customer
    .deleteAddress(addressId, getAuthHeaders())
    .then(() => {
      revalidateTag("customer")
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const addressId = currentState.addressId as string | undefined

  const address = {
    address_name: formData.get("address_name") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    phone: formData.get("phone") as string,
    is_default_billing: formData.get("is_default_billing") === "on",
  }

  // If no addressId or addressId is undefined/null, create a new address
  if (!addressId || addressId === 'undefined' || addressId === 'null') {
    return sdk.store.customer
      .createAddress(address, {}, getAuthHeaders())
      .then(() => {
        revalidateTag("customer")
        return { success: true, error: null, addressId }
      })
      .catch((err) => {
        return { success: false, error: err.toString(), addressId }
      })
  }

  return sdk.store.customer
    .updateAddress(addressId, address, {}, getAuthHeaders())
    .then(() => {
      revalidateTag("customer")
      return { success: true, error: null, addressId }
    })
    .catch((err) => {
      return { success: false, error: err.toString(), addressId }
    })
}

export const requestPasswordReset = async (
  _currentState: unknown,
  formData: FormData
): Promise<any> => {
  try {
    const customer = await getCustomer()
    if (!customer?.email) {
      return { success: false, error: "Cliente non trovato" }
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const response = await fetch(`${BACKEND_URL}/auth/customer/emailpass/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: customer.email,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || "Errore durante la richiesta di reset password"
      }
    }

    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message || error.toString() }
  }
}

export const resetPassword = async (
  _currentState: unknown,
  formData: FormData
): Promise<any> => {
  const token = formData.get("token") as string
  const email = formData.get("email") as string
  const newPassword = formData.get("new_password") as string
  const confirmPassword = formData.get("confirm_password") as string

  // Validazione lato server
  if (!token || !email || !newPassword || !confirmPassword) {
    return { success: false, error: "Tutti i campi sono obbligatori" }
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "Le password non coincidono" }
  }

  if (newPassword.length < 8) {
    return { success: false, error: "La password deve essere di almeno 8 caratteri" }
  }

  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const response = await fetch(`${BACKEND_URL}/auth/customer/emailpass/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: email,
        password: newPassword,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || "Errore durante l'aggiornamento della password"
      }
    }

    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message || error.toString() }
  }
}
