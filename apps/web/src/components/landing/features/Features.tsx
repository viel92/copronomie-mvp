'use client'

import { Zap, Building2, BarChart3, Bell, Mail, Lock } from 'lucide-react'
import { Container } from '../ui'
import { FeatureCard } from './FeatureCard'

const features = [
  {
    icon: Zap,
    title: 'Publication express',
    description: 'Créez et publiez un projet en moins de 3 minutes. Interface intuitive et rapide.',
  },
  {
    icon: Building2,
    title: 'Base d\'entreprises qualifiées',
    description: 'Accès à 500+ artisans vérifiés partout en France. Tous certifiés et assurés.',
  },
  {
    icon: BarChart3,
    title: 'Comparaison instantanée',
    description: 'Tableau de comparaison automatique des devis reçus. Gagnez du temps dans vos décisions.',
  },
  {
    icon: Bell,
    title: 'Notifications temps réel',
    description: 'Soyez alerté dès qu\'un nouveau devis arrive. Email et notifications in-app.',
  },
  {
    icon: Mail,
    title: 'Emails automatiques',
    description: 'Communication automatisée avec les entreprises. Templates professionnels inclus.',
  },
  {
    icon: Lock,
    title: 'Données sécurisées',
    description: 'Conformité RGPD totale. Hébergement en France avec chiffrement de bout en bout.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <Container>
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-landing-primary mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-xl text-landing-primary/70">
            Des fonctionnalités puissantes pour simplifier votre quotidien
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
