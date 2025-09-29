import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { companyService } from '../../services/company.service'

export const companyRouter = router({
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      const companies = await companyService.getAllCompanies(ctx.user.id)
      return { success: true, companies }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const company = await companyService.getCompanyById(input.id, ctx.user.id)
      return { success: true, company }
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        postal_code: z.string().optional(),
        specialties: z.array(z.string()).optional(),
        rating: z.number().min(0).max(5).optional(),
        description: z.string().optional(),
        certification: z.string().optional(),
        website: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const company = await companyService.createCompany({
        ...input,
        syndic_id: ctx.user.id,
      })
      return { success: true, company }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        postal_code: z.string().optional(),
        specialties: z.array(z.string()).optional(),
        rating: z.number().min(0).max(5).optional(),
        description: z.string().optional(),
        certification: z.string().optional(),
        website: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input
      const company = await companyService.updateCompany(id, updateData, ctx.user.id)
      return { success: true, company }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await companyService.deleteCompany(input.id, ctx.user.id)
      return { success: true }
    }),
})