/**
 * Rate Limiter avec Supabase PostgreSQL
 * Solution robuste et distribuée sans service externe supplémentaire
 *
 * Avantages:
 * - Fonctionne multi-instances (distribué)
 * - Gratuit illimité avec abonnement Supabase
 * - Atomique grâce à PostgreSQL
 * - Une seule source de vérité
 */

import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { supabaseAdmin } from '../config/supabase'
import { logger, logSecurity } from '../lib/logger'

interface RateLimitOptions {
  windowSeconds?: number    // Fenêtre en secondes
  maxRequests?: number      // Max requêtes par fenêtre
  message?: string          // Message d'erreur
  identifier: string        // Identifiant unique: 'auth', 'api', 'mutations', etc.
  keyGenerator?: (c: Context) => string  // Fonction pour générer la clé
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  reset_at: string
  limit: number
}

/**
 * Obtenir l'IP réelle du client en tenant compte des proxies
 */
const getClientIp = (c: Context): string => {
  // Ordre de priorité pour déterminer l'IP
  const ip =
    c.req.header('cf-connecting-ip') ||      // Cloudflare
    c.req.header('x-real-ip') ||             // Nginx
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||  // Load balancers
    c.req.header('x-forwarded') ||
    '127.0.0.1'

  return ip
}

/**
 * Rate limiter distribué avec Supabase
 *
 * Utilise une fonction PostgreSQL atomique pour éviter les race conditions
 */
export const rateLimiterSupabase = (options: RateLimitOptions) => {
  const {
    windowSeconds = 900,  // 15 minutes par défaut
    maxRequests = 100,
    message = 'Trop de requêtes, veuillez réessayer plus tard.',
    identifier,
    keyGenerator = (c) => {
      // Par défaut: combiner IP + user ID si authentifié
      const ip = getClientIp(c)
      const user = c.get('user')
      return user ? `${ip}:${user.id}` : ip
    },
  } = options

  return async (c: Context, next: Next) => {
    // Vérifier que Supabase admin est disponible
    if (!supabaseAdmin) {
      console.error('[RateLimit] Supabase admin client not available')
      // En cas d'erreur de config, laisser passer (fail open) mais logger
      return await next()
    }

    const key = keyGenerator(c)
    const fullKey = `${identifier}:${key}`

    try {
      // Appeler la fonction PostgreSQL atomique
      const { data, error } = await supabaseAdmin.rpc('check_rate_limit', {
        p_identifier: identifier,
        p_key: key,
        p_max_requests: maxRequests,
        p_window_seconds: windowSeconds,
      })

      if (error) {
        console.error('[RateLimit] Database error:', error)
        // Fail open: permettre la requête en cas d'erreur DB
        return await next()
      }

      const result = data as RateLimitResult

      // Ajouter les headers de rate limiting (standard)
      c.header('X-RateLimit-Limit', result.limit.toString())
      c.header('X-RateLimit-Remaining', result.remaining.toString())
      c.header('X-RateLimit-Reset', new Date(result.reset_at).toISOString())

      // Si la limite est atteinte
      if (!result.allowed) {
        const resetDate = new Date(result.reset_at)
        const retryAfter = Math.ceil((resetDate.getTime() - Date.now()) / 1000)

        c.header('Retry-After', retryAfter.toString())

        logSecurity.rateLimitExceeded({
          ip: getClientIp(c),
          path: c.req.path,
          limit: maxRequests,
        })

        throw new HTTPException(429, {
          message,
          cause: {
            limit: result.limit,
            remaining: 0,
            resetAt: result.reset_at,
            retryAfter,
          }
        })
      }

      // Log si proche de la limite (< 10% restant)
      if (result.remaining <= Math.ceil(maxRequests * 0.1)) {
        logger.warn({
          event: 'rate_limit_near',
          identifier,
          remaining: result.remaining,
          limit: maxRequests,
          path: c.req.path,
        }, 'Rate limit nearly exceeded')
      }

      // Requête autorisée
      await next()

    } catch (error) {
      // Si c'est déjà une HTTPException 429, la re-lancer
      if (error instanceof HTTPException && error.status === 429) {
        throw error
      }

      // Autres erreurs: logger et fail open
      logger.error({ err: error, path: c.req.path }, 'Rate limiter error (failing open)')
      await next()
    }
  }
}

