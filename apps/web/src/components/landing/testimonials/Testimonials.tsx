'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Container, Badge } from '../ui'
import { TestimonialCard } from './TestimonialCard'

const testimonials = [
  {
    quote: "Avant, je passais des heures à contacter des artisans et à relancer pour avoir 3 devis. Avec Copronomie, j'ai 5 devis qualifiés en moins de 48h. C'est un gain de temps considérable.",
    author: "Marie Dubois",
    role: "Syndic professionnelle",
    company: "12 copropriétés • Paris 15ème"
  },
  {
    quote: "Le gros plus, c'est la vérification des assurances et certifications. Je ne perds plus de temps à vérifier moi-même. Et c'est 100% gratuit pour nous, difficile de faire mieux.",
    author: "Jean Martin",
    role: "Gestionnaire de copropriété",
    company: "8 copropriétés • Lyon"
  },
  {
    quote: "J'ai utilisé Copronomie pour une réfection de toiture. Les artisans étaient sérieux, réactifs, et les devis parfaitement détaillés pour présentation en AG.",
    author: "Sophie Leclerc",
    role: "Syndic bénévole",
    company: "45 lots • Marseille"
  },
  {
    quote: "Plus besoin de justifier ma sélection d'artisans en AG. Tout est transparent : avis, certifications, historique. Les copropriétaires ont confiance.",
    author: "Thomas Bernard",
    role: "Syndic professionnel",
    company: "25 copropriétés • Toulouse"
  }
]

export function Testimonials() {
  const headerRef = useRef(null)
  const isInView = useInView(headerRef, { once: true, margin: '-100px' })

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    skipSnaps: false
  })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <section id="testimonials" className="py-24 bg-landing-light">
      <Container>
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center mb-6"
          >
            <Badge icon="💬">Témoignages</Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold text-landing-primary mb-4"
          >
            Des syndics qui gagnent du temps
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl text-landing-primary/70"
          >
            Professionnels et bénévoles, ils ont simplifié la gestion de leurs appels d'offres
          </motion.p>
        </div>

        {/* Carousel */}
        <div className="relative px-12 md:px-16">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
                >
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-landing-primary hover:text-white transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-landing-primary hover:text-white transition-all duration-300"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </Container>
    </section>
  )
}
