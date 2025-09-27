import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

interface RateLimitOptions {
  windowMs?: number  // Time window in milliseconds
  max?: number      // Max requests per window
  message?: string  // Error message
  keyGenerator?: (c: Context) => string  // Function to generate unique key
}

/**
 * Simple in-memory rate limiting middleware
 */
export const rateLimiter = (options: RateLimitOptions = {}) => {
  const {
    windowMs = 15 * 60 * 1000,  // 15 minutes default
    max = 100,  // 100 requests default
    message = 'Too many requests, please try again later.',
    keyGenerator = (c) => c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'anonymous',
  } = options

  return async (c: Context, next: Next) => {
    const key = keyGenerator(c)
    const now = Date.now()

    if (!store[key]) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      }
    } else if (store[key].resetTime < now) {
      // Window expired, reset
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      }
    } else {
      // Within window
      store[key].count++

      if (store[key].count > max) {
        const retryAfter = Math.ceil((store[key].resetTime - now) / 1000)
        c.header('Retry-After', retryAfter.toString())
        c.header('X-RateLimit-Limit', max.toString())
        c.header('X-RateLimit-Remaining', '0')
        c.header('X-RateLimit-Reset', new Date(store[key].resetTime).toISOString())

        throw new HTTPException(429, { message })
      }
    }

    // Add rate limit headers
    c.header('X-RateLimit-Limit', max.toString())
    c.header('X-RateLimit-Remaining', Math.max(0, max - store[key].count).toString())
    c.header('X-RateLimit-Reset', new Date(store[key].resetTime).toISOString())

    await next()
  }
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  }
}, 60 * 1000)  // Clean every minute