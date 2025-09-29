import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { authService } from '../../services/auth.service'

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        confirmPassword: z.string(),
        role: z.enum(['syndic', 'company', 'condo']),
        companyName: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
      })
    )
    .mutation(async ({ input }) => {
      const result = await authService.register(input)
      return {
        success: true,
        user: {
          id: result.user?.id,
          email: result.user?.email,
          role: input.role,
        },
      }
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await authService.login(input)
      return {
        success: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.user_metadata?.role,
        },
        session: {
          access_token: result.session?.access_token,
          refresh_token: result.session?.refresh_token,
          expires_at: result.session?.expires_at,
        },
      }
    }),

  logout: protectedProcedure
    .mutation(async () => {
      await authService.logout()
      return { success: true }
    }),

  me: protectedProcedure
    .query(({ ctx }) => {
      return {
        success: true,
        user: ctx.user,
      }
    }),

  // Route de debug pour tester l'état de l'utilisateur
  debug: publicProcedure
    .query(({ ctx }) => {
      return {
        success: true,
        user: ctx.user,
        hasUser: !!ctx.user,
        contextKeys: Object.keys(ctx),
      }
    }),

  refresh: publicProcedure
    .input(
      z.object({
        refresh_token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await authService.refreshSession(input.refresh_token)
      return {
        success: true,
        session: {
          access_token: result.session?.access_token,
          refresh_token: result.session?.refresh_token,
          expires_at: result.session?.expires_at,
        },
      }
    }),
})