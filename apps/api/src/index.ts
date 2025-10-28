import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { cors } from 'hono/cors'
import { logger as honoLogger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { secureHeaders } from 'hono/secure-headers'
import { bodyLimit } from 'hono/body-limit'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { trpcServer } from '@hono/trpc-server'

import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import projectRoutes from './routes/project.routes'
import { WebSocketManager } from './lib/websocket'
import { createOpenAPIApp } from './lib/openapi'
import { appRouter } from './trpc/routers'
import { createContext } from './trpc/context'
import { optionalAuth } from './middleware/auth.middleware'
import { initSentry, Sentry } from './lib/sentry'
import { logger, logSecurity } from './lib/logger'

dotenv.config()

// Initialize Sentry
initSentry()

const app = new Hono()
const apiDocsApp = createOpenAPIApp()

// Configuration CORS robuste multi-origines
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.STAGING_FRONTEND_URL,
  process.env.DEV_FRONTEND_URL,
].filter(Boolean)

// Global middlewares
app.use('*', honoLogger())

// HAUTE-4: Request Body Size Limits
// Protège contre les attaques DoS via de gros payloads
app.use('*', bodyLimit({
  maxSize: 1024 * 1024, // 1MB par défaut (suffisant pour JSON/form data)
  onError: (c) => {
    logger.warn({
      event: 'body_limit_exceeded',
      path: c.req.path,
      method: c.req.method,
      maxSize: '1MB',
    }, 'Request body size limit exceeded')

    return c.json({
      error: 'Payload trop volumineux',
      message: 'La taille de la requête dépasse la limite autorisée (1MB)',
      maxSize: '1MB',
    }, 413)
  },
}))

app.use('*', cors({
  origin: (origin) => {
    // Autoriser les requêtes sans origine (mobile apps, curl, Postman)
    if (!origin) return true

    // Vérifier contre la liste blanche
    if (allowedOrigins.includes(origin)) return true

    // En développement, autoriser tous les localhost
    if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
      return true
    }

    // Rejeter les autres origines
    logSecurity.corsRejected({ origin })
    return false
  },
  credentials: true,
  maxAge: 86400, // Cache preflight 24h
}))
app.use('*', secureHeaders())
app.use('*', prettyJSON())

// CRITIQUE-10: HTTPS Enforcement
// Force HTTPS en production pour protéger les données en transit
app.use('*', async (c, next) => {
  // Skip en développement local
  if (process.env.NODE_ENV === 'development') {
    return next()
  }

  // Vérifier si la requête est en HTTPS
  const proto = c.req.header('x-forwarded-proto') || c.req.header('x-forwarded-protocol')
  const isHttps = proto === 'https' || c.req.url.startsWith('https://')

  if (!isHttps) {
    logSecurity.httpsRequired({
      path: c.req.path,
      method: c.req.method,
      proto: proto || 'http',
    })

    throw new HTTPException(426, {
      message: 'HTTPS Required: Please use HTTPS to access this API',
      cause: { upgradeRequired: true }
    })
  }

  // Ajouter le header Strict-Transport-Security
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')

  return next()
})

// CSRF Protection (origin-based validation for API)
// For token-based auth APIs, we validate Origin/Referer headers
// This prevents CSRF attacks without requiring CSRF tokens
app.use('*', async (c, next) => {
  const path = c.req.path
  const method = c.req.method

  // Skip CSRF for safe methods (GET, HEAD, OPTIONS)
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return next()
  }

  // Skip CSRF for health check
  if (path === '/health') {
    return next()
  }

  // Validate Origin or Referer header for state-changing operations
  const origin = c.req.header('Origin')
  const referer = c.req.header('Referer')

  // Check if request has Origin or Referer (browser requests always have one)
  if (!origin && !referer) {
    // Allow requests without Origin/Referer (e.g., mobile apps, Postman)
    // These are protected by Bearer token validation
    return next()
  }

  // Validate Origin if present
  if (origin) {
    if (!allowedOrigins.includes(origin)) {
      // In development, allow localhost
      if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
        return next()
      }

      logSecurity.csrfBlocked({ origin, path: c.req.path })
      throw new HTTPException(403, {
        message: 'Forbidden: Invalid origin',
        cause: { origin, allowedOrigins }
      })
    }
  }

  // Validate Referer if Origin not present
  if (!origin && referer) {
    const refererOrigin = new URL(referer).origin
    if (!allowedOrigins.includes(refererOrigin)) {
      if (process.env.NODE_ENV === 'development' && refererOrigin.includes('localhost')) {
        return next()
      }

      logSecurity.csrfBlocked({ origin: refererOrigin, path: c.req.path })
      throw new HTTPException(403, {
        message: 'Forbidden: Invalid referer',
        cause: { referer: refererOrigin, allowedOrigins }
      })
    }
  }

  return next()
})

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  })
})

app.route('/', apiDocsApp)

 // tRPC routes with optional auth middleware
  app.use('/trpc/*', optionalAuth)
  app.use(
    '/trpc/*',
    trpcServer({
      router: appRouter,
      createContext,
    })
)

app.route('/api/auth', authRoutes)
app.route('/api/users', userRoutes)
app.route('/api/projects', projectRoutes)

// 404 handler
app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    message: `Route ${c.req.url} not found`,
  }, 404)
})

// Error handler
app.onError((err, c) => {
  // Log error sécurisé (pino gère automatiquement les stacktraces)
  logger.error({ err, path: c.req.path, method: c.req.method }, 'Request error')

  // Send error to Sentry (sauf rate limiting qui est normal)
  if (!(err instanceof HTTPException && err.status === 429)) {
    Sentry.captureException(err)
  }

  // Si c'est une HTTPException, utiliser son status
  if (err instanceof HTTPException) {
    return c.json({
      error: err.message,
      ...(err.cause && { details: err.cause }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    }, err.status)
  }

  // Autres erreurs: 500
  return c.json({
    error: err.name,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  }, 500)
})

const port = parseInt(process.env.PORT || '4000', 10)

logger.info({ port, env: process.env.NODE_ENV }, 'Starting API Server')

const server = serve({
  fetch: app.fetch,
  port,
  createServer: createServer as any,
}, (info) => {
  logger.info({
    port: info.port,
    endpoints: {
      api: `http://localhost:${info.port}`,
      ws: `ws://localhost:${info.port}/ws`,
      docs: `http://localhost:${info.port}/api`,
      health: `http://localhost:${info.port}/health`,
    },
  }, 'API Server started successfully')
})

const wsManager = new WebSocketManager(server as any)

export { wsManager }