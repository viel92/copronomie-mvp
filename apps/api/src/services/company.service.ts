import { supabaseClient } from '../config/supabase'

export interface Company {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  specialties?: string[]
  rating?: number
  description?: string
  certification?: string
  website?: string
  syndic_id: string
  created_at: string
  updated_at: string
}

export interface CreateCompanyInput {
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  specialties?: string[]
  rating?: number
  description?: string
  certification?: string
  website?: string
  syndic_id: string
}

export interface UpdateCompanyInput {
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  specialties?: string[]
  rating?: number
  description?: string
  certification?: string
  website?: string
}

export class CompanyService {
  async getAllCompanies(userId: string) {
    const { data, error } = await supabaseClient
      .from('companies')
      .select('*')
      .eq('syndic_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async getCompanyById(id: string, userId: string) {
    const { data, error } = await supabaseClient
      .from('companies')
      .select('*')
      .eq('id', id)
      .eq('syndic_id', userId)
      .single()

    if (error) throw error
    return data
  }

  async createCompany(input: CreateCompanyInput) {
    const { data, error } = await supabaseClient
      .from('companies')
      .insert([input])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateCompany(id: string, input: UpdateCompanyInput, userId: string) {
    const { data, error } = await supabaseClient
      .from('companies')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('syndic_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteCompany(id: string, userId: string) {
    const { error } = await supabaseClient
      .from('companies')
      .delete()
      .eq('id', id)
      .eq('syndic_id', userId)

    if (error) throw error
  }
}

export const companyService = new CompanyService()