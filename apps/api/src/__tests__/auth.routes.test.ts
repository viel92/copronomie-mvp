import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'
import authRoutes from '../routes/auth.routes'

const app = new Hono()
app.route('/api/auth', authRoutes)

vi.mock('../config/supabase', () => ({
  supabaseClient: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
      refreshSession: vi.fn(),
    },
  },
}))

vi.mock('../middleware/rateLimiter.middleware', () => ({
  rateLimiter: () => async (c: any, next: any) => next(),
}))

describe('Auth Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/auth/register', () => {
    it.skip('should register a new user successfully', async () => {
      const { supabaseClient } = await import('../config/supabase')

      vi.mocked(supabaseClient.auth.signUp).mockResolvedValue({
        data: {
          user: {
            id: '123',
            email: 'test@example.com',
            user_metadata: { role: 'syndic' },
          },
          session: null,
        },
        error: null,
      } as any)

      const res = await app.request('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
          role: 'syndic',
        }),
      })

      expect(res.status).toBe(201)
      const json = await res.json()
      expect(json.success).toBe(true)
      expect(json.user.email).toBe('test@example.com')
    })

    it('should reject invalid email', async () => {
      const res = await app.request('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'password123',
          confirmPassword: 'password123',
          role: 'syndic',
        }),
      })

      expect(res.status).toBe(400)
    })

    it('should reject password mismatch', async () => {
      const res = await app.request('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'different',
          role: 'syndic',
        }),
      })

      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const { supabaseClient } = await import('../config/supabase')

      vi.mocked(supabaseClient.auth.signInWithPassword).mockResolvedValue({
        data: {
          user: {
            id: '123',
            email: 'test@example.com',
            user_metadata: { role: 'syndic' },
          },
          session: {
            access_token: 'token',
            refresh_token: 'refresh',
            expires_at: 123456,
          },
        },
        error: null,
      } as any)

      const res = await app.request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      })

      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.success).toBe(true)
      expect(json.session.access_token).toBe('token')
    })

    it('should reject invalid credentials', async () => {
      const { supabaseClient } = await import('../config/supabase')

      vi.mocked(supabaseClient.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' } as any,
      } as any)

      const res = await app.request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrong',
        }),
      })

      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/auth/forgot-password', () => {
    it('should send password reset email', async () => {
      const { supabaseClient } = await import('../config/supabase')

      vi.mocked(supabaseClient.auth.resetPasswordForEmail).mockResolvedValue({
        data: {},
        error: null,
      } as any)

      const res = await app.request('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      })

      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.success).toBe(true)
    })
  })

  describe('POST /api/auth/refresh', () => {
    it('should refresh access token', async () => {
      const { supabaseClient } = await import('../config/supabase')

      vi.mocked(supabaseClient.auth.refreshSession).mockResolvedValue({
        data: {
          session: {
            access_token: 'new_token',
            refresh_token: 'new_refresh',
            expires_at: 789012,
          },
          user: null,
        },
        error: null,
      } as any)

      const res = await app.request('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refresh_token: 'old_refresh',
        }),
      })

      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.success).toBe(true)
      expect(json.session.access_token).toBe('new_token')
    })
  })
})