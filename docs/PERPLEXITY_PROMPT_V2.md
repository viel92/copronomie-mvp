# BRIEF STRATÉGIQUE - COPRONOMIE
## Plateforme SaaS B2B Marketplace pour Travaux de Copropriété

---

## 🎯 OBJECTIF DE L'ANALYSE

Tu es un **consultant senior spécialisé en SaaS B2B, proptech et stratégie marketplace**.

Ta mission : Produire un **dossier stratégique exhaustif et actionnable** pour le lancement de Copronomie, avec :
- Données chiffrées françaises vérifiables
- Benchmarks startups comparables
- Best practices internationales adaptées au contexte français
- Recommandations opérationnelles immédiates

**Format :** Document markdown structuré avec sections numérotées, tableaux comparatifs, checklists actionnables.

---

## 📋 CONTEXTE PROJET

### Le Concept
**Copronomie** est une marketplace B2B qui connecte **syndics de copropriété** avec **entreprises de travaux/services**.

**Problème résolu :**
- **Syndics** : Recherche manuelle d'entreprises chronophage, gestion dispersée (emails/Excel), difficulté à comparer les offres, manque de traçabilité
- **Entreprises** : Accès limité aux projets copropriété, prospection coûteuse, processus réponse non standardisé

### Périmètre Services Couverts

**1. Contrats Récurrents (priorité MVP)**
- Ménage parties communes
- Gardiennage et sécurité
- Entretien espaces verts
- Maintenance ascenseurs/chauffage

**2. Travaux Ponctuels**
- Ravalement façade
- Toiture/étanchéité
- Plomberie, électricité, menuiserie
- Isolation thermique

**3. Contrats d'Énergie**
- Électricité/gaz
- Optimisation énergétique

**4. Assurances**
- Multirisque immeuble
- Dommages-ouvrage
- Responsabilité civile

**5. Services Spécialisés**
- Audits énergétiques (DPE)
- Diagnostics techniques
- Contrôles réglementaires

### Utilisateurs Cibles

**CÔTÉ SYNDICS (Supply = apportent projets) :**
- **Syndics professionnels** : Petits cabinets (50-200 copros), cabinets moyens (200-1000 copros), grands groupes (Foncia, Nexity)
- **Syndics bénévoles** : Cible secondaire

**CÔTÉ ENTREPRISES (Demand = consomment projets) :**
- Entreprises BTP (TPE à grands groupes)
- Sociétés de nettoyage et facility management
- Mainteneurs (ascenseurs, chauffage)
- Fournisseurs énergie et courtiers
- Compagnies assurance
- Bureaux d'études et diagnostiqueurs

### Stack Technique (Non négociable)
- **Frontend** : Next.js 15 App Router, TypeScript, TailwindCSS
- **Backend** : tRPC, Prisma ORM
- **Database** : PostgreSQL (Supabase)
- **Auth** : Supabase Auth
- **Hosting** : Vercel (frontend), Railway/VPS (backend)
- **Payments** : Stripe
- **Email** : Resend

### Situation Actuelle

**Ressources :**
- Fondateur solo (gestionnaire copropriété + compétences fullstack)
- Budget : Bootstrap 5-10K€ sur 6 mois
- Réseau LinkedIn : 724 abonnés (syndics, gestionnaires, prestataires)
- Temps plein sur projet (6-12 mois runway)

**MVP Technique :**
- Application 70% complète
- Workflow fonctionnel : syndic crée projet → entreprise soumet devis → syndic accepte
- En préparation de déploiement beta

**Objectifs 12 Mois :**
- **MVP beta** : M3
- **Lancement public** : M6
- **Clients payants** : 50 entreprises à M6, 150 à M12
- **MRR** : 5K€ à M6, 20K€ à M12
- **Projets actifs** : 50/mois à M6, 150/mois à M12

---

## 💰 MODÈLE ÉCONOMIQUE RETENU

### ⚠️ IMPORTANT - Spécificités Copronomie

**SYNDICS = GRATUIT (au moins phase 1-2)**
- Objectif : Maximiser le nombre de projets sur la plateforme
- Les syndics apportent le "produit" (projets)
- Pas de facturation syndics au lancement (peut être envisagée phase 3+ pour plans premium)

**ENTREPRISES = PAYANT (abonnements mensuels)**
- Les entreprises "consomment" le produit (accès projets)
- Modèle : 3 plans d'abonnement (49€, 149€, 299€/mois)
- Monétisation basée sur l'accès au flux de projets qualifiés
- ROI direct : 1 chantier gagné = 100-200x l'investissement mensuel

