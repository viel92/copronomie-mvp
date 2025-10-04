import { z } from 'zod'
import { router, protectedProcedure, publicProcedure } from '../trpc'
import { condoService, companyService } from '../../services/condo.service'

export const condoRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== 'syndic') {
      throw new Error('Not authorized')
    }
    const condos = await condoService.getCondosBySyndic(ctx.user.id)
    return { success: true, condos }
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const condo = await condoService.getCondoById(input.id)
      return { success: true, condo }
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        address: z.string(),
        units_count: z.number().optional(),
        city: z.string().optional(),
        postal_code: z.string().optional(),
        numero_immatriculation: z.string().optional(),
        periode_construction: z.string().optional(),
        type_syndic: z.string().optional(),
        date_immatriculation: z.string().optional(),
        nombre_lots_habitation: z.number().optional(),
        nombre_lots_stationnement: z.number().optional(),
        subscription_plan: z.string().optional(),
        referral_code: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log('[CondoRouter] Create condo mutation called', {
        user: ctx.user.id,
        role: ctx.user.role,
        condoName: input.name
      })

      if (ctx.user.role !== 'syndic') {
        console.error('[CondoRouter] User not authorized - role:', ctx.user.role)
        throw new Error('Not authorized')
      }

      try {
        // Remove units_count as it doesn't exist in the database
        const { units_count, ...condoData } = input
        const condo = await condoService.createCondo({
          ...condoData,
          syndic_id: ctx.user.id,
        })
        console.log('[CondoRouter] Condo created successfully')
        return { success: true, condo }
      } catch (error) {
        console.error('[CondoRouter] Error creating condo:', error)
        throw error
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        address: z.string().optional(),
        units_count: z.number().optional(),
        city: z.string().optional(),
        postal_code: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'syndic') {
        throw new Error('Not authorized')
      }
      const { id, ...updateData } = input
      const condo = await condoService.updateCondo(id, updateData)
      return { success: true, condo }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'syndic') {
        throw new Error('Not authorized')
      }
      await condoService.deleteCondo(input.id)
      return { success: true }
    }),

  searchRegistry: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const results = await condoService.searchRegistry(input.query)
      return { success: true, results }
    }),

  searchBySiret: protectedProcedure
    .input(
      z.object({
        siret: z.string(),
        filters: z
          .object({
            ville: z.string().optional(),
            code_postal: z.string().optional(),
            minLots: z.number().optional(),
            maxLots: z.number().optional(),
          })
          .optional(),
      })
    )
    .query(async ({ input }) => {
      const results = await condoService.searchBySiret(
        input.siret,
        input.filters
      )
      return { success: true, results }
    }),

  bulkImport: protectedProcedure
    .input(
      z.object({
        condos: z.array(
          z.object({
            name: z.string(),
            address: z.string(),
            units_count: z.number().optional(),
            city: z.string().optional(),
            postal_code: z.string().optional(),
            numero_immatriculation: z.string().optional(),
            periode_construction: z.string().optional(),
            type_syndic: z.string().optional(),
            date_immatriculation: z.string().optional(),
            nombre_lots_habitation: z.number().optional(),
            nombre_lots_stationnement: z.number().optional(),
            subscription_plan: z.string().optional(),
            referral_code: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'syndic') {
        throw new Error('Not authorized')
      }

      const condosWithSyndicId = input.condos.map((condo) => ({
        ...condo,
        syndic_id: ctx.user.id,
      }))

      const condos = await condoService.bulkCreateCondos(condosWithSyndicId)
      return { success: true, condos }
    }),

  companies: router({
    getAll: publicProcedure.query(async () => {
      const companies = await companyService.getAllCompanies()
      return { success: true, companies }
    }),

    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const company = await companyService.getCompanyById(input.id)
        return { success: true, company }
      }),

    getBySpecialty: publicProcedure
      .input(z.object({ specialty: z.string() }))
      .query(async ({ input }) => {
        const companies = await companyService.getCompaniesBySpecialty(
          input.specialty
        )
        return { success: true, companies }
      }),
  }),
})
