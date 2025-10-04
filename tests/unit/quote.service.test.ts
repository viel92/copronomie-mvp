import { describe, it, expect, beforeEach, vi } from 'vitest'
import { QuoteService, CreateQuoteInput, UpdateQuoteInput } from '../../apps/api/src/services/quote.service'

// Mock Supabase admin client
vi.mock('../../apps/api/src/config/supabase', () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}))

describe('QuoteService', () => {
  let quoteService: QuoteService

  beforeEach(() => {
    quoteService = new QuoteService()
    vi.clearAllMocks()
  })

  describe('createQuote', () => {
    it('should create a draft quote successfully', async () => {
      const mockInput: CreateQuoteInput = {
        project_id: 'project-123',
        company_id: 'company-123',
        total_ht: 10000,
        total_ttc: 12000,
        tva_rate: 20,
        description: 'Test quote',
        delay_days: 30,
      }

      const mockResponse = {
        id: 'quote-123',
        ...mockInput,
        status: 'draft',
        total_amount: 12000,
        created_at: '2025-10-02',
        updated_at: '2025-10-02',
      }

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      mockFrom.mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockResponse, error: null }),
      } as any)

      const result = await quoteService.createQuote(mockInput)

      expect(result).toEqual(mockResponse)
      expect(result.status).toBe('draft')
      expect(mockFrom).toHaveBeenCalledWith('quotes')
    })

    it('should set default values for missing required fields', async () => {
      const mockInput: CreateQuoteInput = {
        project_id: 'project-456',
        company_id: 'company-456',
      }

      const mockResponse = {
        id: 'quote-456',
        ...mockInput,
        status: 'draft',
        total_amount: 0,
        total_ht: 0,
        total_ttc: 0,
        delay_days: 30,
        delivery_days: 30,
      }

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      const mockInsert = vi.fn().mockReturnThis()

      mockFrom.mockReturnValue({
        insert: mockInsert,
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockResponse, error: null }),
      } as any)

      const result = await quoteService.createQuote(mockInput)

      expect(result.total_amount).toBe(0)
      expect(result.total_ht).toBe(0)
      expect(result.total_ttc).toBe(0)
      expect(result.delay_days).toBe(30)
    })

    it('should throw error when Supabase returns error', async () => {
      const mockInput: CreateQuoteInput = {
        project_id: 'project-789',
        company_id: 'company-789',
      }

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      mockFrom.mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: new Error('Database error') }),
      } as any)

      await expect(quoteService.createQuote(mockInput)).rejects.toThrow('Database error')
    })
  })

  describe('updateQuote', () => {
    it('should update quote successfully', async () => {
      const quoteId = 'quote-123'
      const updateInput: UpdateQuoteInput = {
        total_amount: 15000,
        description: 'Updated quote',
      }

      const mockResponse = {
        id: quoteId,
        ...updateInput,
        status: 'draft',
        project_id: 'project-123',
        company_id: 'company-123',
      }

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      mockFrom.mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockResponse, error: null }),
      } as any)

      const result = await quoteService.updateQuote(quoteId, updateInput)

      expect(result).toEqual(mockResponse)
      expect(mockFrom).toHaveBeenCalledWith('quotes')
    })

    it('should update quote status', async () => {
      const quoteId = 'quote-123'
      const updateInput: UpdateQuoteInput = {
        status: 'submitted',
      }

      const mockResponse = {
        id: quoteId,
        status: 'submitted',
      }

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      mockFrom.mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockResponse, error: null }),
      } as any)

      const result = await quoteService.updateQuote(quoteId, updateInput)

      expect(result.status).toBe('submitted')
    })
  })

  describe('submitQuote', () => {
    it('should change quote status to submitted', async () => {
      const quoteId = 'quote-123'

      const mockResponse = {
        id: quoteId,
        status: 'submitted',
        project_id: 'project-123',
        company_id: 'company-123',
      }

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      mockFrom.mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockResponse, error: null }),
      } as any)

      const result = await quoteService.submitQuote(quoteId)

      expect(result.status).toBe('submitted')
    })
  })

  describe('acceptQuote', () => {
    it('should change quote status to accepted', async () => {
      const quoteId = 'quote-123'

      const mockResponse = {
        id: quoteId,
        status: 'accepted',
        project_id: 'project-123',
        company_id: 'company-123',
      }

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      mockFrom.mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockResponse, error: null }),
      } as any)

      const result = await quoteService.acceptQuote(quoteId)

      expect(result.status).toBe('accepted')
    })
  })

  describe('rejectQuote', () => {
    it('should change quote status to rejected', async () => {
      const quoteId = 'quote-123'

      const mockResponse = {
        id: quoteId,
        status: 'rejected',
        project_id: 'project-123',
        company_id: 'company-123',
      }

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      mockFrom.mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockResponse, error: null }),
      } as any)

      const result = await quoteService.rejectQuote(quoteId)

      expect(result.status).toBe('rejected')
    })
  })

  describe('getQuotesByProject', () => {
    it('should return all quotes for a project', async () => {
      const projectId = 'project-123'

      const mockQuotes = [
        { id: 'quote-1', project_id: projectId, company_id: 'company-1', status: 'submitted' },
        { id: 'quote-2', project_id: projectId, company_id: 'company-2', status: 'draft' },
      ]

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockQuotes, error: null }),
      } as any)

      const result = await quoteService.getQuotesByProject(projectId)

      expect(result).toEqual(mockQuotes)
      expect(result).toHaveLength(2)
    })

    it('should return empty array when no quotes found', async () => {
      const projectId = 'project-empty'

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      } as any)

      const result = await quoteService.getQuotesByProject(projectId)

      expect(result).toEqual([])
    })
  })

  describe('getQuotesByCompany', () => {
    it('should return all quotes for a company', async () => {
      const companyId = 'company-123'

      const mockQuotes = [
        { id: 'quote-1', project_id: 'project-1', company_id: companyId, status: 'submitted' },
        { id: 'quote-2', project_id: 'project-2', company_id: companyId, status: 'accepted' },
        { id: 'quote-3', project_id: 'project-3', company_id: companyId, status: 'rejected' },
      ]

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockQuotes, error: null }),
      } as any)

      const result = await quoteService.getQuotesByCompany(companyId)

      expect(result).toEqual(mockQuotes)
      expect(result).toHaveLength(3)
    })
  })

  describe('getQuoteById', () => {
    it('should return a single quote by id', async () => {
      const quoteId = 'quote-123'

      const mockQuote = {
        id: quoteId,
        project_id: 'project-123',
        company_id: 'company-123',
        status: 'submitted',
        total_amount: 10000,
      }

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockQuote, error: null }),
      } as any)

      const result = await quoteService.getQuoteById(quoteId)

      expect(result).toEqual(mockQuote)
    })

    it('should throw error when quote not found', async () => {
      const quoteId = 'quote-notfound'

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
      } as any)

      await expect(quoteService.getQuoteById(quoteId)).rejects.toThrow('Not found')
    })
  })

  describe('deleteQuote', () => {
    it('should delete quote successfully', async () => {
      const quoteId = 'quote-123'

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      mockFrom.mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      } as any)

      const result = await quoteService.deleteQuote(quoteId)

      expect(result).toEqual({ success: true })
      expect(mockFrom).toHaveBeenCalledWith('quotes')
    })

    it('should throw error when deletion fails', async () => {
      const quoteId = 'quote-123'

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      mockFrom.mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: new Error('Cannot delete') }),
      } as any)

      await expect(quoteService.deleteQuote(quoteId)).rejects.toThrow('Cannot delete')
    })
  })
})
