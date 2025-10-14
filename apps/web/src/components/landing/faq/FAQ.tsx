'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Container, Badge } from '../ui'
import { FAQItem } from './FAQItem'

const faqs = [
  {
    question: 'C\'est vraiment gratuit pour les syndics ? Où est l\'arnaque ?',
    answer: 'Oui, c\'est 100% gratuit pour les syndics, sans frais cachés, sans engagement, sans carte bancaire. Notre modèle économique est simple : les artisans paient un abonnement pour accéder aux appels d\'offres. Vous ne payez jamais rien, ni commission, ni frais de dossier.'
  },
  {
    question: 'Comment être sûr que les artisans sont fiables ?',
    answer: 'Nous vérifions systématiquement : SIRET valide, assurance RC décennale à jour, certifications professionnelles (RGE, Qualibat, etc.). Chaque artisan a aussi un historique d\'avis de syndics qui ont travaillé avec lui. Seuls les professionnels sérieux sont acceptés.'
  },
  {
    question: 'Combien de temps faut-il pour recevoir des devis ?',
    answer: 'En moyenne 48h pour les premiers devis. Vous pouvez recevoir entre 3 et 10 devis selon votre projet. Fini l\'attente interminable ou les artisans qui ne rappellent jamais : ils sont notifiés automatiquement et motivés à répondre rapidement.'
  },
  {
    question: 'Que se passe-t-il si je ne suis pas satisfait d\'un devis ?',
    answer: 'Aucune obligation de choisir un devis. Vous comparez en toute liberté, vous pouvez demander des précisions aux artisans via la messagerie, ou simplement refuser tous les devis si aucun ne convient. Vous restez 100% maître de vos décisions.'
  },
  {
    question: 'Est-ce que je peux gérer plusieurs copropriétés ?',
    answer: 'Oui, absolument. Vous pouvez gérer autant de copropriétés que vous voulez, publier des appels d\'offres illimités, et tout suivre depuis un seul tableau de bord. C\'est particulièrement utile pour les syndics professionnels qui gèrent plusieurs immeubles.'
  },
  {
    question: 'Comment présenter ça en assemblée générale ?',
    answer: 'La plateforme génère automatiquement des exports PDF avec tous les devis comparés côte à côte, l\'historique des échanges, et les certifications des artisans. Tout est transparent et facilement présentable en AG. La conformité ALUR est assurée.'
  },
  {
    question: 'Que se passe-t-il après avoir choisi un artisan ?',
    answer: 'Une fois l\'artisan choisi, vous gérez directement avec lui comme d\'habitude. Copronomie facilite juste la mise en relation et la comparaison. Vous gardez votre liberté totale sur le suivi de chantier et les modalités de paiement.'
  },
  {
    question: 'Ça marche pour quels types de travaux ?',
    answer: 'Tous types de travaux : ravalement, toiture, plomberie, électricité, ascenseurs, chauffage collectif, espaces verts, nettoyage, etc. De la petite réparation urgente aux gros chantiers de rénovation. Si vous avez besoin d\'un artisan, on a ce qu\'il vous faut.'
  }
]

export function FAQ() {
  const headerRef = useRef(null)
  const listRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' })
  const isListInView = useInView(listRef, { once: true, margin: '-100px' })

  return (
    <section id="faq" className="py-24 bg-landing-light">
      <Container>
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center mb-6"
          >
            <Badge icon="❓">FAQ</Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold text-landing-primary mb-4"
          >
            Questions fréquentes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl text-landing-primary/70"
          >
            Les réponses aux questions que se posent les syndics
          </motion.p>
        </div>

        {/* FAQ List */}
        <motion.div
          ref={listRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isListInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-card p-8"
        >
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isListInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mt-12"
        >
          <p className="text-landing-primary/70">
            Vous avez d'autres questions ?{' '}
            <a
              href="mailto:support@copronomie.fr"
              className="text-landing-primary font-semibold hover:underline"
            >
              Contactez-nous
            </a>
          </p>
        </motion.div>
      </Container>
    </section>
  )
}
