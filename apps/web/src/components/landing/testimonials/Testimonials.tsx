'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Container } from '../ui'
import { TestimonialCard } from './TestimonialCard'

const testimonials = [
  {
    quote: "Copronomie a complètement transformé notre façon de gérer les travaux. Nous recevons des devis qualifiés en 48h au lieu de 2 semaines.",
    author: "Marie Dubois",
    role: "Syndic de copropriété",
    company: "Immo Syndic Paris"
  },
  {
    quote: "La transparence sur les prix et la qualité des artisans nous ont fait économiser 15% sur notre dernier chantier de rénovation.",
    author: "Jean Martin",
    role: "Gestionnaire",
    company: "Foncia Lyon"
  },
  {
    quote: "Interface intuitive et support réactif. Je recommande vivement à tous les syndics qui veulent gagner du temps.",
    author: "Sophie Bernard",
    role: "Syndic professionnel",
    company: "Century 21 Marseille"
  },
  {
    quote: "Nous avons publié 12 projets en 3 mois. Le suivi en temps réel nous permet de tenir informés tous les copropriétaires facilement.",
    author: "Thomas Petit",
    role: "Administrateur de biens",
    company: "Nexity Toulouse"
  }
]

export function Testimonials() {
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
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-landing-primary mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-landing-primary/70">
            Découvrez les retours d'expérience de syndics professionnels
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
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
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-landing-primary hover:text-white transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-landing-primary hover:text-white transition-all duration-300"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </Container>
    </section>
  )
}
