const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  role: 'syndic' | 'company' | 'condo'
  companyName?: string
  firstName?: string
  lastName?: string
}

interface AuthResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    role: string
  }
  session?: {
    access_token: string
    refresh_token: string
    expires_at: number
  }
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    const result = await response.json()

    if (typeof window !== 'undefined' && result.session) {
      localStorage.setItem('access_token', result.session.access_token)
      localStorage.setItem('refresh_token', result.session.refresh_token)
      localStorage.setItem('user', JSON.stringify(result.user))
    }

    return result
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }

    return await response.json()
  },

  async logout(): Promise<void> {
    if (typeof window === 'undefined') return

    const token = localStorage.getItem('access_token')

    if (token) {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
    }

    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('access_token')
  },

  getUser(): any {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}