import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  environment: process.env.NODE_ENV || 'development',

  // Filtrer les erreurs non critiques
  beforeSend(event, hint) {
    const error = hint.originalException as Error

    // Ignorer les erreurs de health check
    if (error?.message?.includes('/api/health')) {
      return null
    }

    return event
  },
});
