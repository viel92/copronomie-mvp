import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { supabaseClient } from '../config/supabase'
import { rateLimiter } from '../middleware/rateLimiter.middleware'
import { authMiddleware } from '../middleware/auth.middleware'

const app = new Hono()

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['syndic', 'company', 'condo']),
  companyName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Apply rate limiting to auth endpoints
app.use('*', rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }))

/**
 * POST /api/auth/register
 * Register a new user
 */
app.post('/register',
  zValidator('json', registerSchema),
  async (c) => {
    const data = c.req.valid('json')

    try {
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
      throw new HTTPException(500, { message: 'Registration failed' })
    }
  }
)

/**
 * POST /api/auth/login
 * Login user
 */
app.post('/login',
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
 */
app.post('/forgot-password',
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