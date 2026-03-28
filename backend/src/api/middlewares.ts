import {
  defineMiddlewares,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from '@medusajs/framework/http'
import { revalidateFrontendCache } from '../lib/revalidate-frontend'

function removeFingerprinting(
  _req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  res.removeHeader('x-powered-by')
  next()
}

// Rate limiter in-memory generico
type RateEntry = { count: number; lastAttempt: number; blockedAt?: number }

function createRateLimiter(maxAttempts: number, windowMs: number) {
  const store = new Map<string, RateEntry>()

  return function isBlocked(ip: string): boolean {
    const now = Date.now()
    const entry = store.get(ip)
    if (!entry || now - entry.lastAttempt > windowMs) {
      store.set(ip, { count: 1, lastAttempt: now })
      return false
    }
    entry.count++
    entry.lastAttempt = now
    if (entry.count >= maxAttempts && entry.blockedAt === undefined) {
      entry.blockedAt = now
    }
    return entry.blockedAt !== undefined
  }
}

const checkAdminLogin = createRateLimiter(5, 15 * 60 * 1000)
const checkAdminReset = createRateLimiter(3, 15 * 60 * 1000)

function getIp(req: MedusaRequest): string {
  return (
    (req.headers['x-real-ip'] as string) ??
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ??
    req.socket.remoteAddress ??
    'unknown'
  )
}

// Login admin: blocca con 429 dopo 5 tentativi falliti per IP
function adminLoginRateLimit(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const ip = getIp(req)

  // Controlla prima della chiamata (blocco attivo)
  if (checkAdminLogin(ip)) {
    res.status(429).json({ message: 'Troppi tentativi. Riprova tra 15 minuti.' })
    return
  }

  next()
}

// Reset password admin: registra sempre il tentativo (anti email-bombing)
// Risponde sempre con successo quando bloccato per non rivelare info
function adminResetRateLimit(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const ip = getIp(req)

  if (checkAdminReset(ip)) {
    // Blocco silenzioso — risposta generica per non rivelare se l'email esiste
    res.status(200).json({ success: true })
    return
  }

  next()
}

/**
 * Middleware per invalidare la cache del frontend quando vengono modificate le price list.
 * Medusa non emette eventi price-list.*, quindi intercettiamo le API admin mutations.
 */
function priceListCacheInvalidation(
  _req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  res.on('finish', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
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
      matcher: '/auth/user/emailpass/reset-password',
      method: ['POST'],
      middlewares: [adminResetRateLimit],
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
