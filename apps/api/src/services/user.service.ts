import { supabaseClient } from '../config/supabase'

export interface User {
  id: string
  email: string
  role: 'syndic' | 'company' | 'condo'
  company_name?: string
  first_name?: string
  last_name?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface UpdateUserInput {
  company_name?: string
  first_name?: string
  last_name?: string
  phone?: string
}

export class UserService {
  async getUserById(userId: string) {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  }

  async getAllUsers() {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async updateUser(userId: string, input: UpdateUserInput) {
    const { data, error } = await supabaseClient
      .from('users')
      .update(input)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteUser(userId: string) {
    const { error } = await supabaseClient
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) throw error
    return { success: true }
  }

  async getUsersByRole(role: User['role']) {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false})

    if (error) throw error
    return data
  }
}

export const userService = new UserService()
