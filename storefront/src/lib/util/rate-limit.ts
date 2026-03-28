/**
 * In-memory rate limiter per brute force / spam protection.
 * Nota: si azzera al riavvio — sufficiente per istanza singola Railway.
 *
 * Logica blocco: una volta raggiunti maxAttempts, l'IP viene bloccato
 * per windowMs dall'ULTIMO tentativo. Ogni nuovo tentativo durante il blocco
 * resetta il timer — un attaccante che continua è bloccato indefinitamente.
 */

// count: tentativi accumulati — lastAttempt: timestamp dell'ultimo tentativo
// blockedAt: timestamp in cui il limite è stato raggiunto (undefined = non bloccato)
type Entry = { count: number; lastAttempt: number; blockedAt?: number }
type LimiterConfig = { maxAttempts: number; windowMs: number }

const limiters: Record<string, { config: LimiterConfig; store: Map<string, Entry> }> = {
  login:          { config: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, store: new Map() },
  signup:         { config: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, store: new Map() },
  forgotPassword: { config: { maxAttempts: 3, windowMs: 15 * 60 * 1000 }, store: new Map() },
}

/**
 * Blocca se:
 * - l'IP è stato bloccato (blockedAt presente) E il blocco non è scaduto
 * Il blocco scade windowMs dopo l'ULTIMO tentativo (anche durante il blocco).
 */
export function checkRateLimit(action: keyof typeof limiters, ip: string): { blocked: boolean } {
  const limiter = limiters[action]
  if (!limiter) return { blocked: false }

  const { windowMs } = limiter.config
  const entry = limiter.store.get(ip)

  if (!entry) return { blocked: false }

  const now = Date.now()

  // Se la finestra è scaduta dall'ultimo tentativo, resetta tutto
  if (now - entry.lastAttempt > windowMs) {
    limiter.store.delete(ip)
    return { blocked: false }
  }

  return { blocked: entry.blockedAt !== undefined }
}

export function recordFailure(action: keyof typeof limiters, ip: string): void {
  const limiter = limiters[action]
  if (!limiter) return

  const { maxAttempts, windowMs } = limiter.config
  const now = Date.now()
  const entry = limiter.store.get(ip)

  if (!entry || now - entry.lastAttempt > windowMs) {
    // Prima registrazione o finestra scaduta: ricomincia da 1
    limiter.store.set(ip, { count: 1, lastAttempt: now })
  } else {
    entry.count++
    entry.lastAttempt = now
    // Raggiunti i tentativi massimi: segna il blocco
    if (entry.count >= maxAttempts && entry.blockedAt === undefined) {
      entry.blockedAt = now
    }
  }
}

export function resetLimit(action: keyof typeof limiters, ip: string): void {
  limiters[action]?.store.delete(ip)
}
