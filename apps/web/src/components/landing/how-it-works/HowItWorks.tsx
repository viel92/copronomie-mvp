'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Container, Badge } from '../ui'
import { FileText, Search, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: FileText,
    title: 'Publiez votre projet',
    description:
      'Décrivez vos travaux de copropriété en quelques clics. Ajoutez photos, plans et détails techniques pour permettre aux artisans de bien comprendre vos besoins.',
    iconColor: 'text-landing-blue',
  },
  {
    icon: Search,
    title: 'Recevez des devis qualifiés',
    description:
      'Nos artisans vérifiés étudient votre projet et vous envoient des devis détaillés. Comparez facilement les offres et posez vos questions directement.',
    iconColor: 'text-landing-purple',
  },
  {
    icon: CheckCircle,
    title: 'Choisissez et validez',
    description:
      'Sélectionnez l\'artisan qui correspond le mieux à vos besoins et budget. Suivez l\'avancement de vos travaux en temps réel sur votre tableau de bord.',
    iconColor: 'text-landing-orange',
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-section-md md:py-section-lg bg-landing-white">
      <Container>
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center mb-6"
          >
            <Badge icon="🚀">Comment ça marche</Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-heading-3-mobile md:text-heading-2-tablet lg:text-heading-2 font-medium text-landing-black mb-6"
          >
            Démarrez en trois
            <br />
            étapes simples
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-body-18 text-landing-secondary max-w-2xl mx-auto"
          >
            Notre processus simplifié vous permet de gérer vos travaux de copropriété en toute sérénité
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-24">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.6,
                delay: 0.3 + index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col items-start"
            >
              {/* Image Placeholder */}
              <div className="mb-6 w-full aspect-[1.37] rounded-medium overflow-hidden bg-gradient-to-br from-landing-blue-lite via-landing-purple-lite to-landing-pink-lite flex items-center justify-center relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <step.icon
                    className={`w-12 h-12 md:w-16 md:h-16 ${step.iconColor}`}
                    strokeWidth={1.5}
                  />
                  <span className="text-landing-secondary text-sm">
                    Image à venir
                  </span>
                </div>
              </div>

              {/* Number Badge */}
              <div className="mb-4 px-3 py-1 bg-landing-gray-dark rounded-pill text-body-14 font-medium text-landing-black">
                Étape {index + 1}
              </div>

              {/* Title */}
              <h3 className="text-heading-4-mobile md:text-heading-4 font-medium text-landing-black mb-4">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-body-16 text-landing-secondary leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