**❌ PAS DE COMMISSION SUR LES TRAVAUX**
- Modèle commission écarté (complexité tracking, alignement intérêts)
- Revenus 100% basés sur abonnements récurrents (MRR/ARR)

**Pourquoi ce modèle ?**
- Marché entreprises 10x plus large que syndics (dizaines de milliers vs 5000)
- Motivation d'achat claire pour entreprises (gagner chantiers)
- Budget commercial existant chez entreprises
- Potentiel ARR 6x supérieur au modèle "syndics payants"
- Benchmarks prouvés : MyHammer, Houzz, Habitatpresto

---

## 📊 DOCUMENTS STRATÉGIQUES À PRODUIRE

### 1️⃣ ANALYSE MARCHÉ FRANÇAIS

**1.1 Taille et Structure**
- Nombre copropriétés France (source INSEE, ANAH)
- Nombre syndics professionnels (répartition géographique)
- Part de marché principaux acteurs (Foncia, Nexity, etc.)
- Marché travaux copropriété (€/an)
- Volume contrats récurrents, énergie, assurances
- Segmentation TAM/SAM/SOM

**1.2 Tendances**
- Digitalisation gestion copropriété
- Impact loi ALUR, transition énergétique
- Consolidation marché syndics
- Proptech France (investissements, startups)

**1.3 Analyse Concurrentielle**

**Concurrents à analyser :**
- **Généralistes** : Companeo, Orgeco, Batimmo, Soregor
- **Travaux BTP** : Habitatpresto, Quotatis, Hellopro
- **Logiciels syndic** : Vilogi, Coxit, Vesta (modules intégrés ?)
- **Courtiers** : Opéra Energie, Selectra
- **Facility management** : Homys, Batappli

**Pour chaque concurrent :**
- Modèle économique (commission, abonnement, freemium)
- Fonctionnalités principales
- Cible client
- Forces/faiblesses
- Retours utilisateurs (Trustpilot, G2)
- Trafic web (SimilarWeb)
- Levées de fonds

**Livrable :**
- Tableau comparatif 20+ critères
- Matrice positionnement
- Analyse SWOT Copronomie vs top 5
- Opportunités différenciation

### 2️⃣ STRATÉGIE PRICING & BUSINESS MODEL

**Grille Tarifaire Entreprises à Proposer**

**Plan STARTER (49€/mois)**
- Cible : Artisans indépendants (1-5 employés)
- 10 soumissions devis/mois
- Infos complètes projets
- Contact direct syndic
- Notifications temps réel

**Plan PRO (149€/mois) ⭐ RECOMMANDÉ**
- Cible : PME BTP (5-20 employés)
- Soumissions illimitées
- Badge "Pro" + mise en avant profil
- Analytics (taux conversion, concurrents)
- Templates devis personnalisables
- Multi-utilisateurs (3 sièges)

**Plan PREMIUM (299€/mois)**
- Cible : Grandes entreprises (20+ employés)
- Accès prioritaire projets (24h avant autres)
- Recommandation IA matching
- Certification "Partenaire Premium"
- Multi-utilisateurs illimités
- Account manager dédié

**Option Syndics (Phase 2-3, optionnel)**
- Plan Gratuit : Usage illimité (acquisition volume)
- Plan Pro (49€/mois) : Analytics avancées, export, multi-utilisateurs
- Plan Enterprise (sur devis) : API, white-label, SSO

**Projections MRR à Analyser**

| Mois | Entreprises | MRR | ARR Run-rate |
|------|-------------|-----|--------------|
| M3 | 20 | 1 500€ | 18K€ |
| M6 | 80 | 9 000€ | 108K€ |
| M12 | 200 | 24 000€ | 288K€ |

**Hypothèses :**
- Mix plans : 25% Starter, 50% Pro, 25% Premium
- Churn mensuel : 5%
- CAC entreprises : 150€
- LTV : 2 400€ (LTV/CAC = 16x)

**Tests Pricing à Recommander**
- A/B testing : 49€ vs 39€ vs 59€ (Starter)
- Anchoring : Prix barré pour créer urgence
- Early bird : -30% 6 premiers mois
- Annual vs Monthly : discount annuel 15-20%

### 3️⃣ STRATÉGIE GO-TO-MARKET

**Phase 1 : Remplir de Projets (M1-M2)**

**Objectif :** 50 projets/mois disponibles avant acquisition entreprises

**Cible :** Syndics (100% GRATUIT)

**Tactiques :**
1. Cold outreach LinkedIn (50 messages/semaine)
2. Réseau personnel (10 syndics beta)
3. LinkedIn Ads test (500€)

