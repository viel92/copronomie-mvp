import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { Context as HonoContext } from 'hono'

export interface CreateContextOptions extends Record<string, unknown> {
  user?: {
    id: string
    email: string
    role: string
  }
}

export const createContext = (
  opts: FetchCreateContextFnOptions,
  c: HonoContext
): CreateContextOptions => {
  const user = c.get('user')
  return {
    user: user ? {
      id: user.id,
      email: user.email,
      role: user.role || 'user'
    } : undefined,
  }
}

export type Context = CreateContextOptions