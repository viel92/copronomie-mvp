import pino from 'pino'

// Liste des champs sensibles à masquer dans les logs
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'access_token',
  'refresh_token',
  'accessToken',
  'refreshToken',
  'authorization',
  'cookie',
  'set-cookie',
  'confirmPassword',
  'newPassword',
  'oldPassword',
  'currentPassword',
  'apiKey',
  'api_key',
  'secret',
  'secretKey',
  'secret_key',
  'privateKey',
  'private_key',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_ANON_KEY',
]

// Configuration du logger sécurisé
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',

  // Masquer les champs sensibles
  redact: {
    paths: SENSITIVE_FIELDS,
    censor: '[REDACTED]',
  },

  // Format de sortie selon l'environnement
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        }
      : undefined,

  // Serializers personnalisés pour éviter de logger des données sensibles
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      path: req.path,
      // NE PAS logger les headers (peuvent contenir des tokens)
      // headers: req.headers,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
    err: pino.stdSerializers.err,
  },

  // Base des métadonnées
  base: {
    env: process.env.NODE_ENV || 'development',
  },
})

// Helper pour logger les événements d'authentification (sans données sensibles)
export const logAuth = {
  success: (context: { userId?: string; email?: string; method: string }) => {
    logger.info({
      event: 'auth_success',
      userId: context.userId,
      email: context.email ? maskEmail(context.email) : undefined,
      method: context.method,
    })
  },

  failure: (context: { email?: string; method: string; reason: string }) => {
    logger.warn({
      event: 'auth_failure',
      email: context.email ? maskEmail(context.email) : undefined,
      method: context.method,
      reason: context.reason,
    })
  },

  attempt: (context: { email?: string; method: string }) => {
    logger.info({
      event: 'auth_attempt',
      email: context.email ? maskEmail(context.email) : undefined,
      method: context.method,
    })
  },
}

// Helper pour masquer les emails (RGPD)
function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  if (!domain) return '[INVALID_EMAIL]'

  const maskedLocal =
    localPart.length <= 2
      ? '***'
      : localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1]

  return `${maskedLocal}@${domain}`
}

// Helper pour logger les requêtes HTTP (sans données sensibles)
export const logRequest = (context: {
  method: string
  path: string
  statusCode?: number
  duration?: number
  error?: string
}) => {
  const logData = {
    event: 'http_request',
    method: context.method,
    path: context.path,
    statusCode: context.statusCode,
    duration: context.duration,
    error: context.error,
  }

  if (context.error) {
    logger.error(logData)
  } else if (context.statusCode && context.statusCode >= 400) {
    logger.warn(logData)
  } else {
    logger.info(logData)
  }
}

// Helper pour logger les événements de sécurité
export const logSecurity = {
  rateLimitExceeded: (context: { ip: string; path: string; limit: number }) => {
    logger.warn({
      event: 'rate_limit_exceeded',
      ip: context.ip,
      path: context.path,
      limit: context.limit,
    })
  },

  csrfBlocked: (context: { origin: string; path: string }) => {
    logger.warn({
      event: 'csrf_blocked',
      origin: context.origin,
      path: context.path,
    })
  },

  corsRejected: (context: { origin: string }) => {
    logger.warn({
      event: 'cors_rejected',
      origin: context.origin,
    })
  },

  invalidToken: (context: { path: string; reason: string }) => {
    logger.warn({
      event: 'invalid_token',
      path: context.path,
      reason: context.reason,
    })
  },

  httpsRequired: (context: { path: string; method: string; proto: string }) => {
    logger.warn({
      event: 'https_required',
      path: context.path,
      method: context.method,
      proto: context.proto,
    }, 'HTTPS required but HTTP request received')
  },
}
