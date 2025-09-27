import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { secureHeaders } from 'hono/secure-headers'
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

dotenv.config()

const app = new Hono()
const apiDocsApp = createOpenAPIApp()

// Global middlewares
app.use('*', logger())
app.use('*', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use('*', secureHeaders())
app.use('*', prettyJSON())

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
  console.error(`${err}`)
  return c.json({
    error: err.name,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  }, 500)
})

const port = parseInt(process.env.PORT || '4000', 10)

console.log(`🚀 API Server starting on port ${port}`)

const server = serve({
  fetch: app.fetch,
  port,
  createServer: createServer as any
})

const wsManager = new WebSocketManager(server as any)

console.log(`✅ API Server running at http://localhost:${port}`)
console.log(`🔌 WebSocket Server running at ws://localhost:${port}/ws`)
console.log(`📚 API Documentation: http://localhost:${port}/api`)
console.log(`🏥 Health check: http://localhost:${port}/health`)

export { wsManager }