import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { userService } from '../../services/user.service'
import { TRPCError } from '@trpc/server'

export const userRouter = router({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      if (input.id !== ctx.user.id && ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      const user = await userService.getUserById(input.id)
      return { success: true, user }
    }),

  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      const users = await userService.getAllUsers()
      return { success: true, users }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        companyName: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.id !== ctx.user.id && ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      const { id, ...updateData } = input
      const user = await userService.updateUser(id, {
        company_name: updateData.companyName,
        first_name: updateData.firstName,
        last_name: updateData.lastName,
        phone: updateData.phone,
      })
      return { success: true, user }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      await userService.deleteUser(input.id)
      return { success: true }
    }),
})
