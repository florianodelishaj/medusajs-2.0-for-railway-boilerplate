import {
  defineMiddlewares,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from '@medusajs/framework/http'
import { revalidateFrontendCache } from '../lib/revalidate-frontend'

function removeFingerprinting(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  res.removeHeader('x-powered-by')
  next()
}

// Rate limiter in-memory per l'admin login (max 5 tentativi per IP in 15 min)
type RateEntry = { count: number; lastAttempt: number; blockedAt?: number }
const adminLoginStore = new Map<string, RateEntry>()
const ADMIN_MAX_ATTEMPTS = 5
const ADMIN_WINDOW_MS = 15 * 60 * 1000

function adminLoginRateLimit(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const ip =
    (req.headers['x-real-ip'] as string) ??
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ??
    req.socket.remoteAddress ??
    'unknown'

  const now = Date.now()
  const entry = adminLoginStore.get(ip)

  if (entry) {
    if (now - entry.lastAttempt > ADMIN_WINDOW_MS) {
      adminLoginStore.delete(ip)
    } else if (entry.blockedAt !== undefined) {
      entry.lastAttempt = now
      res.status(429).json({ message: 'Troppi tentativi. Riprova tra 15 minuti.' })
      return
    }
  }

  res.on('finish', () => {
    if (res.statusCode === 401) {
      const current = adminLoginStore.get(ip)
      if (!current || now - current.lastAttempt > ADMIN_WINDOW_MS) {
        adminLoginStore.set(ip, { count: 1, lastAttempt: Date.now() })
      } else {
        current.count++
        current.lastAttempt = Date.now()
        if (current.count >= ADMIN_MAX_ATTEMPTS && current.blockedAt === undefined) {
          current.blockedAt = Date.now()
        }
      }
    } else if (res.statusCode === 200) {
      adminLoginStore.delete(ip)
    }
  })

  next()
}

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
      matcher: '/**',
      middlewares: [removeFingerprinting],
    },
    {
      matcher: '/auth/user/emailpass',
      method: ['POST'],
      middlewares: [adminLoginRateLimit],
    },
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
