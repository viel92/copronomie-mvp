import { supabaseClient } from '../config/supabase'

export interface Quote {
  id: string
  project_id: string
  company_id: string
  amount: number
  status: 'draft' | 'submitted' | 'accepted' | 'rejected'
  details?: any
  created_at: string
  updated_at: string
}

export interface CreateQuoteInput {
  project_id: string
  company_id: string
  amount: number
  details?: any
}

export interface UpdateQuoteInput {
  amount?: number
  status?: Quote['status']
  details?: any
}

export class QuoteService {
  async getQuotesByProject(projectId: string) {
    const { data, error } = await supabaseClient
      .from('quotes')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async getQuotesByCompany(companyId: string) {
    const { data, error } = await supabaseClient
      .from('quotes')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async getQuoteById(quoteId: string) {
    const { data, error } = await supabaseClient
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .single()

    if (error) throw error
    return data
  }

  async createQuote(input: CreateQuoteInput) {
    const { data, error } = await supabaseClient
      .from('quotes')
      .insert({
        ...input,
        status: 'draft'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateQuote(quoteId: string, input: UpdateQuoteInput) {
    const { data, error } = await supabaseClient
      .from('quotes')
      .update(input)
      .eq('id', quoteId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteQuote(quoteId: string) {
    const { error } = await supabaseClient
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