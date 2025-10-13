import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session Replay
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filtrer les erreurs non critiques
  beforeSend(event, hint) {
    const error = hint.originalException as Error

    // Ignorer les erreurs réseau timeout mineures
    if (error?.message?.includes('timeout')) {
      return null
    }

    return event
  },

  environment: process.env.NODE_ENV || 'development',
});
