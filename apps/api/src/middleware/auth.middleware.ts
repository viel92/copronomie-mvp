import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { supabaseClient } from '../config/supabase'

export interface AuthUser {
  id: string
  email: string
  role?: string
  metadata?: any
}

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser
  }
}

/**
 * Middleware to verify JWT token from Authorization header
 */
export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HTTPException(401, { message: 'No token provided' })
    }

    const token = authHeader.substring(7)

    // Verify token with Supabase
    const { data: { user }, error } = await supabaseClient.auth.getUser(token)

    if (error || !user) {
      throw new HTTPException(401, { message: 'Invalid or expired token' })
    }

    // Add user to context
    c.set('user', {
      id: user.id,
      email: user.email!,
      role: user.user_metadata?.role,
      metadata: user.user_metadata,
    })

    await next()
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error
    }
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
      const { data: { user } } = await supabaseClient.auth.getUser(token)

      if (user) {
        c.set('user', {
          id: user.id,
          email: user.email!,
          role: user.user_metadata?.role,
          metadata: user.user_metadata,
        })
      }
    }
  } catch (error) {
    // Silent fail - user remains undefined
  }

  await next()
}