import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { quoteLineService } from '../../services/quote-line.service'

export const quoteLineRouter = router({
  getByQuote: protectedProcedure
    .input(z.object({ quoteId: z.string() }))
    .query(async ({ input }) => {
      const lines = await quoteLineService.getLinesByQuote(input.quoteId)
      return { success: true, lines }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const line = await quoteLineService.getLineById(input.id)
      return { success: true, line }
    }),

  create: protectedProcedure
    .input(
      z.object({
        quote_id: z.string(),
        description: z.string().min(1, 'Description is required'),
        quantity: z.number().positive('Quantity must be positive'),
        unit_price_ht: z.number().positive('Unit price must be positive'),
        vat_rate: z.number().min(0).max(100, 'VAT rate must be between 0 and 100'),
        line_order: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const line = await quoteLineService.createLine(input)
      return { success: true, line }
    }),

  createBulk: protectedProcedure
    .input(
      z.object({
        lines: z.array(
          z.object({
            quote_id: z.string(),
            description: z.string().min(1, 'Description is required'),
            quantity: z.number().positive('Quantity must be positive'),
            unit_price_ht: z.number().positive('Unit price must be positive'),
            vat_rate: z.number().min(0).max(100, 'VAT rate must be between 0 and 100'),
            line_order: z.number().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const lines = await quoteLineService.createBulkLines(input.lines)
      return { success: true, lines }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        description: z.string().min(1).optional(),
        quantity: z.number().positive().optional(),
        unit_price_ht: z.number().positive().optional(),
        vat_rate: z.number().min(0).max(100).optional(),
        line_order: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input
      const line = await quoteLineService.updateLine(id, updateData)
      return { success: true, line }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await quoteLineService.deleteLine(input.id)
      return { success: true }
    }),

  deleteByQuote: protectedProcedure
    .input(z.object({ quoteId: z.string() }))
    .mutation(async ({ input }) => {
      await quoteLineService.deleteLinesByQuote(input.quoteId)
      return { success: true }
    }),

  getVATSummary: protectedProcedure
    .input(z.object({ quoteId: z.string() }))
    .query(async ({ input }) => {
      const summary = await quoteLineService.getQuoteVATSummary(input.quoteId)
      return { success: true, summary }
    }),
})
