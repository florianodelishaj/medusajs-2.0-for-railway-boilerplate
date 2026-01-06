import { SubscriberArgs, type SubscriberConfig } from '@medusajs/framework'

/**
 * Subscriber per invalidare la cache del frontend quando cambiano le categorie
 *
 * Eventi gestiti:
 * - product-category.created: nuova categoria creata
 * - product-category.updated: categoria modificata (nome, metadata, background, ecc.)
 * - product-category.deleted: categoria eliminata
 */
export default async function categoryCacheInvalidationHandler({
  event,
}: SubscriberArgs<any>) {
  console.log('[Category Cache Invalidation] Event triggered:', event.name, event.data)
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8000'
  const revalidateSecret = process.env.REVALIDATE_SECRET

  if (!frontendUrl) {
    console.warn('[Category Cache Invalidation] FRONTEND_URL not set, skipping cache invalidation')
    return
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (revalidateSecret) {
      headers['x-revalidate-secret'] = revalidateSecret
    }

    const url = `${frontendUrl}/api/revalidate?tag=categories`
    console.log('[Category Cache Invalidation] Calling revalidate endpoint:', url)

    const response = await fetch(url, {
      method: 'POST',
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Category Cache Invalidation] Failed to revalidate:', response.status, errorText)
    } else {
      const result = await response.json()
      console.log('[Category Cache Invalidation] Successfully revalidated:', result)
    }
  } catch (error) {
    console.error('[Category Cache Invalidation] Error:', error instanceof Error ? error.message : error)
  }
}

export const config: SubscriberConfig = {
  event: [
    'product-category.created',
    'product-category.updated',
    'product-category.deleted',
  ]
}
