import { httpBatchLink } from '@trpc/client'
import { trpc } from './trpc'

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_API_URL + '/trpc' || 'http://localhost:4000/trpc',
      headers() {
        if (typeof window === 'undefined') {
          return { authorization: '' }
        }

        // Essayer d'abord access_token (ancien système), puis copronomie_session (nouveau)
        const accessToken = localStorage.getItem('access_token')
        if (accessToken) {
          return {
            authorization: `Bearer ${accessToken}`,
          }
        }

        // Récupérer la session depuis le localStorage (nouveau système)
        const sessionStr = localStorage.getItem('copronomie_session')
        if (!sessionStr) {
          return { authorization: '' }
        }

        try {
          const session = JSON.parse(sessionStr)
          const token = session.access_token
          return {
            authorization: token ? `Bearer ${token}` : '',
          }
        } catch {
          return { authorization: '' }
        }
      },
    }),
  ],
})