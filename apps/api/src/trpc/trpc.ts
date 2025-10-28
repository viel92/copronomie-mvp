import { initTRPC, TRPCError } from '@trpc/server'
import { Context } from './context'

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  })
})

// CRITIQUE-8: SUPPRIMÉ - Le devProcedure était une vulnérabilité critique
// qui permettait de bypasser l'authentification en développement.
// Utiliser toujours protectedProcedure pour garantir la sécurité,
// même en développement. Pour tester, créer de vrais comptes de test.