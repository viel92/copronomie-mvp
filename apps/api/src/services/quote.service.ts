import { supabaseAdmin } from '../config/supabase'

export interface Quote {
  id: string
  project_id: string
  company_id: string
  total_amount: number
  total_ht?: number
  total_ttc?: number
  tva_rate?: number
  status: 'draft' | 'submitted' | 'accepted' | 'rejected'
  description?: string
  delay_days?: number
  pdf_url?: string
  details?: any
  created_at: string
  updated_at: string
}

export interface CreateQuoteInput {
  project_id: string
  company_id: string
  total_amount?: number
  total_ht?: number
  total_ttc?: number
  tva_rate?: number
  description?: string
  delay_days?: number
  pdf_url?: string
  details?: any
}

export interface UpdateQuoteInput {
  total_amount?: number
  total_ht?: number
  total_ttc?: number
  tva_rate?: number
  status?: Quote['status']
  details?: any
}

export class QuoteService {
  async getQuotesByProject(projectId: string) {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured')
    const { data, error } = await supabaseAdmin
      .from('quotes')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async getQuotesByCompany(companyId: string) {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured')
    const { data, error } = await supabaseAdmin
      .from('quotes')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async getQuoteById(quoteId: string) {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured')
    const { data, error } = await supabaseAdmin
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .single()

    if (error) throw error
    return data
  }

  async createQuote(input: CreateQuoteInput) {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured')

    // Prepare the insert data with defaults for NOT NULL columns
    const insertData: any = {
      ...input,
      status: 'draft',
      // Default values for NOT NULL columns
      total_amount: input.total_amount ?? 0,
      total_ht: input.total_ht ?? 0,
      total_ttc: input.total_ttc ?? 0,
    }

    // Handle both delay_days and delivery_days (depending on DB schema)
    if (input.delay_days !== undefined) {
      insertData.delay_days = input.delay_days
      insertData.delivery_days = input.delay_days // In case DB uses this name
    } else {
      insertData.delay_days = 30
      insertData.delivery_days = 30
    }

    const { data, error } = await supabaseAdmin
      .from('quotes')
      .insert(insertData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateQuote(quoteId: string, input: UpdateQuoteInput) {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured')
    const { data, error } = await supabaseAdmin
      .from('quotes')
      .update(input)
      .eq('id', quoteId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteQuote(quoteId: string) {
    if (!supabaseAdmin) throw new Error('Supabase admin client not configured')
    const { error } = await supabaseAdmin
      .from('quotes')
      .delete()
      .eq('id', quoteId)

    if (error) throw error
    return { success: true }
  }

  async submitQuote(quoteId: string) {
    return this.updateQuote(quoteId, { status: 'submitted' })
  }

  async acceptQuote(quoteId: string) {
    return this.updateQuote(quoteId, { status: 'accepted' })
  }

  async rejectQuote(quoteId: string) {
    return this.updateQuote(quoteId, { status: 'rejected' })
  }
}

export const quoteService = new QuoteService()