import {
  defineMiddlewares,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from '@medusajs/framework/http'
import { revalidateFrontendCache } from '../lib/revalidate-frontend'

/**
 * Middleware per invalidare la cache del frontend quando vengono modificate le price list.
 * Medusa non emette eventi price-list.*, quindi intercettiamo le API admin mutations.
 */
function priceListCacheInvalidation(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  res.on('finish', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log(`[Price List Middleware] ${req.method} ${req.originalUrl} completed with ${res.statusCode}, invalidating cache`)
      revalidateFrontendCache('products', 'Price List Cache Invalidation')
    }
  })
  next()
}

export default defineMiddlewares({
  routes: [
    {
      matcher: '/admin/price-lists',
      method: ['POST'],
      middlewares: [priceListCacheInvalidation],
    },
    {
      matcher: '/admin/price-lists/:id',
      method: ['POST', 'DELETE'],
      middlewares: [priceListCacheInvalidation],
    },
    {
      matcher: '/admin/price-lists/:id/prices/batch',
      method: ['POST'],
      middlewares: [priceListCacheInvalidation],
    },
    {
      matcher: '/admin/price-lists/:id/products',
      method: ['POST'],
      middlewares: [priceListCacheInvalidation],
    },
  ],
})
