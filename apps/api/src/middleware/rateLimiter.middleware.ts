import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'

interface RateLimitRecord {
  count: number
  resetTime: number
  requests: number[]  // Timestamps pour sliding window
}

interface RateLimitStore {
  [key: string]: RateLimitRecord
}

const store: RateLimitStore = {}

interface RateLimitOptions {
  windowMs?: number  // Time window in milliseconds
  max?: number      // Max requests per window
  message?: string  // Error message
  keyGenerator?: (c: Context) => string  // Function to generate unique key
  skipSuccessfulRequests?: boolean  // Ne pas compter les requêtes réussies
  skipFailedRequests?: boolean  // Ne pas compter les requêtes échouées
  identifier?: string  // Identifiant pour les logs
}

/**
 * Obtenir l'IP réelle du client en tenant compte des proxies
 */
const getClientIp = (c: Context): string => {
  // Ordre de priorité pour déterminer l'IP
  const ip =
    c.req.header('cf-connecting-ip') ||  // Cloudflare
    c.req.header('x-real-ip') ||  // Nginx
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||  // Load balancers
    'unknown'

  return ip
}

/**
 * Rate limiter avec sliding window amélioré
 *
 * NOTES DE PRODUCTION:
 * - Ce rate limiter utilise un stockage en mémoire
 * - Pour la production multi-instances, utiliser Redis/Upstash à la place
 * - Considérer l'utilisation de services comme Upstash Rate Limit ou Arcjet
 */
export const rateLimiter = (options: RateLimitOptions = {}) => {
  const {
    windowMs = 15 * 60 * 1000,  // 15 minutes par défaut
    max = 100,  // 100 requêtes par défaut
    message = 'Trop de requêtes, veuillez réessayer plus tard.',
    keyGenerator = (c) => {
      // Par défaut: combiner IP + user ID si authentifié
      const ip = getClientIp(c)
      const user = c.get('user')
      return user ? `${ip}:${user.id}` : ip
    },
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    identifier = 'global',
  } = options

  return async (c: Context, next: Next) => {
    const key = `${identifier}:${keyGenerator(c)}`
    const now = Date.now()

    // Initialiser ou nettoyer les anciennes requêtes (sliding window)
    if (!store[key]) {
      store[key] = {
        count: 0,
        resetTime: now + windowMs,
        requests: [],
      }
    }

    // Filtrer les requêtes qui sont encore dans la fenêtre
    store[key].requests = store[key].requests.filter(timestamp => timestamp > now - windowMs)

    // Vérifier si la limite est atteinte
    if (store[key].requests.length >= max) {
      const oldestRequest = store[key].requests[0]
      const retryAfter = Math.ceil((oldestRequest + windowMs - now) / 1000)

      c.header('Retry-After', retryAfter.toString())
      c.header('X-RateLimit-Limit', max.toString())
      c.header('X-RateLimit-Remaining', '0')
      c.header('X-RateLimit-Reset', new Date(oldestRequest + windowMs).toISOString())

      console.warn('[RateLimit] Limit exceeded:', {
        identifier,
        key,
        limit: max,
        window: windowMs / 1000 + 's',
        path: c.req.path,
      })

      throw new HTTPException(429, { message })
    }

    // Ajouter cette requête
    store[key].requests.push(now)
    store[key].count = store[key].requests.length

    // Headers de rate limiting
    const remaining = Math.max(0, max - store[key].count)
    c.header('X-RateLimit-Limit', max.toString())
    c.header('X-RateLimit-Remaining', remaining.toString())
    c.header('X-RateLimit-Reset', new Date(now + windowMs).toISOString())

    // Log si proche de la limite
    if (remaining <= 5) {
      console.warn('[RateLimit] Near limit:', {
        identifier,
        key,
        remaining,
        path: c.req.path,
      })
    }

    let requestError: Error | null = null

    try {
      await next()
    } catch (error) {
      requestError = error as Error
      throw error
    } finally {
      // Retirer cette requête du compteur selon les options
      const shouldSkip =
        (skipSuccessfulRequests && !requestError) ||
        (skipFailedRequests && requestError)

      if (shouldSkip && store[key]) {
        store[key].requests.pop()
        store[key].count = store[key].requests.length
      }
    }
  }
}

/**
 * Configurations pré-définies pour différents endpoints
 */
export const rateLimitPresets = {
  // Routes d'authentification (plus strictes)
  auth: () => rateLimiter({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 5,  // 5 tentatives
    message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
    identifier: 'auth',
  }),

  // API générale
  api: () => rateLimiter({
    windowMs: 60 * 1000,  // 1 minute
    max: 60,  // 60 requêtes par minute
    identifier: 'api',
  }),

  // Routes de création/modification (moyennement strictes)
  mutations: () => rateLimiter({
    windowMs: 60 * 1000,  // 1 minute
    max: 20,  // 20 requêtes par minute
    identifier: 'mutations',
  }),

  // Routes de lecture (plus permissives)
  queries: () => rateLimiter({
    windowMs: 60 * 1000,  // 1 minute
    max: 100,  // 100 requêtes par minute
    identifier: 'queries',
  }),

  // Upload de fichiers (très strictes)
  uploads: () => rateLimiter({
    windowMs: 60 * 60 * 1000,  // 1 heure
    max: 10,  // 10 uploads par heure
    message: 'Limite d\'uploads atteinte. Réessayez dans 1 heure.',
    identifier: 'uploads',
  }),
}

// Nettoyage périodique optimisé
let lastCleanup = Date.now()
const CLEANUP_INTERVAL = 5 * 60 * 1000  // 5 minutes

setInterval(() => {
  const now = Date.now()

  // Éviter les cleanups trop fréquents
  if (now - lastCleanup < CLEANUP_INTERVAL) {
    return
  }

  let cleaned = 0
  for (const key in store) {
    // Supprimer les entrées complètement expirées (aucune requête récente)
    if (store[key].requests.length === 0 ||
        store[key].requests.every(timestamp => timestamp < now - (60 * 60 * 1000))) {
      delete store[key]
      cleaned++
    }
  }

  if (cleaned > 0) {
    console.log('[RateLimit] Cleanup completed:', {
      entriesRemoved: cleaned,
      remainingEntries: Object.keys(store).length,
    })
  }

  lastCleanup = now
}, 60 * 1000)  // Vérifier toutes les minutes

/**
 * Fonction pour réinitialiser le rate limit d'une clé (pour les tests ou admin)
 */
export const resetRateLimit = (key: string) => {
  delete store[key]
  console.log('[RateLimit] Manually reset:', { key })
}

/**
 * Obtenir les stats actuelles du rate limiter
 */
export const getRateLimitStats = () => {
  return {
    totalKeys: Object.keys(store).length,
    entries: Object.entries(store).map(([key, data]) => ({
      key,
      count: data.count,
      remaining: data.requests.length,
      resetTime: data.resetTime,
    })),
  }
}