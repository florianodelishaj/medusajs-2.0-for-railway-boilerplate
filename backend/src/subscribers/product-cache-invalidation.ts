import { SubscriberArgs, type SubscriberConfig } from '@medusajs/framework'

/**
 * Subscriber per invalidare la cache del frontend quando cambiano prodotti/prezzi
 *
 * Eventi gestiti AUTOMATICAMENTE:
 * - product.created: nuovo prodotto creato
 * - product.updated: prodotto modificato (titolo, descrizione, ecc.)
 * - product.deleted: prodotto eliminato
 * - product-variant.created: nuova variante creata
 * - product-variant.updated: variante modificata (prezzo, ecc.)
 * - product-variant.deleted: variante eliminata
 * - price-list.created: price list creata (via workflow custom)
 * - price-list.updated: price list modificata (via workflow custom)
 * - price-list.deleted: price list eliminata (via workflow custom)
 *
 * NOTA: L'inventario non viene cachato, quindi non serve invalidazione
 */
export default async function productCacheInvalidationHandler({
  event,
}: SubscriberArgs<any>) {
  console.log('[Cache Invalidation] Event triggered:', event.name, event.data)
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8000'
  const revalidateSecret = process.env.REVALIDATE_SECRET

  if (!frontendUrl) {
    console.warn('[Cache Invalidation] FRONTEND_URL not set, skipping cache invalidation')
    return
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (revalidateSecret) {
      headers['x-revalidate-secret'] = revalidateSecret
    }

    const url = `${frontendUrl}/api/revalidate?tag=products`
    console.log('[Cache Invalidation] Calling revalidate endpoint:', url)

    const response = await fetch(url, {
      method: 'POST',
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Cache Invalidation] Failed to revalidate:', response.status, errorText)
    } else {
      const result = await response.json()
      console.log('[Cache Invalidation] Successfully revalidated:', result)
    }
  } catch (error) {
    console.error('[Cache Invalidation] Error:', error instanceof Error ? error.message : error)
  }
}

export const config: SubscriberConfig = {
  event: [
    // Eventi prodotti (automatici)
    'product.created',
    'product.updated',
    'product.deleted',
    // Eventi varianti (automatici)
    'product-variant.created',
    'product-variant.updated',
    'product-variant.deleted',
    // Eventi price list (custom - emessi dai nostri workflow)
    'price-list.created',
    'price-list.updated',
    'price-list.deleted',
  ]
}
