export function JsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://copronomie.fr/#organization',
        name: 'Copronomie',
        url: 'https://copronomie.fr',
        logo: {
          '@type': 'ImageObject',
          url: 'https://copronomie.fr/logo.png',
          width: 512,
          height: 512
        },
        description: 'La plateforme qui simplifie la gestion des travaux de copropriété',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'FR',
          addressLocality: 'Paris'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'contact@copronomie.fr',
          contactType: 'customer service',
          availableLanguage: 'French'
        },
        sameAs: [
          'https://www.facebook.com/copronomie',
          'https://twitter.com/copronomie',
          'https://www.linkedin.com/company/copronomie'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': 'https://copronomie.fr/#website',
        url: 'https://copronomie.fr',
        name: 'Copronomie',
        publisher: {
          '@id': 'https://copronomie.fr/#organization'
        },
        inLanguage: 'fr-FR'
      },
      {
        '@type': 'WebPage',
        '@id': 'https://copronomie.fr/#webpage',
        url: 'https://copronomie.fr',
        name: 'Copronomie - La plateforme qui simplifie les travaux de copropriété',
        description: 'Simplifiez la gestion de vos travaux de copropriété. Publiez vos projets, recevez des devis qualifiés d\'artisans vérifiés et choisissez la meilleure offre en quelques clics.',
        isPartOf: {
          '@id': 'https://copronomie.fr/#website'
        },
        inLanguage: 'fr-FR'
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Copronomie',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
          description: 'Essai gratuit de 14 jours'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '150',
          bestRating: '5',
          worstRating: '1'
        }
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
