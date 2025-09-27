import { supabaseClient } from '../config/supabase'

export interface RegisterInput {
  email: string
  password: string
  role: 'syndic' | 'company' | 'condo'
  companyName?: string
  firstName?: string
  lastName?: string
}

export interface LoginInput {
  email: string
  password: string
}

export class AuthService {
  async register(input: RegisterInput) {
    const { data: authData, error } = await supabaseClient.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          role: input.role,
          company_name: input.companyName,
          first_name: input.firstName,
          last_name: input.lastName,
        },
      },
    })

    if (error) throw error
    return authData
  }

  async login(input: LoginInput) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    })

    if (error) throw error
    return data
  }

  async logout() {
    const { error } = await supabaseClient.auth.signOut()
    if (error) throw error
    return { success: true }
  }

  async resetPasswordRequest(email: string, redirectUrl: string) {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })

    if (error) throw error
    return { success: true }
  }

  async updatePassword(newPassword: string) {
    const { error } = await supabaseClient.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
    return { success: true }
  }

  async refreshSession(refreshToken: string) {
    const { data, error } = await supabaseClient.auth.refreshSession({
      refresh_token: refreshToken,
    })

    if (error) throw error
    return data
  }

  async verifyToken(token: string) {
    const { data, error } = await supabaseClient.auth.getUser(token)

    if (error) throw error
    return data.user
  }
}

export const authService = new AuthService()