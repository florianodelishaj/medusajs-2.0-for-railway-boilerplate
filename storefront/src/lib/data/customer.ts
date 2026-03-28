"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { checkRateLimit, recordFailure, resetLimit } from "@lib/util/rate-limit"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

function getClientIp(): string {
  return (
    headers().get("x-real-ip") ??
    headers().get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  )
}
import { cache } from "react"
import { getAuthHeaders, getCartId, removeAuthToken, setAuthToken } from "./cookies"

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
  const ip = getClientIp()

  const { blocked } = checkRateLimit("signup", ip)
  if (blocked) {
    return "Troppi tentativi di registrazione. Riprova tra un'ora."
  }

  const password = formData.get("password") as string

  if (!password || password.length < 8) {
    return "La password deve essere di almeno 8 caratteri."
  }

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

    const loginTokenValue = typeof loginToken === "string" ? loginToken : loginToken.location
    setAuthToken(loginTokenValue)
    revalidateTag("customer")

    const cartId = getCartId()
    if (cartId) {
      await sdk.store.cart
        .transferCart(cartId, {}, { authorization: `Bearer ${loginTokenValue}` })
        .catch(() => {})
      revalidateTag("cart")
    }

    return createdCustomer
  } catch (error: any) {
    recordFailure("signup", ip)
    return error.toString()
  }
}

export async function login(_currentState: unknown, formData: FormData) {
  const ip = getClientIp()
  const { blocked } = checkRateLimit("login", ip)
  if (blocked) {
    return "Troppi tentativi di accesso. Riprova tra 15 minuti."
  }

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    const token = await sdk.auth.login("customer", "emailpass", { email, password })
    const tokenValue = typeof token === "string" ? token : token.location

    resetLimit("login", ip)
    setAuthToken(tokenValue)
    revalidateTag("customer")
    revalidateTag("order")

    const cartId = getCartId()
    if (cartId) {
      await sdk.store.cart
        .transferCart(cartId, {}, { authorization: `Bearer ${tokenValue}` })
        .catch(() => {})
      revalidateTag("cart")
    }
  } catch (error: any) {
    recordFailure("login", ip)
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
  const ip = getClientIp()

  const { blocked } = checkRateLimit("forgotPassword", ip)
  if (blocked) {
    return { success: true, error: null }
  }

  recordFailure("forgotPassword", ip)

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

export const forgotPassword = async (
  _currentState: unknown,
  formData: FormData
): Promise<{ success: boolean; error: string | null }> => {
  const ip = getClientIp()

  const { blocked } = checkRateLimit("forgotPassword", ip)
  if (blocked) {
    // Risposta generica per non rivelare info
    return { success: true, error: null }
  }

  recordFailure("forgotPassword", ip)

  const email = formData.get("email") as string

  if (!email) {
    return { success: false, error: "Inserisci la tua email" }
  }

  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    await fetch(`${BACKEND_URL}/auth/customer/emailpass/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email }),
    })

    // Always return success to avoid email enumeration
    return { success: true, error: null }
  } catch {
    return { success: true, error: null }
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
