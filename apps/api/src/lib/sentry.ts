import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

export function initSentry() {
  const environment = process.env.NODE_ENV || 'development'
  const sentryDsn = process.env.SENTRY_DSN

  if (!sentryDsn) {
    console.warn('⚠️  SENTRY_DSN not configured. Error tracking disabled.')
    return
  }

  Sentry.init({
    dsn: sentryDsn,
    environment,
    integrations: [
      nodeProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
    // Profiling
    profilesSampleRate: environment === 'production' ? 0.1 : 1.0,
    // Filtrer les erreurs de santé check
    beforeSend(event, hint) {
      const error = hint.originalException as Error

      // Ne pas envoyer les erreurs de health check
      if (error?.message?.includes('/health')) {
        return null
      }

      return event
    },
  })

  console.log(`✅ Sentry initialized for ${environment}`)
}

export { Sentry }
