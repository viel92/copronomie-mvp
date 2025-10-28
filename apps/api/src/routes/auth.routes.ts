import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { supabaseClient, supabaseAdmin } from '../config/supabase'
import { rateLimitPresets } from '../middleware/rateLimiter.supabase'
import { authMiddleware, invalidateToken } from '../middleware/auth.middleware'
import { sanitizePlainText } from '../lib/sanitize'

const app = new Hono()

// CRITIQUE-9: Validation de mot de passe fort
// Liste noire de mots de passe communs (top 100 des plus courants)
const COMMON_PASSWORDS = new Set([
  '123456', 'password', '123456789', '12345678', '12345', '1234567', '1234567890',
  'qwerty', 'abc123', '111111', '123123', 'admin', 'letmein', 'welcome', 'monkey',
  'password1', '1234', 'dragon', 'master', 'sunshine', 'princess', 'iloveyou',
  'football', 'shadow', 'superman', 'trustno1', 'passw0rd', 'baseball', 'batman',
])

const strongPasswordSchema = z.string()
  .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
  .max(128, 'Le mot de passe doit contenir moins de 128 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
  .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*...)')
  .refine((password) => {
    // Vérifier contre la liste de mots de passe communs
    const lowerPassword = password.toLowerCase()
    return !COMMON_PASSWORDS.has(lowerPassword)
  }, {
    message: 'Ce mot de passe est trop commun. Veuillez en choisir un plus sécurisé.',
  })
  .refine((password) => {
    // Vérifier qu'il n'y a pas de séquences répétitives (aaa, 111, etc.)
    const hasRepeatedChars = /(.)\1{2,}/.test(password)
    return !hasRepeatedChars
  }, {
    message: 'Le mot de passe ne doit pas contenir de caractères répétés (ex: aaa, 111)',
  })

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'), // Login: pas de validation stricte
})

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: strongPasswordSchema, // CRITIQUE-9: Utiliser le schéma de password fort
  confirmPassword: z.string(),
  role: z.enum(['syndic', 'company']),
  companyName: z.string().min(1, 'Company/Syndic name is required')
    .transform(val => sanitizePlainText(val)), // CRITIQUE-7: Sanitization
  firstName: z.string().optional()
    .transform(val => val ? sanitizePlainText(val) : val), // CRITIQUE-7: Sanitization
  lastName: z.string().optional()
    .transform(val => val ? sanitizePlainText(val) : val), // CRITIQUE-7: Sanitization
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const resetPasswordSchema = z.object({
  token: z.string(),
  password: strongPasswordSchema, // CRITIQUE-9: Utiliser le schéma de password fort
})

/**
 * POST /api/auth/register
 * Register a new user
 * Rate limited: 5 requêtes/15min par IP
 */
app.post('/register',
  rateLimitPresets.authRegister(),
  zValidator('json', registerSchema),
  async (c) => {
    const data = c.req.valid('json')

    try {
      // Create auth user
      const { data: authData, error } = await supabaseClient.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            role: data.role,
            company_name: data.companyName,
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      })

      if (error) {
        throw new HTTPException(400, { message: error.message })
      }

      if (!authData.user) {
        throw new HTTPException(400, { message: 'User creation failed' })
      }

      // Create role-specific entry using admin client
      if (!supabaseAdmin) {
        throw new HTTPException(500, { message: 'Admin client not configured' })
      }

      const userId = authData.user.id
      const userEmail = authData.user.email

      console.log('🔍 User created:', {
        userId,
        userEmail,
        role: data.role,
        identities: authData.user.identities?.length,
      })

      // Check if syndic/company entry already exists (maybe created by a trigger)
      if (data.role === 'syndic') {
        const { data: existingSyndic } = await supabaseAdmin
          .from('syndics')
          .select('id')
          .eq('user_id', userId)
          .single()

        console.log('🔍 Existing syndic entry:', existingSyndic ? 'YES' : 'NO')

        if (existingSyndic) {
          console.log('✅ Syndic entry already exists (probably created by trigger)')
        } else {
          console.log('📝 Creating syndic entry...')
          const { error: syndicError } = await supabaseAdmin
            .from('syndics')
            .insert({
              user_id: userId,
              company_info: data.companyName,
            })

          if (syndicError) {
            console.error('Error creating syndic entry:', syndicError)
            // Try to rollback auth user creation
            await supabaseAdmin.auth.admin.deleteUser(userId)
            throw new HTTPException(500, { message: 'Failed to create syndic profile' })
          }
        }
      } else if (data.role === 'company') {
        const { data: existingCompany } = await supabaseAdmin
          .from('companies')
          .select('id')
          .eq('user_id', userId)
          .single()

        console.log('🔍 Existing company entry:', existingCompany ? 'YES' : 'NO')

        if (existingCompany) {
          console.log('✅ Company entry already exists (probably created by trigger)')
        } else {
          console.log('📝 Creating company entry...')
          const { error: companyError } = await supabaseAdmin
            .from('companies')
            .insert({
              user_id: userId,
              name: data.companyName,
            })

          if (companyError) {
            console.error('Error creating company entry:', companyError)
            await supabaseAdmin.auth.admin.deleteUser(userId)
            throw new HTTPException(500, { message: 'Failed to create company profile' })
          }
        }
      }

      return c.json({
        success: true,
        message: 'Registration successful. Please check your email to confirm your account.',
        user: {
          id: authData.user?.id,
          email: authData.user?.email,
          role: data.role,
        },
      }, 201)
    } catch (error) {
      if (error instanceof HTTPException) throw error
      console.error('Registration error:', error)
      throw new HTTPException(500, { message: 'Registration failed' })
    }
  }
)

