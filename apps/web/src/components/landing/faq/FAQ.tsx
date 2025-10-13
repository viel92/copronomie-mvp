'use client'

import { Container } from '../ui'
import { FAQItem } from './FAQItem'

const faqs = [
  {
    question: 'Comment fonctionne Copronomie ?',
    answer: 'Copronomie est une plateforme qui met en relation les syndics de copropriété avec des artisans qualifiés. Vous publiez votre projet en quelques clics, recevez des devis de professionnels vérifiés, et choisissez la meilleure offre pour votre copropriété.'
  },
  {
    question: 'Combien de temps faut-il pour recevoir des devis ?',
    answer: 'En moyenne, vous recevrez vos premiers devis sous 48h. Les artisans ont 7 jours pour soumettre leur proposition. Vous êtes notifié en temps réel dès qu\'un nouveau devis arrive.'
  },
  {
    question: 'Les artisans sont-ils vérifiés ?',
    answer: 'Oui, absolument. Tous les artisans de notre plateforme sont vérifiés : nous contrôlons leur SIRET, leurs assurances professionnelles et leurs certifications. Seuls les professionnels qualifiés peuvent soumettre des devis.'
  },
  {
    question: 'Puis-je annuler mon abonnement à tout moment ?',
    answer: 'Oui, votre abonnement est sans engagement. Vous pouvez l\'annuler à tout moment depuis votre espace personnel. En cas d\'annulation, vous gardez l\'accès jusqu\'à la fin de la période payée.'
  },
  {
    question: 'Y a-t-il une commission sur les devis ?',
    answer: 'Non, nous ne prenons aucune commission sur les devis ou les travaux réalisés. Notre modèle est basé uniquement sur l\'abonnement mensuel. Les prix que vous voyez sont les vrais prix des artisans.'
  },
  {
    question: 'Puis-je inviter d\'autres utilisateurs de ma structure ?',
    answer: 'Oui, avec le plan Entreprise, vous pouvez créer plusieurs comptes utilisateurs pour vos collaborateurs. Chaque utilisateur aura accès aux projets de votre structure avec des permissions personnalisables.'
  },
  {
    question: 'Proposez-vous une période d\'essai ?',
    answer: 'Oui, tous nos plans incluent 14 jours d\'essai gratuit. Aucune carte bancaire n\'est requise pour commencer. Testez toutes les fonctionnalités sans engagement.'
  },
  {
    question: 'Comment contacter le support ?',
    answer: 'Notre équipe support est disponible par email (support@copronomie.fr) et chat en ligne. Le plan Professionnel bénéficie d\'un support prioritaire 7j/7, et le plan Entreprise d\'un account manager dédié.'
  }
]

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-landing-light">
      <Container>
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-landing-primary mb-4">
            Questions fréquentes
          </h2>
          <p className="text-xl text-landing-primary/70">
            Tout ce que vous devez savoir sur Copronomie
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-card p-8">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-landing-primary/70">
            Vous avez d'autres questions ?{' '}
            <a
              href="mailto:support@copronomie.fr"
              className="text-landing-primary font-semibold hover:underline"
            >
              Contactez-nous
            </a>
          </p>
        </div>
      </Container>
    </section>
  )
}
