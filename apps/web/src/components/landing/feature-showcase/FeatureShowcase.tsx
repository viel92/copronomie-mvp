'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Container } from '../ui'
import { Check } from 'lucide-react'
import Image from 'next/image'

const features = [
  {
    title: 'Intégration de données simplifiée',
    description:
      'Connectez facilement vos outils et plateformes existants pour centraliser toutes vos données de copropriété.',
    items: [
      'Synchronisation en temps réel',
      'Support multi-plateforme',
      'Transfert de données sécurisé',
    ],
    imagePosition: 'left' as const,
    imagePlaceholder: '/images/feature-integration.jpg',
  },
  {
    title: 'Analysez et optimisez',
    description:
      'Utilisez l\'IA pour découvrir des insights précieux et améliorer les performances de votre copropriété.',
    items: [
      'Tableaux de bord analytiques',
      'Recommandations intelligentes',
      'Rapports personnalisés',
    ],
    imagePosition: 'right' as const,
    imagePlaceholder: '/images/feature-analytics.jpg',
  },
  {
    title: 'Collaboration en équipe',
    description:
      'Travaillez ensemble efficacement avec des outils de communication et de gestion de projet intégrés.',
    items: [
      'Messagerie instantanée',
      'Partage de documents',
      'Gestion des tâches',
    ],
    imagePosition: 'left' as const,
    imagePlaceholder: '/images/feature-collaboration.jpg',
  },
]

export function FeatureShowcase() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-section-md md:py-section-lg bg-landing-white">
      <Container>
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4 px-4 py-2 bg-landing-purple-lite rounded-pill text-body-14 font-medium text-landing-black uppercase"
          >
            Fonctionnalités
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-heading-3-mobile md:text-heading-2-tablet lg:text-heading-2 font-medium text-landing-black mb-6"
          >
            Des fonctionnalités puissantes
            <br />
            pour votre croissance
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-body-18 text-landing-secondary"
          >
            Explorez notre suite complète de fonctionnalités conçues pour simplifier la gestion de votre copropriété
          </motion.p>
        </div>

        {/* Feature Cards */}
        <div ref={ref} className="space-y-20 md:space-y-32">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{
                duration: 0.7,
                delay: 0.3 + index * 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                feature.imagePosition === 'right' ? 'lg:grid-flow-dense' : ''
              }`}
            >
              {/* Image */}
              <div
                className={`relative aspect-[1.069] rounded-card overflow-hidden bg-landing-gray ${
                  feature.imagePosition === 'right' ? 'lg:col-start-2' : ''
                }`}
              >
                {/* Placeholder gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-landing-blue-lite via-landing-purple-lite to-landing-pink-lite flex items-center justify-center">
                  <span className="text-landing-secondary text-sm">
                    Image à venir
                  </span>
                </div>
              </div>

              {/* Content */}
              <div
                className={`${
                  feature.imagePosition === 'right' ? 'lg:col-start-1 lg:row-start-1' : ''
                }`}
              >
                <h3 className="text-heading-4-mobile md:text-heading-3-tablet lg:text-heading-3 font-medium text-landing-black mb-4">
                  {feature.title}
                </h3>
                <p className="text-body-18 text-landing-secondary mb-8 leading-relaxed">
                  {feature.description}
                </p>

                {/* Feature Items */}
                <div className="space-y-4">
                  {feature.items.map((item, itemIndex) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        isInView
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0, x: -20 }
                      }
                      transition={{
                        duration: 0.5,
                        delay: 0.4 + index * 0.2 + itemIndex * 0.1,
                      }}
                      className="flex items-start gap-3"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-landing-blue-lite flex items-center justify-center mt-0.5">
                        <Check
                          className="w-4 h-4 text-landing-blue"
                          strokeWidth={2.5}
                        />
                      </div>
                      <span className="text-body-16 text-landing-black font-medium">
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
