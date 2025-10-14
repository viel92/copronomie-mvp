'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { Container, Button } from '../ui'

export function FooterCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-landing-black overflow-hidden"
    >
      {/* Decorative gradient ellipses */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-landing-purple/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-landing-blue/30 rounded-full blur-3xl" />
      </div>

      <Container>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-heading-3-mobile md:text-heading-2-tablet lg:text-heading-2 font-medium text-white mb-6"
          >
            Prêt à simplifier la gestion de vos travaux de copropriété ?
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-body-18 text-white/80 mb-10 max-w-2xl mx-auto"
          >
            Rejoignez des centaines de syndics qui font confiance à Copronomie pour gérer leurs projets efficacement
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">Commencer gratuitement</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact" className="!text-white !border-white hover:!bg-white hover:!text-landing-black">
                Demander une démo
              </Link>
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
