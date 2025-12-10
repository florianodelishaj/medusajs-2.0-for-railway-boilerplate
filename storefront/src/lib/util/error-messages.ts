// Error code translations from English to Italian
// Using error codes as keys (more robust approach recommended by MedusaJS)
export const ERROR_CODE_TRANSLATIONS: Record<string, string> = {
  // Medusa API error codes
  invalid_request_error: "Richiesta non valida",
  api_error: "Errore del server",
  invalid_data: "Dati non validi",
  not_found: "Risorsa non trovata",
  not_allowed: "Operazione non consentita",
  unauthorized: "Non autorizzato",
  payment_authorization_error: "Errore di autorizzazione pagamento",
  duplicate_error: "Risorsa già esistente",

  // Custom application error codes
  cart_not_found: "Nessun carrello trovato",
  promotion_invalid: "Il codice promozionale non è valido",
  promotion_not_available:
    "Il codice promozionale non è disponibile o non soddisfa i requisiti",
  region_not_found: "Regione non trovata",
  unknown_error: "Si è verificato un errore sconosciuto",
}

// Fallback: message-based translations for backward compatibility
export const ERROR_MESSAGE_TRANSLATIONS: Record<string, string> = {
  "The promotion code  is invalid": "Il codice promozionale non è valido",
  "No existing cart found": "Nessun carrello trovato",
  "An unknown error occurred": "Si è verificato un errore sconosciuto",
  "Some variant does not have the required inventory":
    "Alcune varianti non dispongono dell'inventario richiesto.",
}

// Pattern-based translations (for dynamic messages)
const ERROR_PATTERNS: Array<{
  pattern: RegExp
  translate: (match: RegExpMatchArray) => string
}> = [
  {
    pattern: /The promotion code (.+?) is invalid/i,
    translate: (match) => `Il codice promozionale ${match[1]} non è valido`,
  },
  {
    pattern: /The promotion codes (.+?) are invalid/i,
    translate: (match) => `I codici promozionali ${match[1]} non sono validi`,
  },
  {
    pattern: /Region not found for country code: (.+)/i,
    translate: (match) =>
      `Regione non trovata per il codice paese: ${match[1]}`,
  },
]

/**
 * Translates an error using the error code (recommended by MedusaJS)
 * @param error - The error object from Medusa API
 * @returns The translated message in Italian
 */
export function translateErrorByCode(error: any): string {
  // Try to get the error code or type
  const code = error?.code || error?.type

  // If we have a code, try to translate it
  if (code && ERROR_CODE_TRANSLATIONS[code]) {
    return ERROR_CODE_TRANSLATIONS[code]
  }

  // Fallback to message-based translation
  const message = error?.message || String(error)
  return translateErrorMessage(message)
}

/**
 * Translates an error message from English to Italian (fallback method)
 * @param message - The error message in English
 * @returns The translated message in Italian, or the original if no translation found
 */
export function translateErrorMessage(message: string): string {
  // Remove trailing period if present
  const cleanMessage = message.trim().replace(/\.$/, "")

  // Try exact match first
  if (ERROR_MESSAGE_TRANSLATIONS[cleanMessage]) {
    return ERROR_MESSAGE_TRANSLATIONS[cleanMessage]
  }

  // Try pattern matching
  for (const { pattern, translate } of ERROR_PATTERNS) {
    const match = cleanMessage.match(pattern)
    if (match) {
      return translate(match)
    }
  }

  // If no translation found, return original message
  return message
}

/**
 * Legacy function for backward compatibility
 * Translates an error (accepts both error objects and strings)
 */
export function translateError(errorOrMessage: any): string {
  // If it's a string, use message-based translation
  if (typeof errorOrMessage === "string") {
    return translateErrorMessage(errorOrMessage)
  }

  // If it's an object, use code-based translation
  return translateErrorByCode(errorOrMessage)
}