/**
 * POST /api/auth/login
 * Login user
 * Rate limited: 10 requêtes/15min par IP
 */
app.post('/login',
  rateLimitPresets.authLogin(),
  zValidator('json', loginSchema),
  async (c) => {
    const { email, password } = c.req.valid('json')

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new HTTPException(401, { message: 'Invalid credentials' })
      }

      return c.json({
        success: true,
        message: 'Login successful',
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.user_metadata?.role,
        },
        session: {
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
          expires_at: data.session?.expires_at,
        },
      })
    } catch (error) {
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Login failed' })
    }
  }
)

/**
 * POST /api/auth/logout
 * Logout user
 */
app.post('/logout',
  authMiddleware,
  async (c) => {
    try {
      // CRITIQUE-6: Invalider le token du cache avant de déconnecter
      const authHeader = c.req.header('Authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        invalidateToken(token)
      }

      const { error } = await supabaseClient.auth.signOut()

      if (error) {
        throw new HTTPException(400, { message: error.message })
      }

      return c.json({
        success: true,
        message: 'Logout successful',
      })
    } catch (error) {
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Logout failed' })
    }
  }
)

/**
 * POST /api/auth/forgot-password
 * Request password reset
 * Rate limited: 3 requêtes/1h par IP
 */
app.post('/forgot-password',
  rateLimitPresets.authForgotPassword(),
  zValidator('json', forgotPasswordSchema),
  async (c) => {
    const { email } = c.req.valid('json')

    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
      })

      if (error) {
        throw new HTTPException(400, { message: error.message })
      }

      return c.json({
        success: true,
        message: 'Password reset email sent',
      })
    } catch (error) {
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Failed to send password reset email' })
    }
  }
)

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
app.post('/reset-password',
  zValidator('json', resetPasswordSchema),
  async (c) => {
    const { token, password } = c.req.valid('json')

    try {
      const { error } = await supabaseClient.auth.updateUser({
        password,
      })

      if (error) {
        throw new HTTPException(400, { message: error.message })
      }

      return c.json({
        success: true,
        message: 'Password reset successful',
      })
    } catch (error) {
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Failed to reset password' })
    }
  }
)

/**
 * GET /api/auth/me
 * Get current user info
 */
app.get('/me',
  authMiddleware,
  async (c) => {
    const user = c.get('user')

    return c.json({
      success: true,
      user,
    })
  }
)

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
app.post('/refresh', async (c) => {
  const body = await c.req.json<{ refresh_token: string }>()

  try {
    const { data, error } = await supabaseClient.auth.refreshSession({
      refresh_token: body.refresh_token,
    })

    if (error) {
      throw new HTTPException(401, { message: 'Invalid refresh token' })
    }

    return c.json({
      success: true,
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at,
      },
    })
  } catch (error) {
    if (error instanceof HTTPException) throw error
    throw new HTTPException(500, { message: 'Failed to refresh token' })
  }
})

export default app