import { supabaseClient } from '../config/supabase'

export interface Condo {
  id: string
  name: string
  address: string
  syndic_id: string
  units_count?: number
  city?: string
  postal_code?: string
  numero_immatriculation?: string
  periode_construction?: string
  type_syndic?: string
  date_immatriculation?: string
  nombre_lots_habitation?: number
  nombre_lots_stationnement?: number
  subscription_plan?: string
  referral_code?: string
  created_at: string
}

export interface CreateCondoInput {
  name: string
  address: string
  syndic_id: string
  units_count?: number
  city?: string
  postal_code?: string
  numero_immatriculation?: string
  periode_construction?: string
  type_syndic?: string
  date_immatriculation?: string
  nombre_lots_habitation?: number
  nombre_lots_stationnement?: number
  subscription_plan?: string
  referral_code?: string
}

export interface Company {
  id: string
  user_id: string
  name: string
  siret?: string
  specialties?: string[]
  rating?: number
  created_at: string
}

export class CondoService {
  async getCondosBySyndic(syndicId: string) {
    const { data, error } = await supabaseClient
      .from('condos')
      .select('*')
      .eq('syndic_id', syndicId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async getCondoById(condoId: string) {
    const { data, error } = await supabaseClient
      .from('condos')
      .select('*')
      .eq('id', condoId)
      .single()

    if (error) throw error
    return data
  }

  async createCondo(input: CreateCondoInput) {
    const { data, error } = await supabaseClient
      .from('condos')
      .insert(input)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateCondo(condoId: string, input: Partial<Condo>) {
    const { data, error } = await supabaseClient
      .from('condos')
      .update(input)
      .eq('id', condoId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteCondo(condoId: string) {
    const { error } = await supabaseClient
      .from('condos')
      .delete()
      .eq('id', condoId)

    if (error) throw error
    return { success: true }
  }

  async searchRegistry(query: string) {
    const { data, error } = await supabaseClient
      .from('coproprietes_registry')
      .select('*')
      .or(`ville.ilike.%${query}%,code_postal.ilike.%${query}%,adresse.ilike.%${query}%,numero_immatriculation.ilike.%${query}%`)
      .limit(20)

    if (error) throw error
    return data
  }
}

export class CompanyService {
  async getAllCompanies() {
    const { data, error } = await supabaseClient
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async getCompanyById(companyId: string) {
    const { data, error } = await supabaseClient
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single()

    if (error) throw error
    return data
  }

  async createCompany(input: Omit<Company, 'id' | 'created_at'>) {
    const { data, error } = await supabaseClient
      .from('companies')
      .insert(input)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateCompany(companyId: string, input: Partial<Company>) {
    const { data, error } = await supabaseClient
      .from('companies')
      .update(input)
      .eq('id', companyId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteCompany(companyId: string) {
    const { error } = await supabaseClient
      .from('companies')
      .delete()
      .eq('id', companyId)

    if (error) throw error
    return { success: true }
  }

  async getCompaniesBySpecialty(specialty: string) {
    const { data, error } = await supabaseClient
      .from('companies')
      .select('*')
      .contains('specialties', [specialty])

    if (error) throw error
    return data
  }
}

export const condoService = new CondoService()
export const companyService = new CompanyService()
