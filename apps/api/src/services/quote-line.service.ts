import { supabaseAdmin } from '../config/supabase'

if (!supabaseAdmin) {
  throw new Error('Supabase admin client is not configured. Please check your environment variables.')
}

// Type assertion: supabaseAdmin is guaranteed to be non-null after the check above
const supabase = supabaseAdmin!

export interface QuoteLine {
  id: string
  quote_id: string
  description: string
  quantity: number
  unit_price_ht: number
  total_ht: number
  vat_rate: number
  total_vat: number
  total_ttc: number
  line_order: number
  created_at: string
  updated_at: string
}

export interface CreateQuoteLineInput {
  quote_id: string
  description: string
  quantity: number
  unit_price_ht: number
  vat_rate: number
  line_order?: number
}

export interface UpdateQuoteLineInput {
  description?: string
  quantity?: number
  unit_price_ht?: number
  vat_rate?: number
  line_order?: number
}

export class QuoteLineService {
  // Calculate line totals
  private calculateLineTotals(
    quantity: number,
    unitPriceHT: number,
    vatRate: number
  ): { total_ht: number; total_vat: number; total_ttc: number } {
    const total_ht = quantity * unitPriceHT
    const total_vat = total_ht * (vatRate / 100)
    const total_ttc = total_ht + total_vat

    return {
      total_ht: Math.round(total_ht * 100) / 100,
      total_vat: Math.round(total_vat * 100) / 100,
      total_ttc: Math.round(total_ttc * 100) / 100,
    }
  }

  async getLinesByQuote(quoteId: string): Promise<QuoteLine[]> {
    const { data, error } = await supabase
      .from('quote_lines')
      .select('*')
      .eq('quote_id', quoteId)
      .order('line_order', { ascending: true })

    if (error) throw error
    return data || []
  }

  async getLineById(lineId: string): Promise<QuoteLine> {
    const { data, error } = await supabase
      .from('quote_lines')
      .select('*')
      .eq('id', lineId)
      .single()

    if (error) throw error
    return data
  }

  async createLine(input: CreateQuoteLineInput): Promise<QuoteLine> {
    const totals = this.calculateLineTotals(
      input.quantity,
      input.unit_price_ht,
      input.vat_rate
    )

    const { data, error } = await supabase
      .from('quote_lines')
      .insert({
        quote_id: input.quote_id,
        description: input.description,
        quantity: input.quantity,
        unit_price_ht: input.unit_price_ht,
        vat_rate: input.vat_rate,
        line_order: input.line_order || 0,
        ...totals,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateLine(lineId: string, input: UpdateQuoteLineInput): Promise<QuoteLine> {
    // Get current line data
    const currentLine = await this.getLineById(lineId)

    // Calculate new totals if amounts changed
    const quantity = input.quantity ?? currentLine.quantity
    const unitPriceHT = input.unit_price_ht ?? currentLine.unit_price_ht
    const vatRate = input.vat_rate ?? currentLine.vat_rate

    const totals = this.calculateLineTotals(quantity, unitPriceHT, vatRate)

    const { data, error } = await supabase
      .from('quote_lines')
      .update({
        ...input,
        ...totals,
        updated_at: new Date().toISOString(),
      })
      .eq('id', lineId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteLine(lineId: string): Promise<void> {
    const { error } = await supabase
      .from('quote_lines')
      .delete()
      .eq('id', lineId)

    if (error) throw error
  }

  async deleteLinesByQuote(quoteId: string): Promise<void> {
    const { error } = await supabase
      .from('quote_lines')
      .delete()
      .eq('quote_id', quoteId)

    if (error) throw error
  }

  // Bulk create lines for a quote
  async createBulkLines(lines: CreateQuoteLineInput[]): Promise<QuoteLine[]> {
    const linesWithTotals = lines.map((line, index) => {
      const totals = this.calculateLineTotals(
        line.quantity,
        line.unit_price_ht,
        line.vat_rate
      )

      return {
        quote_id: line.quote_id,
        description: line.description,
        quantity: line.quantity,
        unit_price_ht: line.unit_price_ht,
        vat_rate: line.vat_rate,
        line_order: line.line_order ?? index,
        ...totals,
      }
    })

    const { data, error } = await supabase
      .from('quote_lines')
      .insert(linesWithTotals)
      .select()

    if (error) throw error
    return data || []
  }

  // Get quote totals summary grouped by VAT rate
  async getQuoteVATSummary(quoteId: string): Promise<Array<{
    vat_rate: number
    total_ht: number
    total_vat: number
    total_ttc: number
  }>> {
    const lines = await this.getLinesByQuote(quoteId)

    // Group by VAT rate
    const grouped = lines.reduce((acc, line) => {
      const rate = line.vat_rate
      if (!acc[rate]) {
        acc[rate] = { vat_rate: rate, total_ht: 0, total_vat: 0, total_ttc: 0 }
      }
      acc[rate].total_ht += line.total_ht
      acc[rate].total_vat += line.total_vat
      acc[rate].total_ttc += line.total_ttc
      return acc
    }, {} as Record<number, { vat_rate: number; total_ht: number; total_vat: number; total_ttc: number }>)

    return Object.values(grouped).map(g => ({
      vat_rate: g.vat_rate,
      total_ht: Math.round(g.total_ht * 100) / 100,
      total_vat: Math.round(g.total_vat * 100) / 100,
      total_ttc: Math.round(g.total_ttc * 100) / 100,
    }))
  }
}

export const quoteLineService = new QuoteLineService()
