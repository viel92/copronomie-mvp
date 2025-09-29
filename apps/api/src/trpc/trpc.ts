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

// TEMPORAIRE: Procedure pour développement qui simule un utilisateur syndic
// SÉCURITÉ: Désactivé en production pour éviter bypass d'authentification
export const devProcedure = process.env.NODE_ENV === 'development'
  ? t.procedure.use(({ ctx, next }) => {
      // Si pas d'utilisateur, créer un utilisateur de test syndic
      const user = ctx.user || {
        id: 'test-syndic-id',
        email: 'test@syndic.com',
        role: 'syndic',
        metadata: {}
      }

      return next({
        ctx: {
          user,
        },
      })
    })
  : protectedProcedure // Utiliser l'authentification normale en production