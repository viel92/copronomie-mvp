import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { subscriptionService } from '../../services/subscription.service'

export const subscriptionRouter = router({
  getByEntity: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        entityType: z.enum(['syndic', 'company', 'condo']),
      })
    )
    .query(async ({ input }) => {
      const subscription = await subscriptionService.getByEntity(
        input.entityId,
        input.entityType
      )
      return { success: true, subscription }
    }),

  create: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        entityType: z.enum(['syndic', 'company', 'condo']),
        plan: z.enum(['basic', 'premium', 'enterprise']),
        trialEndsAt: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const subscription = await subscriptionService.create({
        entity_id: input.entityId,
        entity_type: input.entityType,
        plan: input.plan,
        trial_ends_at: input.trialEndsAt,
      })
      return { success: true, subscription }
    }),

  update: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        status: z.enum(['active', 'trialing', 'canceled', 'past_due']).optional(),
        plan: z.enum(['basic', 'premium', 'enterprise']).optional(),
        currentPeriodStart: z.string().optional(),
        currentPeriodEnd: z.string().optional(),
        trialEndsAt: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { entityId, ...updateData } = input
      const subscription = await subscriptionService.update(entityId, {
        status: updateData.status,
        plan: updateData.plan,
        current_period_start: updateData.currentPeriodStart,
        current_period_end: updateData.currentPeriodEnd,
        trial_ends_at: updateData.trialEndsAt,
      })
      return { success: true, subscription }
    }),

  cancel: protectedProcedure
    .input(z.object({ entityId: z.string() }))
    .mutation(async ({ input }) => {
      const subscription = await subscriptionService.cancel(input.entityId)
      return { success: true, subscription }
    }),
})