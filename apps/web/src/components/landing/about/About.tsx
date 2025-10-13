'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check } from 'lucide-react'
import { Container, Button } from '../ui'
import Link from 'next/link'

const benefits = [
  'Gestion centralisée de tous vos projets',
  'Gain de temps considérable dans la recherche d\'artisans',
  'Transparence totale sur les prix du marché',
  'Suivi en temps réel de l\'avancement',
  'Historique complet de vos échanges',
  'Support client réactif 7j/7',
]

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 bg-landing-light">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div className="inline-block px-4 py-2 bg-landing-primary/10 rounded-full">
              <span className="text-sm font-medium text-landing-primary">
                Pourquoi Copronomie ?
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-landing-primary leading-tight">
              Une plateforme pensée pour les syndics
            </h2>

            <p className="text-xl text-landing-primary/70 leading-relaxed">
              Simplifiez la gestion de vos travaux de copropriété avec une solution
              moderne et intuitive. Publiez vos projets, recevez des devis qualifiés
              et choisissez les meilleurs artisans en quelques clics.
            </p>

            {/* Benefits List */}
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{
                    delay: 0.3 + index * 0.1,
                    duration: 0.5,
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-landing-primary/80">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <div className="pt-4">
              <Button size="lg" asChild>
                <Link href="/register">Essayer gratuitement →</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right: Image/Mockup Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Placeholder for dashboard screenshot - Will add image in Jour 5 */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-2xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-20 h-20 mx-auto bg-landing-primary/10 rounded-2xl flex items-center justify-center">
                    <span className="text-4xl font-bold text-landing-primary">C</span>
                  </div>
                  <p className="text-landing-primary/60 text-sm">
                    Dashboard screenshot
                    <br />
                    <span className="text-xs">(Jour 5: Assets)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -top-6 -left-6 bg-white px-4 py-3 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-landing-primary">
                  150+ syndics actifs
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-white px-4 py-3 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-landing-primary">98%</span>
                <span className="text-sm text-landing-primary/70">
                  Satisfaction
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
