import { httpBatchLink } from '@trpc/client'
import { trpc } from './trpc'

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_API_URL + '/trpc' || 'http://localhost:4000/trpc',
      headers() {
        const token = localStorage.getItem('access_token')
        return {
          authorization: token ? `Bearer ${token}` : '',
        }
      },
    }),
  ],
})