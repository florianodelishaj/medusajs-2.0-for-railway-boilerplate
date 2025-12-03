import { translateError } from "./error-messages"

export default function medusaError(error: any): never {
  // Medusa JS SDK v2 uses FetchError (not Axios)
  // FetchError has status, statusText, and message directly on the error object
  if (error.status && error.statusText) {
    console.error("Status code:", error.status)
    console.error("Status text:", error.statusText)
    console.error("Error message:", error.message)

    const message = error.message || `Request failed with status ${error.status}`
    const translatedMessage = translateError(message)
    throw new Error(
      translatedMessage.charAt(0).toUpperCase() + translatedMessage.slice(1) + "."
    )
  }

  // Fallback for other error types
  if (error.message) {
    const translatedMessage = translateError(error.message)
    throw new Error(
      translatedMessage.charAt(0).toUpperCase() + translatedMessage.slice(1) + "."
    )
  }

  throw new Error(translateError("An unknown error occurred"))
}
