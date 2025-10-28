import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { logger } from '../lib/logger'

dotenv.config()

// CRITIQUE-5: Validation stricte de la configuration Supabase
if (!process.env.SUPABASE_URL) {
  const error = new Error(
    'SUPABASE_URL is required. This is a critical security configuration error.'
  )
  logger.fatal({ error, config: 'SUPABASE_URL' }, 'Missing critical configuration')
  throw error
}

if (!process.env.SUPABASE_ANON_KEY) {
  const error = new Error(
    'SUPABASE_ANON_KEY is required. This is a critical security configuration error.'
  )
  logger.fatal({ error, config: 'SUPABASE_ANON_KEY' }, 'Missing critical configuration')
  throw error
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  const error = new Error(
    'SUPABASE_SERVICE_ROLE_KEY is required for server operations. ' +
    'This is a critical security configuration error.'
  )
  logger.fatal({ error, config: 'SUPABASE_SERVICE_ROLE_KEY' }, 'Missing critical configuration')
  throw error
}

// CRITIQUE-4: Logging sécurisé (sans exposer les clés)
logger.info({
  event: 'supabase_config_loaded',
  url: process.env.SUPABASE_URL,
  hasAnonKey: !!process.env.SUPABASE_ANON_KEY,
  hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
}, 'Supabase configuration validated')

// Client for public operations (with RLS)
export const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Admin client for server operations (bypasses RLS)
// CRITIQUE-5: Validation garantit que SERVICE_ROLE_KEY existe toujours
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        'Prefer': 'return=representation',
        // Force schema reload on every request (workaround for PGRST cache bug)
        'Accept-Profile': 'public',
      },
    },
  }
)

export default supabaseClient