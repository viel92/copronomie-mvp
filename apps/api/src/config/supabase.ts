import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

console.log('🔑 Supabase config loaded:')
console.log('  - URL:', process.env.SUPABASE_URL)
console.log('  - Has ANON key:', !!process.env.SUPABASE_ANON_KEY)
console.log('  - Has SERVICE_ROLE key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

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
// Note: Service role key needed for admin operations
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
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
  : null

export default supabaseClient