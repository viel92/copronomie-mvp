'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Button, Badge, Container } from '../ui'
import { HeroTitle } from './HeroTitle'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  })

  // Parallax et fade effects au scroll
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const contentScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.98])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20"
    >
      {/* Background with gradient and parallax */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ y: backgroundY }}
      >
        {/* Gradient background using Framer colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-landing-blue-lite via-landing-purple-lite to-landing-pink-lite" />

        {/* Decorative blur orbs with floating animations */}
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 rounded-full mix-blend-normal filter blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, rgb(211, 123, 255) 0%, transparent 70%)' }}
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute top-40 -right-20 w-96 h-96 rounded-full mix-blend-normal filter blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, rgb(128, 170, 253) 0%, transparent 70%)' }}
          animate={{
            y: [0, 25, 0],
            x: [0, -20, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-96 h-96 rounded-full mix-blend-normal filter blur-3xl opacity-25"
          style={{ background: 'radial-gradient(circle, rgb(252, 172, 132) 0%, transparent 70%)' }}
          animate={{
            y: [0, -15, 0],
            x: [0, 20, 0],
            scale: [1, 1.08, 1]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
        />
      </motion.div>

      <Container>
        <motion.div
          className="text-center space-y-8 max-w-5xl mx-auto"
          style={{ opacity: contentOpacity, scale: contentScale }}
        >
          {/* Badge with icon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center"
          >
            <Badge icon="⚡">Syndics & Copropriétaires</Badge>
          </motion.div>

          {/* Animated Title - Exactly like Framer template */}
          <HeroTitle
            text="La plateforme qui réinvente la gestion des devis en copropriété"
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-landing-primary leading-tight"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl md:text-2xl text-landing-primary/80 max-w-3xl mx-auto"
          >
            Publiez vos projets, recevez des devis qualifiés et trouvez les
            meilleurs artisans pour votre copropriété. Sans effort.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" asChild>
              <Link href="/register">Commencer gratuitement →</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href="#features">Découvrir</a>
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-landing-primary/70"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Gratuit pendant 30 jours
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Sans carte bancaire
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Configuration en 5 minutes
            </span>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
