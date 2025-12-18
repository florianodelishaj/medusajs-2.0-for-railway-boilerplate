import { SubscriberConfig } from '@medusajs/medusa'

/**
 * Subscriber per invalidare la cache del frontend quando cambiano prodotti/prezzi
 *
 * Eventi gestiti AUTOMATICAMENTE:
 * - product.created: nuovo prodotto creato
 * - product.updated: prodotto modificato (titolo, descrizione, ecc.)
 * - product-variant.created: nuova variante creata
 * - product-variant.updated: variante modificata (prezzo, ecc.)
 * - price-list.updated: price list modificata (sconti)
 *
 * NOTA: L'inventario non viene cachato, quindi non serve invalidazione per inventory updates
 */
export default async function productCacheInvalidationHandler() {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8000'
  const revalidateSecret = process.env.REVALIDATE_SECRET

  if (!frontendUrl) {
    return
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (revalidateSecret) {
      headers['x-revalidate-secret'] = revalidateSecret
    }

    const response = await fetch(`${frontendUrl}/api/revalidate?tag=products`, {
      method: 'POST',
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Cache Invalidation] Failed to revalidate:', response.status, errorText)
    }
  } catch (error) {
    console.error('[Cache Invalidation] Error:', error instanceof Error ? error.message : error)
  }
}

export const config: SubscriberConfig = {
  event: [
    'product.created',
    'product.updated',
    'product.deleted',
    'product-variant.created',
    'product-variant.updated',
    'product-variant.deleted',
    'price-list.updated',
    'price-list.deleted',
  ]
}
