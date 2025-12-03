// Error message translations from English to Italian
export const ERROR_TRANSLATIONS: Record<string, string> = {
  // Promotion/Discount errors
  "The promotion code {code} is invalid": "Il codice promozionale {code} non è valido",
  "The promotion code is not available or does not meet the requirements":
    "Il codice promozionale non è disponibile o non soddisfa i requisiti",

  // Cart errors
  "No existing cart found": "Nessun carrello trovato",
  "No existing cart found, please create one before updating":
    "Nessun carrello trovato, creane uno prima di aggiornare",
  "Missing variant ID when adding to cart": "ID variante mancante durante l'aggiunta al carrello",
  "Error retrieving or creating cart": "Errore nel recupero o creazione del carrello",
  "Missing lineItem ID when updating line item":
    "ID articolo mancante durante l'aggiornamento",
  "Missing cart ID when updating line item":
    "ID carrello mancante durante l'aggiornamento dell'articolo",
  "Missing lineItem ID when deleting line item":
    "ID articolo mancante durante l'eliminazione",
  "Missing cart ID when deleting line item":
    "ID carrello mancante durante l'eliminazione dell'articolo",

  // Region errors
  "Region not found for country code": "Regione non trovata per il codice paese {code}",

  // Order errors
  "No existing cart found when placing an order":
    "Nessun carrello trovato durante l'invio dell'ordine",
  "No existing cart found when setting addresses":
    "Nessun carrello trovato durante l'impostazione degli indirizzi",
  "No form data found when setting addresses":
    "Dati del modulo mancanti durante l'impostazione degli indirizzi",

  // Generic errors
  "An unknown error occurred": "Si è verificato un errore sconosciuto",
  "Bad Request": "Richiesta non valida",
  "Unauthorized": "Non autorizzato",
  "Forbidden": "Accesso negato",
  "Not Found": "Non trovato",
  "Internal Server Error": "Errore interno del server",
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
    translate: (match) => `Regione non trovata per il codice paese: ${match[1]}`,
  },
]

/**
 * Translates an error message from English to Italian
 * @param message - The error message in English
 * @returns The translated message in Italian, or the original if no translation found
 */
export function translateError(message: string): string {
  // Remove trailing period if present
  const cleanMessage = message.trim().replace(/\.$/, "")

  // Try exact match first
  if (ERROR_TRANSLATIONS[cleanMessage]) {
    return ERROR_TRANSLATIONS[cleanMessage]
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
