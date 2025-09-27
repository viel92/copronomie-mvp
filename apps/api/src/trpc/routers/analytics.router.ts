import { router, protectedProcedure } from '../trpc'
import { analyticsService } from '../../services/analytics.service'

export const analyticsRouter = router({
  getSyndicAnalytics: protectedProcedure
    .query(async ({ ctx }) => {
      const analytics = await analyticsService.getSyndicAnalytics(ctx.user.id)
      return { success: true, analytics }
    }),
})