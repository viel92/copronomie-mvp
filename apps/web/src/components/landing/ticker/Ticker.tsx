'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'
import { Container } from '../ui'
import { Sparkles } from 'lucide-react'

const tickerItems = [
  'Simplifiez vos travaux',
  'Devis qualifiés',
  'Artisans vérifiés',
  'Gestion simplifiée',
  'Transparence totale',
  'Gain de temps',
]

export function Ticker() {
  const tickerRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)

  useAnimationFrame((time, delta) => {
    if (!tickerRef.current) return

    // Vitesse : 70px par seconde (d'après les specs Framer)
    const speed = 70
    xRef.current -= (delta / 1000) * speed

    // Largeur d'un groupe d'items
    const itemWidth = tickerRef.current.scrollWidth / 2

    // Reset quand on a scrollé la moitié
    if (Math.abs(xRef.current) >= itemWidth) {
      xRef.current = 0
    }

    tickerRef.current.style.transform = `translateX(${xRef.current}px)`
  })

  return (
    <section className="py-16 md:py-24 bg-landing-gray overflow-hidden">
      <Container>
        <div className="relative h-[120px] md:h-[200px] flex items-center">
          <div
            ref={tickerRef}
            className="flex items-center gap-16 md:gap-24 whitespace-nowrap"
            style={{ willChange: 'transform' }}
          >
            {/* Premier groupe */}
            {tickerItems.map((item, index) => (
              <div
                key={`first-${index}`}
                className="flex items-center gap-4 md:gap-6"
              >
                <span className="text-xl md:text-3xl lg:text-4xl font-medium text-landing-black">
                  {item}
                </span>
                <Sparkles
                  className="w-8 h-8 md:w-12 md:h-12 text-landing-blue flex-shrink-0"
                  strokeWidth={1.5}
                />
              </div>
            ))}

            {/* Deuxième groupe (duplication pour boucle infinie) */}
            {tickerItems.map((item, index) => (
              <div
                key={`second-${index}`}
                className="flex items-center gap-4 md:gap-6"
              >
                <span className="text-xl md:text-3xl lg:text-4xl font-medium text-landing-black">
                  {item}
                </span>
                <Sparkles
                  className="w-8 h-8 md:w-12 md:h-12 text-landing-blue flex-shrink-0"
                  strokeWidth={1.5}
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
