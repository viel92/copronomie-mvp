import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { quoteService } from '../../services/quote.service'

export const quoteRouter = router({
  getByProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      const quotes = await quoteService.getQuotesByProject(input.projectId)
      return { success: true, quotes }
    }),

  getByCompany: protectedProcedure
    .input(z.object({ companyId: z.string() }))
    .query(async ({ input }) => {
      const quotes = await quoteService.getQuotesByCompany(input.companyId)
      return { success: true, quotes }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const quote = await quoteService.getQuoteById(input.id)
      return { success: true, quote }
    }),

  create: protectedProcedure
    .input(
      z.object({
        project_id: z.string(),
        company_id: z.string(),
        total_amount: z.number().optional(),
        total_ht: z.number().optional(),
        total_ttc: z.number().optional(),
        description: z.string().optional(),
        delay_days: z.number().optional(),
        pdf_url: z.string().optional(),
        details: z.any().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const quote = await quoteService.createQuote(input)
      return { success: true, quote }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        total_amount: z.number().optional(),
        total_ht: z.number().optional(),
        total_ttc: z.number().optional(),
        tva_rate: z.number().optional(),
        status: z.enum(['draft', 'submitted', 'accepted', 'rejected']).optional(),
        details: z.any().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input
      const quote = await quoteService.updateQuote(id, updateData)
      return { success: true, quote }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await quoteService.deleteQuote(input.id)
      return { success: true }
    }),

  submit: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const quote = await quoteService.submitQuote(input.id)
      return { success: true, quote }
    }),

  accept: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const quote = await quoteService.acceptQuote(input.id)
      return { success: true, quote }
    }),

  reject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const quote = await quoteService.rejectQuote(input.id)
      return { success: true, quote }
    }),
})