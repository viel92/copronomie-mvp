import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/syndic/dashboard',
          '/syndic/projects',
          '/syndic/quotes',
          '/entreprise/dashboard',
          '/entreprise/projects',
          '/entreprise/quotes',
          '/coproprietaire/dashboard'
        ]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  }
}
