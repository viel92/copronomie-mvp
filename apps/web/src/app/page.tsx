import { Navigation } from '@/components/landing/navigation'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { About } from '@/components/landing/about'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Hero />
        <Features />
        <About />

        {/* Placeholder sections - Will be added in Jour 4 */}
        <section id="pricing" className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-landing-primary mb-4">Pricing Section</h2>
            <p className="text-landing-primary/70">Coming in Jour 4...</p>
          </div>
        </section>

        <section id="testimonials" className="min-h-screen flex items-center justify-center bg-landing-light">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-landing-primary mb-4">Testimonials Section</h2>
            <p className="text-landing-primary/70">Coming in Jour 4...</p>
          </div>
        </section>

        <section id="faq" className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-landing-primary mb-4">FAQ Section</h2>
            <p className="text-landing-primary/70">Coming in Jour 4...</p>
          </div>
        </section>
      </main>
    </>
  )
}
