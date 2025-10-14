'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Container } from '../ui'
import { PricingCard } from './PricingCard'

const pricingPlans = [
  {
    name: 'Découverte',
    price: 'Gratuit',
    description: 'Parfait pour tester la plateforme',
    features: [
      '1 projet actif à la fois',
      'Jusqu\'à 3 devis par projet',
      'Support par email',
      'Accès à la base d\'artisans',
      'Tableau de comparaison basique'
    ]
  },
  {
    name: 'Professionnel',
    price: '49€',
    description: 'Pour les syndics actifs',
    popular: true,
    features: [
      'Projets illimités',
      'Devis illimités',
      'Support prioritaire 7j/7',
      'Accès à tous les artisans',
      'Tableau de comparaison avancé',
      'Notifications temps réel',
      'Historique complet',
      'Export PDF des devis'
    ]
  },
  {
    name: 'Entreprise',
    price: 'Sur mesure',
    description: 'Pour les grandes structures',
    features: [
      'Tout du plan Professionnel',
      'Comptes utilisateurs multiples',
      'API dédiée',
      'Account manager dédié',
      'Formation personnalisée',
      'Intégration avec vos outils',
      'Facturation sur devis',
      'SLA garantie'
    ]
  }
]

export function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="pricing" className="py-24 bg-white">
      <Container>
        {/* Header */}
        <div ref={ref} className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold text-landing-primary mb-4"
          >
            Une offre adaptée à vos besoins
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl text-landing-primary/70"
          >
            Choisissez le plan qui correspond à votre activité
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              {...plan}
              index={index}
            />
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mt-12"
        >
          <p className="text-landing-primary/60">
            Tous les plans incluent 14 jours d'essai gratuit. Sans engagement.
          </p>
        </motion.div>
      </Container>
    </section>
  )
}
