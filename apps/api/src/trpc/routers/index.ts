import { router } from '../trpc'
import { authRouter } from './auth.router'
import { projectRouter } from './project.router'
import { userRouter } from './user.router'
import { quoteRouter } from './quote.router'
import { contractRouter } from './contract.router'
import { condoRouter } from './condo.router'
import { alertRouter } from './alert.router'
import { analyticsRouter } from './analytics.router'
import { subscriptionRouter } from './subscription.router'

export const appRouter = router({
  auth: authRouter,
  projects: projectRouter,
  users: userRouter,
  quotes: quoteRouter,
  contracts: contractRouter,
  condos: condoRouter,
  alerts: alertRouter,
  analytics: analyticsRouter,
  subscriptions: subscriptionRouter,
})

export type AppRouter = typeof appRouter
