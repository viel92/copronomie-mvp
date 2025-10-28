'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Container, Badge } from '../ui'
import { PricingCard } from './PricingCard'

const pricingPlans = [
  {
    name: 'Syndics',
    price: '0€',
    description: '100% gratuit, toujours',
    popular: true,
    features: [
      'Appels d\'offres illimités',
      'Devis illimités',
      'Artisans pré-qualifiés',
      'Comparaison facilitée',
      'Suivi de tous vos projets',
      'Support 7j/7',
      'Notifications en temps réel',
      'Export pour AG',
      'Sans engagement, sans CB'
    ]
  },
  {
    name: 'Artisans',
    price: '49€',
    description: 'Accédez aux appels d\'offres',
    features: [
      'Répondre aux appels d\'offres',
      'Dossiers illimités',
      'Profil professionnel vérifié',
      'Messagerie directe syndics',
      'Notifications de nouveaux projets',
      'Statistiques de performance',
      'Badge "Artisan vérifié"',
      '30 jours d\'essai gratuit'
    ]
  },
  {
    name: 'Artisans Premium',
    price: '99€',
    description: 'Boostez votre visibilité',
    features: [
      'Tout du plan Artisan',
      'Priorité dans les résultats',
      'Accès anticipé aux projets',
      'Badge "Artisan Premium"',
      'Support prioritaire',
      'Profil mis en avant',
      'Analyses détaillées',
      'Formation plateforme offerte'
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center mb-6"
          >
            <Badge>Tarifs</Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold text-landing-primary mb-4"
          >
            100% gratuit pour les syndics
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl text-landing-primary/70"
          >
            Notre modèle est simple : les artisans paient pour accéder aux appels d'offres. Vous ne payez jamais rien.
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
            Rejoignez des centaines de syndics qui gèrent leurs appels d'offres gratuitement sur Copronomie
          </p>
        </motion.div>
      </Container>
    </section>
  )
}
