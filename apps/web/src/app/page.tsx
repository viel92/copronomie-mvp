import { Navigation } from '@/components/landing/navigation'
import { Hero } from '@/components/landing/hero'
import { Stats } from '@/components/landing/stats'
import { Features } from '@/components/landing/features'
import { About } from '@/components/landing/about'
import { Testimonials } from '@/components/landing/testimonials'
import { Pricing } from '@/components/landing/pricing'
import { FAQ } from '@/components/landing/faq'
import { Footer } from '@/components/landing/footer'
import { JsonLd } from '@/components/landing/structured-data'

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Navigation />
      <main className="min-h-screen">
        <Hero />
        <Stats />
        <Features />
        <About />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