**Message clé :** "GRATUIT À VIE : Recevez des devis qualifiés automatiquement"

**KPIs M2 :**
- 50 syndics inscrits
- 30 syndics actifs
- 50+ projets publiés

**Phase 2 : Recruter Entreprises Payantes (M3-M6)**

**Objectif :** 100 entreprises payantes (10K€ MRR)

**Canaux prioritaires :**

**1. Google Ads (1000€/mois)**
- Mots-clés : "trouver chantiers copropriété", "appel d'offre BTP", "leads travaux"
- Landing : /entreprises/projets
- CAC cible : <150€

**2. Cold Email (Scraping annuaires)**
- Sources : FFB, CAPEB, PagesJaunes, LinkedIn
- Liste : 10 000 entreprises IDF
- Volume : 200 emails/jour
- Taux conversion : 2% → 120 inscriptions/mois

**3. Partenariats Fournisseurs**
- Point P, Leroy Merlin Pro, BigMat, Gedimat
- Newsletter + stands magasins
- 1 mois gratuit pour clients partenaire

**4. Facebook Ads (500€/mois)**
- Ciblage : Entrepreneurs, Artisans, BTP (IDF, 25-55 ans)
- Format : Carousel (problème → solution → CTA)

**5. Webinars Gratuits (1/mois)**
- Titre : "Comment gagner 3 chantiers/mois grâce aux copropriétés"
- Conversion : 20% inscrits → payants

**Phase 3 : Scale (M7-M12)**

**Objectif :** 200 entreprises (30K€ MRR)

**Nouveaux canaux :**
- Referral program (1 mois gratuit)
- Content marketing SEO (20 articles)
- Sales team (1 BDR, 20 deals/mois)
- Salons BTP (Batimat)

### 4️⃣ FINANCIAL PLAN (24 MOIS)

**Coûts Fixes Mensuels**
- Infrastructure : 500€ (Vercel, Supabase, domaines)
- Marketing : 1 500€ (LinkedIn Ads, Google Ads)
- Légal/compta : 200€
- Total : ~2 200€/mois

**Coûts Variables**
- CAC entreprise : 150€
- Support : 50€/client/an
- Transaction fees : 2-3% (Stripe)

**Projections Trésorerie**

| Mois | Revenus | Coûts | Cash Flow | Tréso |
|------|---------|-------|-----------|-------|
| M0 | 0€ | -550€ | -550€ | 9 450€ |
| M3 | 1 500€ | -2 200€ | -700€ | 7 500€ |
| M6 | 9 000€ | -3 500€ | +5 500€ | 18 000€ |
| M12 | 24 000€ | -5 000€ | +19 000€ | 80 000€ |

**Break-even :** M5-M6 (revenus > coûts)

**Scenarii :**
- **Pessimiste** : Churn 10%, CAC 300€ → ARR M12 : 150K€
- **Réaliste** : Churn 5%, CAC 150€ → ARR M12 : 288K€
- **Optimiste** : Churn 3%, CAC 100€ → ARR M12 : 400K€

### 5️⃣ ROADMAP & TIMELINE

**M0-M3 : MVP Beta**
- Compléter features core (notifications, pages manquantes)
- Tests E2E
- Déploiement Vercel + Railway
- Recrutement 5 syndics beta
- Collecte feedback

**M4-M6 : Lancement Public**
- Itération feedback beta
- Landing page optimisée
- Annonce LinkedIn/Twitter
- Activation Stripe (paiements)
- Objectif : 80 entreprises payantes, 9K€ MRR

**M7-M12 : Growth & Scale**
- Scale acquisition (ads, sales team)
- Features growth (referral, analytics, intégrations)
- Optimisation performance
- Objectif : 200 entreprises, 24K€ MRR

### 6️⃣ RISQUES & MITIGATION

**Risque 1 : Volume projets insuffisant**
- Si ratio projets/entreprises < 0.5 → frustration
- Mitigation : Recruter plus syndics, pause acquisition entreprises

**Risque 2 : Churn élevé entreprises**
- Si entreprises ne gagnent pas chantiers → churn
- Mitigation : Onboarding coaching, transparence taux conversion, garantie remboursé

**Risque 3 : CAC trop élevé**
- Si CAC > 250€ → LTV/CAC <3
- Mitigation : Focus SEO, referral, stop ads

**Risque 4 : Concurrence agressive**
- Si Companeo pivot copropriété
- Mitigation : Vitesse exécution, intimité client, features spécialisées

### 7️⃣ KPIs CRITIQUES À TRACKER

**Acquisition**
- Trafic site (visiteurs/mois)
- Taux conversion visiteur → inscription
- CAC par canal (Google, LinkedIn, referral)

