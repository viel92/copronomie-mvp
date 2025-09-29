import { supabaseClient, supabaseAdmin } from '../config/supabase'

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
    const client = supabaseAdmin || supabaseClient

    const { data, error } = await client
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
    const client = supabaseAdmin || supabaseClient

    // Selectionner uniquement les colonnes necessaires
    const { data, error} = await client
      .from('coproprietes_registry')
      .select('numero_immatriculation, nom_usage_copropriete, numero_et_voie, adresse_reference, commune, commune_reference, code_postal_reference, nombre_total_lots, siret_representant_legal')
      .or(`commune.ilike.%${query}%,commune_reference.ilike.%${query}%,code_postal_reference.ilike.%${query}%,numero_et_voie.ilike.%${query}%,numero_immatriculation.ilike.%${query}%`)
      .limit(20)

    if (error) throw error
    return data
  }

  async searchBySiret(siret: string, filters?: { ville?: string; code_postal?: string; minLots?: number; maxLots?: number }) {
    console.log('🔍 searchBySiret called with:', { siret, filters })

    const client = supabaseAdmin || supabaseClient

    // Selectionner uniquement les colonnes necessaires (pas SELECT *)
    let query = client
      .from('coproprietes_registry')
      .select('numero_immatriculation, nom_usage_copropriete, numero_et_voie, adresse_reference, commune, commune_reference, code_postal_reference, nombre_total_lots, nombre_lots_habitation, nombre_lots_stationnement, periode_construction, type_syndic, date_immatriculation')
      .eq('siret_representant_legal', siret)

    if (filters?.ville) {
      query = query.or(`commune.ilike.%${filters.ville}%,commune_reference.ilike.%${filters.ville}%`)
    }

    if (filters?.code_postal) {
      // Recherche "commence par" pour permettre la recherche progressive
      query = query.ilike('code_postal_reference', `${filters.code_postal}%`)
    }

    if (filters?.minLots) {
      query = query.gte('nombre_total_lots', filters.minLots)
    }

    if (filters?.maxLots) {
      query = query.lte('nombre_total_lots', filters.maxLots)
    }

    // Limiter le nombre de resultats pour eviter les timeouts
    // Pas de .order() pour eviter le tri couteux sur 141 lignes (tri cote client si besoin)
    const { data, error } = await query.limit(500)

    if (error) {
      console.error('❌ Supabase error in searchBySiret:')
      console.error('  - code:', error.code)
      console.error('  - message:', error.message)
      console.error('  - details:', error.details)
      console.error('  - hint:', error.hint)
      throw error
    }

    console.log(`✅ Found ${data?.length || 0} results`)
    return data
  }

  async bulkCreateCondos(inputs: CreateCondoInput[]) {
    const client = supabaseAdmin || supabaseClient

    const { data, error } = await client
      .from('condos')
      .insert(inputs)
      .select()

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
