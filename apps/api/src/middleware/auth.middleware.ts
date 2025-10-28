import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { supabaseClient } from '../config/supabase'

export interface AuthUser {
  id: string
  email: string
  role?: string
  user_metadata?: any
}

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser
  }
}

// Cache pour éviter de valider le même token plusieurs fois
// Format: { token: { user: AuthUser, expiresAt: number } }
const tokenCache = new Map<string, { user: AuthUser; expiresAt: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Nettoyer le cache périodiquement
setInterval(() => {
  const now = Date.now()
  for (const [token, data] of tokenCache.entries()) {
    if (data.expiresAt < now) {
      tokenCache.delete(token)
    }
  }
}, 60 * 1000) // Nettoyer toutes les minutes

/**
 * Middleware to verify JWT token from Authorization header
 */
export const authMiddleware = async (c: Context, next: Next) => {
  const startTime = Date.now()

  try {
    const authHeader = c.req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('[Auth] No token provided:', {
        path: c.req.path,
        method: c.req.method,
      })
      throw new HTTPException(401, { message: 'No token provided' })
    }

    const token = authHeader.substring(7)

    // Vérifier le cache d'abord
    const cached = tokenCache.get(token)
    if (cached && cached.expiresAt > Date.now()) {
      c.set('user', cached.user)
      console.log('[Auth] Token validated from cache:', {
        userId: cached.user.id,
        duration: Date.now() - startTime + 'ms'
      })
      await next()
      return
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabaseClient.auth.getUser(token)

    if (error || !user) {
      console.warn('[Auth] Invalid token:', {
        error: error?.message,
        path: c.req.path,
      })
      tokenCache.delete(token)
      throw new HTTPException(401, { message: 'Invalid or expired token' })
    }

    // Add user to context
    const authUser: AuthUser = {
      id: user.id,
      email: user.email!,
      role: user.user_metadata?.role,
      user_metadata: user.user_metadata,
    }

    c.set('user', authUser)

    // Mettre en cache
    tokenCache.set(token, {
      user: authUser,
      expiresAt: Date.now() + CACHE_TTL,
    })

    console.log('[Auth] Token validated successfully:', {
      userId: user.id,
      role: authUser.role,
      duration: Date.now() - startTime + 'ms'
    })

    await next()
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error
    }
    console.error('[Auth] Authentication failed:', error)
    throw new HTTPException(401, { message: 'Authentication failed' })
  }
}

/**
 * Middleware to check if user has required role
 */
export const requireRole = (roles: string[]) => {
  return async (c: Context, next: Next) => {
    const user = c.get('user')

    if (!user || !user.role) {
      throw new HTTPException(403, { message: 'Access denied: No role assigned' })
    }

    if (!roles.includes(user.role)) {
      throw new HTTPException(403, {
        message: `Access denied: Required role(s): ${roles.join(', ')}`
      })
    }

    await next()
  }
}

/**
 * Optional auth middleware - doesn't throw if no token
 */
export const optionalAuth = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization')

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)

      // Vérifier le cache d'abord
      const cached = tokenCache.get(token)
      if (cached && cached.expiresAt > Date.now()) {
        c.set('user', cached.user)
        await next()
        return
      }

      const { data: { user } } = await supabaseClient.auth.getUser(token)

      if (user) {
        const authUser: AuthUser = {
          id: user.id,
          email: user.email!,
          role: user.user_metadata?.role,
          user_metadata: user.user_metadata,
        }

        c.set('user', authUser)

        // Mettre en cache
        tokenCache.set(token, {
          user: authUser,
          expiresAt: Date.now() + CACHE_TTL,
        })
      }
    }
  } catch (error) {
    // Silent fail - user remains undefined
    console.debug('[Auth] Optional auth failed silently:', error)
  }

  await next()
}

/**
 * Fonction utilitaire pour invalider un token du cache (lors de la déconnexion)
 */
export const invalidateToken = (token: string) => {
  tokenCache.delete(token)
  console.log('[Auth] Token invalidated from cache')
}