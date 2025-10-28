'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import CountUp from 'react-countup'
import { Container } from '../ui'
import { Building2, TrendingUp, Star, LucideIcon } from 'lucide-react'

interface Stat {
  icon: LucideIcon
  value: number
  suffix: string
  label: string
  separator?: string
}

const stats: Stat[] = [
  {
    icon: Building2,
    value: 75,
    suffix: '%',
    label: 'de temps gagné sur la gestion des appels d\'offres',
  },
  {
    icon: TrendingUp,
    value: 48,
    suffix: 'h',
    label: 'délai moyen de réponse des artisans qualifiés',
  },
  {
    icon: Star,
    value: 100,
    suffix: '%',
    label: 'gratuit pour les syndics, sans engagement',
  },
]

export function Stats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-section-md md:py-section-lg bg-white">
      <Container>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center"
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-landing-primary/10 rounded-full flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-landing-primary" />
                </div>
              </div>

              {/* Value with Counter Animation */}
              <div className="text-4xl md:text-5xl font-bold text-landing-black mb-2">
                {isInView ? (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    separator={stat.separator || ''}
                    suffix={stat.suffix || ''}
                    useEasing={true}
                    enableScrollSpy={false}
                  />
                ) : (
                  '0'
                )}
              </div>

              {/* Label */}
              <div className="text-landing-secondary text-sm md:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
