import { SubscriberArgs, type SubscriberConfig } from '@medusajs/framework'
import { revalidateFrontendCache } from '../lib/revalidate-frontend'

/**
 * Subscriber per invalidare la cache del frontend quando cambiano prodotti/varianti
 *
 * Eventi gestiti:
 * - product.created/updated/deleted
 * - product-variant.created/updated/deleted
 *
 * NOTA: Per le price list, la cache viene invalidata tramite middleware API
 * (vedi src/api/middlewares.ts) perché Medusa non emette eventi price-list.*
 */
export default async function productCacheInvalidationHandler({
  event,
}: SubscriberArgs<any>) {
  console.log('[Product Cache Invalidation] Event triggered:', event.name, event.data)
  await revalidateFrontendCache('products', 'Product Cache Invalidation')
}

export const config: SubscriberConfig = {
  event: [
    'product.created',
    'product.updated',
    'product.deleted',
    'product-variant.created',
    'product-variant.updated',
    'product-variant.deleted',
  ]
}
