import { translateErrorByCode } from "./error-messages"

export default function medusaError(error: any): never {
  // Medusa JS SDK v2 uses FetchError (not Axios)
  // FetchError has status, statusText, message, code, and type

  // Use the code-based translation (recommended by MedusaJS)
  const translatedMessage = translateErrorByCode(error)

  // Log the error details for debugging
  if (error.status && error.statusText) {
    console.error("Medusa API Error:", {
      status: error.status,
      statusText: error.statusText,
      code: error.code,
      type: error.type,
      message: error.message,
      translatedMessage,
    })
  }

  // Capitalize first letter and add period if not present
  const finalMessage = translatedMessage.charAt(0).toUpperCase() + translatedMessage.slice(1)
  throw new Error(finalMessage.endsWith(".") ? finalMessage : finalMessage + ".")
}