**Activation**
- % syndics ayant créé 1er projet
- % entreprises ayant soumis 1er devis
- Time-to-first-value

**Engagement**
- Projets créés/mois
- Devis soumis/mois
- Taux acceptation devis
- Ratio projets/entreprises (1-1.5 optimal)

**Revenus**
- MRR, ARR
- ARPU (Average Revenue Per User)
- Taux conversion free → paid
- Churn mensuel
- LTV/CAC ratio (>5x)

**Marketplace Health**
- % projets avec 0 devis (<10%)
- % projets avec 5+ devis (20%)
- Délai moyen réponse (<48h)

---

## ✅ LIVRABLES ATTENDUS

**Document 1 : ANALYSE MARCHÉ (15-20 pages)**
- Taille marché français (TAM/SAM/SOM)
- Tendances et opportunités
- Benchmark concurrents (tableau 10+ acteurs)
- Positioning strategy

**Document 2 : BUSINESS MODEL & PRICING (10-15 pages)**
- Grille tarifaire détaillée (justification prix)
- Projections MRR/ARR 24 mois (3 scenarii)
- Unit economics (CAC, LTV, payback)
- Tests pricing recommandés

**Document 3 : GO-TO-MARKET STRATEGY (20-30 pages)**
- Stratégie acquisition syndics (gratuit)
- Stratégie acquisition entreprises (payant)
- Canaux marketing détaillés (budget, ROI)
- Calendrier éditorial 90 jours
- Templates emails, ads, posts LinkedIn

**Document 4 : FINANCIAL PLAN (10-15 pages + Excel)**
- Coûts fixes et variables détaillés
- Projections trésorerie 24 mois
- Break-even analysis
- Besoins financement (si levée)

**Document 5 : ROADMAP & EXECUTION (10 pages)**
- Timeline 12 mois (milestones)
- OKRs trimestriels
- Risques & mitigation
- Quick wins (10 actions semaine 1)

**Document 6 : COMPETITIVE ANALYSIS (10 pages)**
- Tableau comparatif 20+ critères
- Matrice positionnement
- SWOT Copronomie
- Stratégie différenciation (3 piliers)

---

## 🎯 PRIORITÉS ANALYSE

**CRITIQUE (produire en priorité) :**
1. Business Model & Pricing (validation modèle économique)
2. Go-to-Market Strategy (plan acquisition entreprises)
3. Financial Plan (viabilité projet)

**IMPORTANT (ensuite) :**
4. Analyse Marché (sizing et opportunités)
5. Competitive Analysis (positionnement)

**UTILE (si temps) :**
6. Roadmap détaillée
7. Personas approfondis

---

## 📚 SOURCES À PRIVILÉGIER

**Marché Français :**
- INSEE, ANAH (statistiques copropriété)
- UNIS, FNAIM (associations syndics)
- FFB, CAPEB (fédérations BTP)
- Baromètre PropTech France

**SaaS/Pricing :**
- ProfitWell, Price Intelligently (pricing strategies)
- OpenView Partners (PLG playbook)
- SaaStr (SaaS metrics)

**Growth Marketing :**
- Lemlist (cold email templates)
- Wordstream (Google Ads B2B)
- LinkedIn Marketing Solutions

---

## 🔍 CRITÈRES QUALITÉ

**Données :**
- Sources françaises récentes (2023-2025)
- Chiffres vérifiables
- Citations de sources

**Actionnabilité :**
- Quick wins identifiés
- Checklists concrètes
- Templates prêts à l'emploi

**Cohérence :**
- Alignement business model → pricing → GTM → finance
- Pas de contradiction entre sections

---

## 💡 NOTES IMPORTANTES

**Ce qui distingue Copronomie :**
- ✅ 100% dédié copropriété (vs généralistes)
- ✅ UX moderne (vs concurrents datés)
- ✅ Double marketplace (valeur syndics ET entreprises)
- ✅ Pas de commission travaux (transparence totale)
- ✅ Conformité légale copropriété native
- ✅ Founder avec expertise métier syndic

**Anti-patterns à éviter dans l'analyse :**
- ❌ Pas de recommandations génériques ("faire du SEO")
- ❌ Pas de benchmarks hors contexte français
- ❌ Pas de pricing sans justification chiffrée
- ❌ Pas de roadmap sans priorisation

**Attentes :**
- Profondeur > largeur
- Actionnable > théorique
- Chiffré > qualitatif
- Français > international (sauf best practices)

---

**🚀 GO : Produire l'analyse stratégique complète en suivant cette structure !**
