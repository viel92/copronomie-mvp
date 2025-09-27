import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { alertService } from '../../services/alert.service'

export const alertRouter = router({
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      const alerts = await alertService.getAlertsBySyndic(ctx.user.id)
      return { success: true, alerts }
    }),

  create: protectedProcedure
    .input(
      z.object({
        type: z.string(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
        message: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const alert = await alertService.createAlert({
        ...input,
        syndic_id: ctx.user.id,
        is_read: false,
      })
      return { success: true, alert }
    }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const alert = await alertService.markAsRead(input.id)
      return { success: true, alert }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await alertService.deleteAlert(input.id)
      return { success: true }
    }),

  getSettings: protectedProcedure
    .query(async ({ ctx }) => {
      const settings = await alertService.getAlertSettings(ctx.user.id)
      return { success: true, settings }
    }),

  updateSetting: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        enabled: z.boolean().optional(),
        config: z.any().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input
      const setting = await alertService.updateAlertSetting(id, updateData)
      return { success: true, setting }
    }),

  getUnreadCount: protectedProcedure
    .query(async ({ ctx }) => {
      const count = await alertService.getUnreadCount(ctx.user.id)
      return { success: true, count }
    }),
})