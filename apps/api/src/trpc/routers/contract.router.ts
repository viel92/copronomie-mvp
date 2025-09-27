import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { contractService } from '../../services/contract.service'

export const contractRouter = router({
  property: router({
    getAll: protectedProcedure
      .query(async ({ ctx }) => {
        const contracts = await contractService.getPropertyContracts(ctx.user.id)
        return { success: true, contracts }
      }),

    create: protectedProcedure
      .input(
        z.object({
          condo_id: z.string(),
          title: z.string(),
          description: z.string().optional(),
          contract_type: z.string(),
          current_provider: z.string().optional(),
          contract_value: z.number().optional(),
          contract_start: z.string().optional(),
          contract_end: z.string().optional(),
          renewal_date: z.string().optional(),
          renewal_notice_days: z.number().optional(),
          status: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const contract = await contractService.createPropertyContract({
          ...input,
          syndic_id: ctx.user.id,
        })
        return { success: true, contract }
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          condo_id: z.string().optional(),
          title: z.string().optional(),
          description: z.string().optional(),
          contract_type: z.string().optional(),
          current_provider: z.string().optional(),
          contract_value: z.number().optional(),
          contract_start: z.string().optional(),
          contract_end: z.string().optional(),
          renewal_date: z.string().optional(),
          renewal_notice_days: z.number().optional(),
          status: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updateData } = input
        const contract = await contractService.updatePropertyContract(id, updateData)
        return { success: true, contract }
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await contractService.deletePropertyContract(input.id)
        return { success: true }
      }),
  }),

  energy: router({
    getAll: protectedProcedure
      .query(async ({ ctx }) => {
        const contracts = await contractService.getEnergyContracts(ctx.user.id)
        return { success: true, contracts }
      }),

    create: protectedProcedure
      .input(
        z.object({
          condo_id: z.string(),
          title: z.string(),
          description: z.string().optional(),
          energy_type: z.string(),
          current_provider: z.string().optional(),
          contract_reference: z.string().optional(),
          annual_consumption: z.number().optional(),
          unit_price: z.number().optional(),
          fixed_cost: z.number().optional(),
          contract_start: z.string().optional(),
          contract_end: z.string().optional(),
          renewal_notice_days: z.number().optional(),
          status: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const contract = await contractService.createEnergyContract({
          ...input,
          syndic_id: ctx.user.id,
        })
        return { success: true, contract }
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          condo_id: z.string().optional(),
          title: z.string().optional(),
          description: z.string().optional(),
          energy_type: z.string().optional(),
          current_provider: z.string().optional(),
          contract_reference: z.string().optional(),
          annual_consumption: z.number().optional(),
          unit_price: z.number().optional(),
          fixed_cost: z.number().optional(),
          contract_start: z.string().optional(),
          contract_end: z.string().optional(),
          renewal_notice_days: z.number().optional(),
          status: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updateData } = input
        const contract = await contractService.updateEnergyContract(id, updateData)
        return { success: true, contract }
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await contractService.deleteEnergyContract(input.id)
        return { success: true }
      }),
  }),

  serviceOrders: router({
    getAll: protectedProcedure
      .query(async ({ ctx }) => {
        const orders = await contractService.getServiceOrders(ctx.user.id)
        return { success: true, orders }
      }),

    create: protectedProcedure
      .input(
        z.object({
          condo_id: z.string(),
          title: z.string(),
          description: z.string().optional(),
          service_type: z.string(),
          provider_name: z.string().optional(),
          monthly_cost: z.number().optional(),
          annual_cost: z.number().optional(),
          contract_start: z.string().optional(),
          contract_end: z.string().optional(),
          renewal_notice_days: z.number().optional(),
          status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const order = await contractService.createServiceOrder({
          ...input,
          syndic_id: ctx.user.id,
          status: input.status || 'pending',
        })
        return { success: true, order }
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          condo_id: z.string().optional(),
          title: z.string().optional(),
          description: z.string().optional(),
          service_type: z.string().optional(),
          provider_name: z.string().optional(),
          monthly_cost: z.number().optional(),
          annual_cost: z.number().optional(),
          contract_start: z.string().optional(),
          contract_end: z.string().optional(),
          renewal_notice_days: z.number().optional(),
          status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updateData } = input
        const order = await contractService.updateServiceOrder(id, updateData)
        return { success: true, order }
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await contractService.deleteServiceOrder(input.id)
        return { success: true }
      }),
  }),
})
