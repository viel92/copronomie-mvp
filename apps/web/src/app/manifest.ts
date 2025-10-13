import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Copronomie - Gestion de travaux de copropriété',
    short_name: 'Copronomie',
    description: 'Simplifiez la gestion de vos travaux de copropriété avec Copronomie',
    start_url: '/',
    display: 'standalone',
    background_color: '#1B0C25',
    theme_color: '#1B0C25',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    categories: ['business', 'productivity'],
    lang: 'fr-FR',
    dir: 'ltr'
  }
}
