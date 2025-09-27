import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'

export function createOpenAPIApp() {
  const app = new OpenAPIHono()

  app.doc('/api/openapi.json', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Copronomie API',
      description: 'API backend for Copronomie platform - Managing copropriété projects and quotes',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'auth', description: 'Authentication endpoints' },
      { name: 'users', description: 'User management' },
      { name: 'projects', description: 'Project management' },
    ],
  })

  app.get('/api/docs', swaggerUI({ url: '/api/openapi.json' }))

  return app
}