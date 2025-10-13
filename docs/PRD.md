# PRD (Product Requirements Document) - Copronomie

## 1. Vision Produit

### Vision
Copronomie est la plateforme de référence qui simplifie et digitalise la mise en concurrence de tous les services et contrats de copropriété en France, en connectant de manière transparente les syndics de copropriété avec des prestataires qualifiés.

### Mission
Transformer le processus traditionnel, chronophage et inefficace de mise en concurrence pour tous les besoins de copropriété (contrats de services récurrents, contrats d'énergie, assurances, maintenance, travaux...) en une expérience digitale fluide, transparente et collaborative pour tous les acteurs.

### Problématique Résolue
- **Pour les Syndics** : Difficulté à trouver et comparer rapidement des prestataires qualifiés pour tous types de services (contrats de ménage, d'énergie, d'assurances, travaux...), gestion manuelle des propositions commerciales et devis, manque de traçabilité, renouvellement chronophage des contrats récurrents, dispersion des informations entre multiples prestataires, pas de comparaisons disponibles...
- **Pour les Prestataires** : Accès limité aux opportunités de copropriété tous secteurs confondus, processus de réponse complexe et non standardisé, difficulté à se différencier face à la concurrence et à fidéliser les syndics

## 2. Besoins Utilisateurs

### Syndics de Copropriété

**Besoins Primaires:**
- Créer et gérer des appels d'offres pour tous types de besoins :
  - **Contrats récurrents** : Ménage, gardiennage, entretien espaces verts, maintenance ascenseurs...
  - **Contrats d'énergie** : Gaz, électricité, contrats de fourniture et maintenance
  - **Assurances** : Multirisque immeuble, dommages-ouvrage...
  - **Travaux ponctuels** : Rénovation, ravalement, étanchéité, électricité, menuiserie, plomberie...
  - **Services spécialisés** : Audits énergétiques, contrôles réglementaires, sécurité incendie...
- Lancer des consultations ciblées vers plusieurs prestataires qualifiés selon leur métier
- Comparer facilement les propositions reçues (propositions commerciales pour contrats, devis pour travaux ponctuels)
- Suivre l'avancement des consultations et l'exécution des prestations
- Gérer leur portefeuille de copropriétés avec vue consolidée des contrats multi-services
- Anticiper et gérer les renouvellements de contrats récurrents (alertes automatiques)
- Créer de manière automatique les attestation TVA 10%

**Besoins Secondaires:**
- Historique complet des consultations, devis et contrats
- Communication centralisée avec tous les prestataires
- Gestion documentaire multi-services (contrats, attestations, factures)
- Reporting pour les assemblées générales
- Alertes sur les échéances contractuelles
- Benchmark des prix par catégorie de service

### Prestataires (Multi-métiers)

**Besoins Primaires:**
- Accéder à des opportunités qualifiées correspondant à leur métier (BTP, services, énergie, assurances, etc.)
- Soumettre des offres de manière structurée selon leur domaine
- Suivre le statut de leurs propositions
- Gérer leur profil, qualifications et certifications spécifiques

**Besoins Secondaires:**
- Historique des contrats remportés
- Statistiques de performance (taux de conversion par type d'offre)
- Communication directe avec les syndics
- Gestion de la facturation et des renouvellements

## 3. Fonctionnalités Actuelles

### Module Authentification
- Inscription/Connexion multi-rôles (Syndic/Prestataire)
- Gestion de profils utilisateurs
- Sécurité basée sur Supabase Auth

### Module Copropriétés (Syndics)
- Import en masse via SIRET
- Création manuelle de copropriétés
- Gestion du portefeuille
- Filtrage et recherche

### Module Consultations (ex-Projets)
**Pour les Syndics:**
- Création de consultations détaillées (titre, description, catégorie de service, budget/coût annuel estimé, durée contractuelle pour contrats récurrents)
- Catégorisation par type de besoin (5 catégories principales) :
  - **Services récurrents** : Ménage, entretien espaces verts, gardiennage, maintenance ascenseurs, chauffage, gestion des déchets, sécurité...
  - **Contrats d'énergie** : Gaz, électricité, chauffage collectif, fourniture et maintenance...
  - **Assurances** : Multirisque immeuble, responsabilité civile, dommages-ouvrage, protection juridique...
  - **Travaux ponctuels** : Rénovation, construction, ravalement, étanchéité, toiture, menuiserie, plomberie, électricité...
  - **Services spécialisés** : Audits énergétiques, diagnostics techniques, contrôles réglementaires, dératisation, désamiantage...
- Sélection de la copropriété concernée et attachement aux contrats existants
- Gestion des statuts (DRAFT, PUBLISHED, IN_PROGRESS, COMPLETED, CANCELLED)
- Édition et suppression de consultations
- Lancement d'appels d'offres ciblés par métier avec templates adaptés

**Pour les Prestataires:**
- Visualisation des consultations correspondant à leur(s) métier(s)
- Filtrage par catégorie de service
- Détails complets des consultations
- Possibilité de soumettre des offres

### Module Offres (ex-Devis)
**Pour les Prestataires:**
- Création d'offres adaptées au type de service avec formulaires spécifiques :
  - **Propositions commerciales** pour contrats récurrents (tarif mensuel/annuel, durée d'engagement, prestations incluses, fréquence des interventions, clauses de révision)
  - **Contrats d'énergie** : Tarifs au kWh, abonnements, durée d'engagement, options vertes
  - **Assurances** : Primes annuelles, garanties, franchises, exclusions
  - **Devis détaillés** pour travaux ponctuels (lignes d'ouvrage, quantités, prix unitaire, délais d'exécution)
- Calcul automatique TTC avec TVA adaptée selon le service (TVA réduite pour certains travaux, TVA normale pour services)
- Gestion du statut (DRAFT, SUBMITTED, ACCEPTED, REJECTED)
- Ajout de documents justificatifs selon le métier (assurances décennale pour BTP, certifications NF Service pour ménage, garanties financières pour énergie, attestations professionnelles)

**Pour les Syndics:**
- Réception et visualisation des offres
- Comparaison des offres par catégorie (grille comparative)
- Acceptation/Rejet d'offres
- Historique complet par type de service

### Tableaux de Bord
**Syndic Dashboard:**
- Vue d'ensemble multi-services avec répartition par catégorie (contrats récurrents, énergie, assurances, travaux, services spécialisés)
- Statistiques globales (consultations actives, propositions reçues, contrats en cours par type de service)
- Alertes prioritaires sur renouvellements de contrats récurrents à venir (30/60/90 jours)
- Suivi budgétaire consolidé par catégorie de dépense
- Actions rapides par catégorie avec accès direct aux templates

**Prestataire Dashboard:**
- Consultations disponibles filtrées selon le(s) métier(s) déclaré(s)
- Propositions et devis en cours (statut, délai de réponse)
- Statistiques de performance par catégorie (taux de réponse, taux de conversion, valeur moyenne)
- Contrats actifs par type avec échéances de renouvellement
- Historique des consultations remportées par secteur d'activité

## 4. Architecture Technique Actuelle

### Stack Technologique
- **Frontend:** Next.js 14 (App Router), React, TypeScript, TailwindCSS
- **Backend:** tRPC, Node.js, TypeScript
- **Base de données:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentification:** Supabase Auth
- **Monorepo:** Turborepo avec pnpm

### Structure du Code
```
apps/
├── web/          # Application Next.js
├── api/          # API tRPC
packages/
├── database/     # Schéma Prisma, migrations
├── ui/           # Composants UI partagés
```

### Sécurité
- Row Level Security (RLS) sur Supabase
- Authentification JWT
- Validation des données avec Zod
- Middleware de protection des routes

## 5. Fonctionnalités Planifiées

### Phase 1 - MVP Consolidation (Q1 2025)
- [ ] Extension et finalisation des catégories de services
  - [ ] Templates spécifiques par catégorie :
    - **Contrats récurrents** : Formulaires adaptés (ménage, gardiennage, espaces verts, etc.)
    - **Contrats d'énergie** : Grille tarifaire, indexation, durée d'engagement
    - **Assurances** : Garanties, franchises, sinistralité
    - **Travaux ponctuels** : Devis détaillés avec quantitatifs
    - **Services spécialisés** : Audits, diagnostics, contrôles réglementaires
  - [ ] Champs personnalisés et validations selon le type de consultation
- [ ] Système de notifications en temps réel multi-canal (échéances contrats, nouvelles propositions, messages, alertes réglementaires)
- [ ] Chat intégré syndic-prestataire avec historique par consultation
- [ ] Upload et gestion documentaire multi-formats (contrats, attestations, certifications, factures, rapports)
- [ ] Amélioration de l'UX mobile avec accès rapide par catégorie de service
- [ ] Système de notation et avis multi-critères adapté par catégorie (qualité de service, respect délais, rapport qualité-prix, professionnalisme)

### Phase 2 - Croissance (Q2 2025)
- [ ] Module de gestion de contrats récurrents
  - [ ] Suivi des échéances et renouvellements automatiques
  - [ ] Alertes préventives (3 mois, 6 mois avant échéance)
  - [ ] Historique des reconductions
- [ ] Tableau de bord analytique avancé
  - [ ] Comparaison des coûts par catégorie de service
  - [ ] Benchmark inter-copropriétés
  - [ ] Suivi budgétaire multi-services
- [ ] Export de données (PDF, Excel) par catégorie
- [ ] Intégration calendrier (échéances contractuelles)
- [ ] API publique pour intégrations tierces (logiciels de syndic)

### Phase 3 - Scale (Q3-Q4 2025)
- [ ] Marketplace de prestataires multi-métiers vérifiés avec badges de certification
  - [ ] **BTP** : Qualibat, RGE, garantie décennale
  - [ ] **Services** : NF Service, Qualipropre, certifications professionnelles
  - [ ] **Énergie** : Garanties financières ATRD/ATRT, certifications fournisseurs
  - [ ] **Assurances** : ORIAS, accréditations ACPR
  - [ ] Profils enrichis avec spécialités, zones d'intervention, références clients
- [ ] Module d'assurance qualité adapté par type de prestation (KPIs sectoriels)
- [ ] Module de paiement sécurisé et facturation multi-services
- [ ] Application mobile native avec notifications push par catégorie
- [ ] IA pour matching automatique consultation-prestataire selon métier, localisation et historique
- [ ] Recommandations intelligentes basées sur performances, prix et satisfaction par type de service
- [ ] Détection automatique des besoins de renouvellement avec analyse prédictive des contrats

## 6. Métriques de Succès

### Métriques d'Adoption
- **Syndics inscrits:** Objectif 100 en 6 mois avec utilisation multi-services
- **Prestataires inscrits:** Objectif 500 en 6 mois (répartition équilibrée)
  - Services récurrents: 200 (ménage, gardiennage, espaces verts, ascenseurs...)
  - BTP/Travaux: 150 (tous corps de métiers)
  - Énergie: 70 (gaz, électricité, chauffage)
  - Assurances: 50 (courtiers, compagnies)
  - Services spécialisés: 30 (audits, diagnostics, contrôles)
- **Consultations créées:** Objectif 50/mois après 3 mois avec mix équilibré par catégorie
- **Taux d'activation:** >60% des inscrits créent au moins 1 consultation/proposition
- **Diversité d'usage:** >70% des syndics actifs utilisent au moins 2 catégories de services différentes

### Métriques d'Engagement
- **Taux de conversion consultation→propositions:** >40% (tous types confondus)
- **Temps moyen de réponse prestataire:**
  - Services récurrents et contrats: <5 jours
  - Travaux ponctuels urgents: <48h
  - Contrats d'énergie/assurances: <7 jours
- **Nombre moyen de propositions par consultation:** 3-5 (variance selon la catégorie)
- **Taux de complétion de profil:** >80% avec certifications métiers renseignées
- **Diversité des catégories utilisées:** >3 catégories différentes par syndic actif (indicateur clé de l'usage multi-services)

### Métriques Business
- **Taux d'acceptation des propositions:** >25% (tous types confondus)
- **Valeur moyenne par catégorie (contrat/projet):**
  - Contrats de services récurrents (annuels): €5,000-€20,000
  - Contrats d'énergie (annuels): €10,000-€30,000
  - Assurances (primes annuelles): €3,000-€15,000
  - Travaux ponctuels: €15,000-€50,000
  - Services spécialisés: €2,000-€10,000
- **GMV (Gross Merchandise Value):** €500k en 12 mois (toutes catégories) avec répartition équilibrée
- **ARR (Annual Recurring Revenue):** Suivi spécifique des contrats récurrents (services, énergie, assurances)
- **NPS (Net Promoter Score):** >40 avec mesure différenciée par catégorie de service

### Métriques Techniques
- **Uptime:** >99.5%
- **Temps de chargement:** <2s
- **Taux d'erreur:** <0.1%
- **Performance Lighthouse:** >90/100

## 7. Exigences Techniques

### Performance
- Temps de réponse API: <200ms (p95)
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Support de 1000 utilisateurs simultanés

### Sécurité
- Conformité RGPD
- Chiffrement des données sensibles
- Audits de sécurité trimestriels
- Sauvegarde quotidienne des données

### Scalabilité
- Architecture serverless ready
- CDN pour assets statiques
- Mise en cache stratégique
- Database indexing optimisé

### Compatibilité
- Navigateurs: Chrome, Firefox, Safari, Edge (2 dernières versions)
- Devices: Desktop, Tablet, Mobile
- Responsive design obligatoire

## 8. Priorités de Développement

### P0 - Critique (Semaine 1-2)
- Stabilisation du flux devis complet
- Corrections bugs critiques
- Tests end-to-end

### P1 - Haute (Semaine 3-6)
- Notifications email automatiques
- Upload de documents
- Amélioration UX mobile
- Système de recherche avancé

### P2 - Moyenne (Mois 2-3)
- Chat intégré
- Analytique avancée
- Export de données
- Système de notation

### P3 - Basse (Mois 4-6)
- Intégrations tierces
- API publique
- Fonctionnalités avancées

## 9. Contraintes et Dépendances

### Contraintes
- **Cadre légal copropriété :**
  - Respect des règles de copropriété et de la loi ALUR
  - Respect des seuils de mise en concurrence obligatoire selon les montants
  - Conformité avec les exigences d'assemblée générale (votes, justifications)
- **Réglementations sectorielles spécifiques :**
  - **Services récurrents** : Respect du Code du travail, conventions collectives
  - **Contrats d'énergie** : Réglementation ATRD/ATRT, code de l'énergie
  - **Assurances** : Code des assurances, obligations ORIAS
  - **Travaux BTP** : Garanties légales (décennale, biennale), certifications Qualibat/RGE
  - **Services spécialisés** : Normes techniques, habilitations réglementaires
- **Protection des données :**
  - Conformité RGPD stricte (données sensibles des copropriétés)
  - Sécurisation des documents contractuels

### Dépendances Techniques
- Supabase (BDD + Auth)
- Vercel (Hébergement)
- Services tiers pour emails (à définir)
- Potentiellement : API externes pour vérification SIRET, certifications métiers

### Risques
- **Adoption du marché :**
  - Syndics traditionnels peu digitalisés, résistance au changement
  - Concurrence de plateformes établies spécialisées par secteur (Orgeco, Companeo, etc.)
  - Difficulté à atteindre une masse critique sur chaque catégorie simultanément
- **Complexité opérationnelle :**
  - Réglementations sectorielles très différentes nécessitant une expertise multi-domaines
  - Nécessité d'adapter l'UX, les workflows et les templates selon chaque catégorie
  - Challenge du support client multi-métiers (besoin d'expertise variée)
- **Positionnement et légitimité :**
  - Besoin de crédibilité sur plusieurs métiers très différents (BTP ≠ Assurances ≠ Énergie)
  - Risque de perception "généraliste" vs "expert" face aux plateformes spécialisées
- **Dépendances techniques :**
  - Services tiers (Supabase, Vercel, APIs externes de vérification)
  - Nécessité d'intégrations avec logiciels de syndic existants