/**
 * Configurations pré-définies pour différents endpoints
 */
export const rateLimitPresets = {
  // Routes d'authentification (très strictes)
  authLogin: () => rateLimiterSupabase({
    windowSeconds: 900,  // 15 minutes
    maxRequests: 10,
    message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
    identifier: 'auth:login',
  }),

  authRegister: () => rateLimiterSupabase({
    windowSeconds: 900,  // 15 minutes
    maxRequests: 5,
    message: 'Trop de tentatives d\'inscription. Réessayez dans 15 minutes.',
    identifier: 'auth:register',
  }),

  authForgotPassword: () => rateLimiterSupabase({
    windowSeconds: 3600,  // 1 heure
    maxRequests: 3,
    message: 'Trop de demandes de réinitialisation. Réessayez dans 1 heure.',
    identifier: 'auth:forgot-password',
  }),

  // API générale
  apiGeneral: () => rateLimiterSupabase({
    windowSeconds: 60,  // 1 minute
    maxRequests: 60,
    identifier: 'api:general',
  }),

  // Routes de création/modification (moyennement strictes)
  apiMutations: () => rateLimiterSupabase({
    windowSeconds: 60,  // 1 minute
    maxRequests: 20,
    identifier: 'api:mutations',
  }),

  // Routes de lecture (plus permissives)
  apiQueries: () => rateLimiterSupabase({
    windowSeconds: 60,  // 1 minute
    maxRequests: 100,
    identifier: 'api:queries',
  }),

  // Upload de fichiers (très strictes)
  apiUploads: () => rateLimiterSupabase({
    windowSeconds: 3600,  // 1 heure
    maxRequests: 10,
    message: 'Limite d\'uploads atteinte. Réessayez dans 1 heure.',
    identifier: 'api:uploads',
  }),
}

/**
 * Fonction utilitaire pour réinitialiser un rate limit (admin/debug)
 */
export const resetRateLimit = async (identifier: string, key: string): Promise<boolean> => {
  if (!supabaseAdmin) {
    console.error('[RateLimit] Supabase admin client not available')
    return false
  }

  try {
    const { data, error } = await supabaseAdmin.rpc('reset_rate_limit', {
      p_identifier: identifier,
      p_key: key,
    })

    if (error) {
      console.error('[RateLimit] Reset error:', error)
      return false
    }

    console.log('[RateLimit] Manually reset:', { identifier, key })
    return data as boolean
  } catch (error) {
    console.error('[RateLimit] Reset exception:', error)
    return false
  }
}

/**
 * Obtenir les statistiques de rate limiting (monitoring)
 */
export const getRateLimitStats = async () => {
  if (!supabaseAdmin) {
    console.error('[RateLimit] Supabase admin client not available')
    return null
  }

  try {
    const { data, error } = await supabaseAdmin.rpc('get_rate_limit_stats')

    if (error) {
      console.error('[RateLimit] Stats error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('[RateLimit] Stats exception:', error)
    return null
  }
}

/**
 * Fonction de cleanup manuel (appeler via cron job ou admin endpoint)
 */
export const cleanupExpiredRateLimits = async (): Promise<number> => {
  if (!supabaseAdmin) {
    console.error('[RateLimit] Supabase admin client not available')
    return 0
  }

  try {
    const { data, error } = await supabaseAdmin.rpc('cleanup_expired_rate_limits')

    if (error) {
      console.error('[RateLimit] Cleanup error:', error)
      return 0
    }

    const deletedCount = data as number
    console.log('[RateLimit] Cleanup completed:', {
      entriesRemoved: deletedCount,
    })

    return deletedCount
  } catch (error) {
    console.error('[RateLimit] Cleanup exception:', error)
    return 0
  }
}
