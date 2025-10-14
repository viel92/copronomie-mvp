'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useAnimationFrame } from 'framer-motion'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Button, Badge, Container } from '../ui'
import { HeroTitle } from './HeroTitle'

const tickerItems = [
  'Gain de temps massif',
  'Artisans pré-qualifiés',
  'Comparaison facilitée',
  'Suivi centralisé',
  '100% gratuit syndics',
  'Conformité ALUR',
]

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const tickerRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  })

  // Parallax et fade effects au scroll
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const contentScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.98])

  // Ticker animation
  useAnimationFrame((time, delta) => {
    if (!tickerRef.current) return

    const speed = 70
    xRef.current -= (delta / 1000) * speed

    const itemWidth = tickerRef.current.scrollWidth / 2

    if (Math.abs(xRef.current) >= itemWidth) {
      xRef.current = 0
    }

    tickerRef.current.style.transform = `translateX(${xRef.current}px)`
  })

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-visible pt-32 pb-0"
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
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
          >
            <Badge icon="⚡">100% Gratuit pour les Syndics</Badge>
          </motion.div>

          {/* Animated Title - Exactly like Framer template */}
          <HeroTitle
            text="Trouvez les meilleurs artisans pour vos copropriétés en quelques clics"
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-landing-primary leading-tight"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl text-landing-primary/80 max-w-3xl mx-auto"
          >
            Publiez vos appels d'offres, comparez les devis qualifiés et gagnez du temps. Fini les relances interminables et les dossiers perdus.
          </motion.p>

          {/* Waitlist Form - Premium Framer Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl mx-auto"
          >
            <div className="relative">
              {/* Glassmorphic Container */}
              <div className="relative p-1.5 rounded-[20px] bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] border border-white/30">
                <div className="relative bg-white/60 backdrop-blur-md rounded-[16px] p-2">
                  <form className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1 group">
                      <input
                        type="email"
                        placeholder="Entrez votre email"
                        className="w-full h-14 px-6 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-transparent outline-none text-landing-primary placeholder:text-landing-primary/40 text-base font-medium transition-all duration-300 focus:border-landing-purple/30 focus:bg-white focus:shadow-[0_0_0_4px_rgba(211,123,255,0.1)]"
                        required
                      />
                    </div>
                    <Button type="submit" size="lg" className="whitespace-nowrap">
                      Rejoindre
                    </Button>
                  </form>
                </div>
              </div>

              {/* Subtle glow effect */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-landing-purple/20 via-landing-pink/20 to-landing-blue/20 blur-3xl opacity-50 rounded-[20px]" />
            </div>

            {/* Small text below */}
            <p className="text-center text-sm text-landing-primary/60 mt-4">
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L10.163 5.38071L15 6.13115L11.5 9.54427L12.326 14.3688L8 12.0807L3.674 14.3688L4.5 9.54427L1 6.13115L5.837 5.38071L8 1Z" fill="currentColor" className="text-landing-purple"/>
                </svg>
                Rejoignez <strong className="font-semibold">+500</strong> syndics sur la liste d'attente
              </span>
            </p>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
              100% gratuit pour les syndics
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
              Sans engagement
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
              Accès immédiat dès le lancement
            </span>
          </motion.div>
        </motion.div>
      </Container>

      {/* Ticker Section integrated in Hero - Full width */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full mt-16 md:mt-20 pb-12 md:pb-16"
      >
        <div className="relative h-[80px] md:h-[100px] flex items-center overflow-hidden">
          <div
            ref={tickerRef}
            className="flex items-center gap-12 md:gap-16 whitespace-nowrap"
            style={{ willChange: 'transform' }}
          >
            {/* Premier groupe */}
            {tickerItems.map((item, index) => (
              <div
                key={`first-${index}`}
                className="flex items-center gap-3 md:gap-4"
              >
                <span className="text-lg md:text-2xl lg:text-3xl font-medium text-landing-primary">
                  {item}
                </span>
                <Sparkles
                  className="w-6 h-6 md:w-8 md:h-8 text-landing-purple flex-shrink-0"
                  strokeWidth={1.5}
                />
              </div>
            ))}

            {/* Deuxième groupe (duplication pour boucle infinie) */}
            {tickerItems.map((item, index) => (
              <div
                key={`second-${index}`}
                className="flex items-center gap-3 md:gap-4"
              >
                <span className="text-lg md:text-2xl lg:text-3xl font-medium text-landing-primary">
                  {item}
                </span>
                <Sparkles
                  className="w-6 h-6 md:w-8 md:h-8 text-landing-purple flex-shrink-0"
                  strokeWidth={1.5}
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
