import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '../../../api/src/trpc/routers'

export const trpc = createTRPCReact<AppRouter>()