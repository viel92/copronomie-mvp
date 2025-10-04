import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { emailService } from '../../services/email.service'

export const emailRouter = router({
  send: publicProcedure
    .input(
      z.object({
        to: z.string().email(),
        subject: z.string().min(1),
        html: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const result = await emailService.sendEmail(input)
      return { success: true, data: result }
    }),

  sendQuoteReceived: publicProcedure
    .input(
      z.object({
        syndicEmail: z.string().email(),
        syndicName: z.string(),
        projectTitle: z.string(),
        companyName: z.string(),
        quoteAmount: z.number(),
        projectId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await emailService.sendQuoteReceivedNotification(input)
      return { success: true, data: result }
    }),

  sendQuoteAccepted: publicProcedure
    .input(
      z.object({
        companyEmail: z.string().email(),
        companyName: z.string(),
        projectTitle: z.string(),
        quoteAmount: z.number(),
        syndicName: z.string(),
        projectId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await emailService.sendQuoteAcceptedNotification(input)
      return { success: true, data: result }
    }),
})
