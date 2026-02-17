import { SubscriberArgs, type SubscriberConfig } from '@medusajs/framework'
import { revalidateFrontendCache } from '../lib/revalidate-frontend'

/**
 * Subscriber per invalidare la cache del frontend quando cambiano le categorie
 */
export default async function categoryCacheInvalidationHandler({
  event,
}: SubscriberArgs<any>) {
  console.log('[Category Cache Invalidation] Event triggered:', event.name, event.data)
  await revalidateFrontendCache('categories', 'Category Cache Invalidation')
}

export const config: SubscriberConfig = {
  event: [
    'product-category.created',
    'product-category.updated',
    'product-category.deleted',
  ]
}
