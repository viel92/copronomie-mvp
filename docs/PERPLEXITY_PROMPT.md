markdown# BRIEF STRATÉGIQUE COMPLET - COPRONOMIE
## Plateforme SaaS B2B de Mise en Concurrence Multi-Services pour Copropriétés

---

## 🎯 OBJECTIF DE CETTE ANALYSE

Tu es un **consultant senior spécialisé en SaaS B2B, proptech et stratégie de lancement**. 

Ta mission : analyser en profondeur le marché français de la copropriété et produire **un dossier stratégique exhaustif et actionnable** pour le lancement de Copronomie, en t'appuyant sur :
- Des données chiffrées et sources françaises vérifiables
- Des benchmarks de startups similaires (SaaS B2B immobilier, marketplaces, proptech)
- Des best practices internationales adaptées au contexte français
- Des recommandations opérationnelles immédiates (quick wins)

**Format attendu :** Document structuré en markdown avec sections numérotées, tableaux comparatifs, checklists actionnables, citations de sources.

---

## 📋 CONTEXTE DÉTAILLÉ DU PROJET

### Concept
**Copronomie** est une plateforme SaaS B2B qui digitalise et centralise la mise en concurrence de **TOUS les services et contrats** nécessaires à la gestion de copropriété en France.

**Problème résolu :**
- **Pour les syndics** : processus manuel chronophage (emails, appels, Excel), difficulté à comparer les offres, manque de traçabilité, renouvellement annuel des contrats récurrents, dispersion des prestataires, absence d'historique et de benchmark marché
- **Pour les prestataires** : accès limité aux opportunités, prospection coûteuse, processus de réponse non standardisé, difficulté à se différencier

### Périmètre de Services Couverts

**1. Contrats Récurrents (priorité MVP)**
- Ménage des parties communes
- Gardiennage et sécurité
- Entretien espaces verts
- Maintenance ascenseurs
- Maintenance chaufferie collective
- Dératisation et désinsectisation

**2. Contrats d'Énergie**
- Électricité (parties communes + chauffage collectif)
- Gaz naturel
- Eau froide et chaude
- Optimisation énergétique

**3. Assurances**
- Multirisque immeuble (MRI)
- Dommages-ouvrage (DO)
- Responsabilité civile syndic
- Protection juridique copropriété

**4. Travaux Ponctuels**
- Ravalement de façade
- Réfection toiture et étanchéité
- Isolation thermique (ITE/ITI)
- Rénovation parties communes
- Plomberie, électricité, menuiseries
- Accessibilité PMR

**5. Services Spécialisés**
- Audits énergétiques (DPE collectif, audit réglementaire)
- Diagnostics techniques (DTA, CREP, amiante, termites)
- Contrôles réglementaires (CTQ, installations gaz/électricité)
- Maîtrise d'œuvre et AMO
- Expertise judiciaire

### Utilisateurs Cibles

**CÔTÉ DEMANDE (Clients) :**

**Syndics Professionnels (cible primaire)**
- **Petits cabinets** : 1-5 gestionnaires, 50-200 copropriétés, outils Excel/Word, besoin simplicité
- **Cabinets moyens** : 10-50 employés, 200-1000 copros, logiciel métier (Vilogi, Coxit, Vesta), besoin intégration/automatisation
- **Grands groupes** : Foncia, Nexity, Orpi, Citya (>5000 copros), processus établis, besoin ROI et compliance

**Syndics Bénévoles (cible secondaire)**
- Copropriétaires élus, gestion 1-3 copros, peu de temps, besoin accompagnement

**CÔTÉ OFFRE (Prestataires) :**
- Entreprises BTP (TPE à grands groupes)
- Sociétés de nettoyage et facility management
- Mainteneurs (ascenseurs, chauffage, VMC)
- Fournisseurs d'énergie et courtiers
- Compagnies d'assurance et courtiers
- Bureaux d'études et diagnostiqueurs
- Architectes et maîtres d'œuvre

### Stack Technique Imposée
- **Frontend** : Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend** : tRPC (API type-safe), Prisma ORM
- **Database** : PostgreSQL (Supabase)
- **Architecture** : Monorepo Turborepo
- **Auth** : NextAuth.js / Supabase Auth
- **Hosting** : Vercel (frontend), Supabase (backend/DB)
- **Payments** (futur) : Stripe
- **Email** : Resend ou SendGrid
- **Storage** : Supabase Storage (documents, devis)

### Situation Actuelle

**Ressources :**
- **Fondateur solo** (moi) : gestionnaire de copropriété, compétences tech (fullstack Next.js)
- **Budget initial** : Bootstrap, ~5-10K€ sur 6 mois (infra + marketing)
- **Réseau** : 724 abonnés LinkedIn (syndics, gestionnaires, prestataires BTP/immobilier)
- **Temps** : Temps plein sur le projet (6-12 mois runway)

**Avantages Concurrentiels Initiaux :**
- Connaissance terrain du métier de syndic
- Communauté LinkedIn qualifiée et engagée
- Capacité à développer le produit en interne (pas de coûts externes)
- Accès direct aux pain points utilisateurs

**Objectifs 12 Mois :**
- **Lancement MVP** : T0+3 mois
- **Clients payants** : 50 syndics à M6, 150 à M12
- **MRR** : 5K€ à M6, 20K€ à M12
- **Prestataires actifs** : 200 à M6, 500 à M12
- **Taux de conversion** : 15% freemium → payant
- **Churn** : <5% monthly

---

## 📊 DOCUMENTS STRATÉGIQUES À PRODUIRE

---

### 1️⃣ ANALYSE DE MARCHÉ & OPPORTUNITÉ

#### 1.1 Taille et Structure du Marché Français

**Recherche à effectuer :**
- Nombre total de copropriétés en France (source INSEE, ANAH)
- Répartition géographique (concentration Île-de-France vs régions)
- Nombre de syndics professionnels (cabinets + grands groupes)
- Part de marché des principaux acteurs (Foncia, Nexity, Citya, etc.)
- Nombre de copropriétés en syndic bénévole
- Taille moyenne des copropriétés (nb de lots)
- Budget annuel moyen par copropriété (charges, travaux)
- Volume total du marché (contrats récurrents + travaux + assurances + énergie)

**Livrables attendus :**
- Tableau récapitulatif avec sources
- Segmentation du marché (TAM, SAM, SOM)
- Taux de croissance annuel du secteur

#### 1.2 Tendances et Évolutions

**Recherche à effectuer :**
- Digitalisation de la gestion de copropriété (adoption logiciels métier)
- Impact de la loi ALUR et évolutions réglementaires
- Transition énergétique (rénovation, DPE, audits obligatoires)
- Consolidation du marché des syndics (rachats, fusions)
- Émergence de la proptech en France (investissements, startups)
- Comportement d'achat des syndics (processus décisionnel, durée des cycles)

**Livrables attendus :**
- Synthèse des tendances majeures
- Opportunités et menaces pour Copronomie
- Projection marché à 3-5 ans

#### 1.3 Analyse Concurrentielle Approfondie

**Concurrents Directs & Indirects à Analyser :**
- **Généralistes mise en concurrence** : Companeo, Orgeco, Batimmo, Soregor
- **Spécialisés travaux BTP** : Habitatpresto, Quotatis, Hellopro (section BTP)
- **Logiciels de syndic** : Vilogi, Coxit, Immoware, Vesta (modules intégrés ?)
- **Courtiers énergie/assurance** : Opéra Energie, Selectra, Balio
- **Marketplaces facility management** : Homys, Batappli, Matera
- **Plateformes diagnostics** : Allodiagnostic, Diagamter

**Pour chaque concurrent, analyser :**
- Modèle économique (commission, abonnement, freemium)
- Fonctionnalités principales
- Catégories de services couvertes
- Cible client (syndics, bailleurs, gestionnaires ?)
- Forces et faiblesses
- Retours utilisateurs (Trustpilot, Google Reviews, G2)
- Trafic web estimé (SimilarWeb, Ahrefs)
- Stratégie marketing (SEO, LinkedIn, publicité)
- Levées de fonds et croissance

**Livrables attendus :**
- Tableau comparatif détaillé (20+ critères)
- Matrice de positionnement (axe prix vs fonctionnalités)
- Analyse SWOT de Copronomie vs top 5 concurrents
- Opportunités de différenciation

#### 1.4 Cadre Réglementaire et Légal

**Recherche à effectuer :**
- **Loi ALUR** : seuils de mise en concurrence obligatoire, appels d'offres
- **Statut juridique de Copronomie** : courtage, intermédiaire, marketplace pure ?
- **Responsabilités légales** : syndic vs plateforme (responsabilité contractuelle ?)
- **RGPD** : traitement données copropriétés (finances, votes AG, données personnelles)
- **Assurances professionnelles** : RC Pro, cyber-risques
- **Réglementations sectorielles** :
  - Énergie (comparateurs, obligations transparence tarifaire)
  - Assurance (intermédiaire en assurance IAS, ORIAS)
  - BTP (garanties décennales, sous-traitance)
- **Conformité fiscale** : TVA sur commissions, facturation B2B

**Livrables attendus :**
- Guide de compliance complet
- Checklist réglementaire avant lancement
- Modèles CGU/CGV adaptés
- Risques juridiques identifiés + plan d'atténuation

---

### 2️⃣ VISION, MISSION & POSITIONNEMENT

#### 2.1 Vision Statement (horizon 3-5 ans)

**Recherche à effectuer :**
- Vision statements inspirantes de SaaS B2B à succès (Salesforce, HubSpot, Stripe)
- Vision de proptech françaises (Seloger, Meero, Proprioo, Matera)
- Aspirations du secteur de la copropriété (digitalisation, transparence, simplification)

**Livrable attendu :**
Une vision inspirante qui répond à :
- Quel impact veut avoir Copronomie sur le secteur ?
- Quel futur imagine-t-on pour la gestion de copropriété ?
- Comment Copronomie change la vie des syndics et prestataires ?

**Format :** 2-3 phrases percutantes

#### 2.2 Mission Statement

**Livrable attendu :**
Mission claire et opérationnelle (1 phrase) qui définit :
- Ce que fait Copronomie
- Pour qui
- Comment (différenciation)

#### 2.3 Valeurs de l'Entreprise

**Recherche à effectuer :**
- Valeurs de startups SaaS B2B admirées
- Valeurs importantes pour les syndics (transparence, fiabilité, simplicité...)

**Livrable attendu :**
5 valeurs fondamentales avec définition courte (transparence, efficacité, collaboration, innovation, intégrité...)

#### 2.4 Positionnement Unique (UVP)

**Livrable attendu :**
- **Unique Value Proposition principale** (1 phrase)
- **3 piliers de différenciation** vs concurrence
- **Tagline LinkedIn** (accrocheur, 5-10 mots)
- **Elevator pitch** (30 secondes)

**Exemples de différenciation à explorer :**
- Plateforme 100% dédiée copropriété (vs généralistes)
- Tous services centralisés (vs spécialisés mono-catégorie)
- Matching intelligent prestataires (vs liste brute)
- Historique et benchmarks prix marché
- Interface ultra-simple pour syndics non-tech

---

### 3️⃣ LEAN CANVAS COMPLET

Remplis les 9 blocs du Lean Canvas avec données concrètes :

#### 3.1 Problem (Top 3 Problèmes)
**Syndics :**
1. [Problème principal]
2. [Problème secondaire]
3. [Problème tertiaire]

**Alternatives actuelles :** Comment font-ils aujourd'hui ? (Excel, emails, bouche-à-oreille, Companeo...)

#### 3.2 Customer Segments

**Segmentation détaillée :**
- **Early Adopters** (qui adopter en premier ?) : profil, taille, motivations
- **Mainstream** (cible à M6-M12)
- **Late Adopters** (après PMF)

**Critères de segmentation :**
- Taille cabinet (nb gestionnaires, nb copros)
- Maturité digitale (logiciel métier ou Excel ?)
- Géographie (Île-de-France, grandes métropoles, régions)
- Type (indépendant, franchise, groupe)

#### 3.3 Unique Value Proposition

1 phrase percutante + 3 bénéfices clés

#### 3.4 Solution (Top 3 Features MVP)

**Fonctionnalités essentielles pour résoudre les 3 problèmes identifiés :**
1. [Feature 1] → résout [Problème 1]
2. [Feature 2] → résout [Problème 2]
3. [Feature 3] → résout [Problème 3]

#### 3.5 Channels (Acquisition)

**Canaux par ordre de priorité :**
1. **LinkedIn** (organique + ads) → détailler stratégie
2. [Canal 2] → SEO, partenariats, événements...
3. [Canal 3]

#### 3.6 Revenue Streams

**Recherche à effectuer :**
- Modèles de pricing de Companeo, Orgeco, Batimmo, courtiers
- Benchmarks SaaS B2B immobilier (abonnement mensuel moyen)
- Acceptabilité prix pour syndics (enquêtes, forums)

**Modèles à évaluer :**
- **Freemium + Premium** (quelle limite fonctionnelle ?)
- **Abonnement mensuel/annuel** (par gestionnaire ? par copropriété ? flat ?)
- **Commission sur transactions** (% devis signés via plateforme)
- **Modèle hybride** (abonnement + commission réduite)
- **Pay-per-use** (crédit par mise en concurrence)

**Livrable attendu :**
- Modèle recommandé avec justification
- Grille tarifaire proposée (3 tiers : Starter, Pro, Enterprise)
- Projection MRR selon adoption

#### 3.7 Cost Structure

**Coûts fixes mensuels :**
- Infrastructure tech (Vercel, Supabase, domaines, outils)
- Marketing (LinkedIn Ads, SEO, événements)
- Légal & comptable (création, CGU, compta, assurances)
- Opérationnel (support client, outils CRM/emailing)

**Coûts variables :**
- Par utilisateur/transaction (frais paiement, emails transactionnels, stockage docs)

**Livrable attendu :**
Tableau mensuel détaillé (12 premiers mois)

#### 3.8 Key Metrics (KPIs Critiques)

**Pour un SaaS B2B marketplace, tracker :**

**Acquisition :**
- Trafic website (visiteurs uniques/mois)
- Taux de conversion visiteur → inscription
- CAC (coût acquisition client)
- Provenance trafic (LinkedIn, SEO, direct...)

**Activation :**
- % inscrits ayant créé 1ère mise en concurrence
- Time-to-value (délai inscription → 1ère utilisation)

**Engagement :**
- DAU/MAU (utilisateurs actifs)
- Nb mises en concurrence par syndic/mois
- Nb réponses prestataires par demande

**Rétention :**
- Churn rate (monthly & annual)
- NRR (Net Revenue Retention)
- NPS (Net Promoter Score)

**Revenu :**
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)
- ARPU (Average Revenue Per User)
- LTV (Lifetime Value)

**Marketplace spécifiques :**
- Liquidité (ratio offre/demande, % demandes satisfaites)
- GMV (Gross Merchandise Value - volume transactions)
- Take rate (% revenus Copronomie sur GMV)

**Livrable attendu :**
- Dashboard KPIs priorisé (5-7 métriques North Star)
- Objectifs chiffrés par métrique (M3, M6, M12)

#### 3.9 Unfair Advantage

Qu'est-ce qui est difficile/impossible à copier ?

**À évaluer :**
- Réseau LinkedIn qualifié (724 abonnés niche)
- Expertise métier syndic (insider knowledge)
- First-mover advantage sur multi-services copropriété
- Communauté early adopters fidélisée
- Données et benchmarks prix (après accumulation)
- Intégrations exclusives logiciels syndics

**Livrable attendu :**
2-3 avantages déloyaux identifiés + plan pour les renforcer

---

### 4️⃣ PERSONA RESEARCH (Ultra-Détaillé)

Crée 4 personas avec méthodologie Jobs-to-be-Done :

---

#### PERSONA 1 : Syndic Indépendant / Petit Cabinet

**PROFIL**
- **Nom** : [Prénom fictif + nom]
- **Âge** : 40-55 ans
- **Fonction** : Gérant de cabinet syndic ou gestionnaire principal
- **Entreprise** : Cabinet indépendant, 1-3 gestionnaires
- **Portefeuille** : 50-150 copropriétés
- **Localisation** : [Région typique]
- **Formation** : [Parcours académique et professionnel]

**CONTEXTE PROFESSIONNEL**
- **Journée type** : [Déroulé 8h-19h]
- **Outils utilisés** :
  - Logiciel métier : [Vilogi, Coxit, ou Excel ?]
  - Communication : Email, téléphone, WhatsApp
  - Comptabilité : [Logiciel]
- **Équipe** : [Composition]
- **Pression temporelle** : [Niveau de stress, deadlines]

**OBJECTIFS PROFESSIONNELS**
1. [Objectif prioritaire]
2. [Objectif secondaire]
3. [Objectif tertiaire]

**PAINS (Douleurs)**
1. **[Pain majeur]** : Description détaillée + impact quotidien + coût (temps/argent)
2. **[Pain secondaire]**
3. **[Pain tertiaire]**

**Citations typiques** : "[Verbatim de syndic réel]"

**GAINS (Bénéfices Attendus)**
1. **[Gain prioritaire]** : Ce qui changerait sa vie
2. [Gain secondaire]
3. [Gain tertiaire]

**JOBS-TO-BE-DONE**
"Quand [situation], je veux [motivation], pour [outcome]"

Exemple : "Quand un contrat de ménage arrive à expiration, je veux comparer rapidement 5 devis qualifiés, pour renouveler en AG sans contestation copropriétaires"

**COMPORTEMENT D'ACHAT**
- **Déclencheurs** : Qu'est-ce qui le pousse à chercher une solution ?
- **Processus de décision** : Qui décide ? (lui seul, validation comptable, présentation conseil syndical ?)
- **Durée du cycle** : Combien de temps entre découverte et achat ?
- **Budget** : Qui paie ? (copropriété ou cabinet ?) Quel montant acceptable ?
- **Critères de choix** : Prix, simplicité, gain de temps, conformité légale...

**OBJECTIONS POTENTIELLES**
1. "[Objection 1 - ex: Trop cher]" → Réponse
2. "[Objection 2 - ex: Pas le temps de former]" → Réponse
3. "[Objection 3 - ex: Les prestataires ne sont pas dans ma région]" → Réponse

**CANAUX DE COMMUNICATION PRÉFÉRÉS**
- **Découverte** : LinkedIn, bouche-à-oreille, salons, Google
- **Engagement** : Email, démo vidéo, webinaire
- **Support** : Email, chat, téléphone (ordre de préférence)

**INFLUENCE & COMMUNAUTÉS**
- Associations professionnelles (FNAIM, UNIS, CNAB...)
- Groupes LinkedIn / Facebook
- Forums spécialisés
- Influenceurs suivis

**DONNÉES COMPORTEMENTALES LINKEDIN**
- Temps passé sur LinkedIn : [quotidien, hebdomadaire ?]
- Type de contenu consommé : [articles, posts, vidéos ?]
- Interaction : [like, commente, partage ?]
- Sensibilité aux messages directs : [réceptif ou spam ?]

---

**[RÉPÉTER LA STRUCTURE POUR :]**

#### PERSONA 2 : Gestionnaire Cabinet Moyen
- 10-50 employés, 200-800 copropriétés
- Utilise logiciel métier avancé, processus structurés
- Recherche intégrations et automatisation

#### PERSONA 3 : Directeur de Portefeuille Grand Groupe
- Foncia, Nexity, Citya (>5000 copros)
- Décisions centralisées, exigence ROI, compliance stricte
- Processus d'achat long (validation direction, appel d'offres)

#### PERSONA 4 : Prestataire Multi-Services BTP
- Entreprise 5-50 salariés (plomberie, électricité, ravalement...)
- Prospection difficile et coûteuse
- Recherche leads qualifiés réguliers

---

**RECHERCHE À EFFECTUER POUR PERSONAS :**
- Interviews réels de syndics (LinkedIn, forums Syndic-Central.fr, groupes Facebook)
- Analyse profils LinkedIn (titres, activités, contenus likés)
- Avis Google et Trustpilot sur logiciels syndics et concurrents
- Études comportementales gestionnaires immobiliers
- Enquêtes salaires et organisation cabinets syndics

**LIVRABLES ATTENDUS :**
- 4 fiches personas format PDF (visuels + texte)
- Empathy maps (pense, ressent, dit, fait)
- Customer Journey maps (découverte → achat → usage → fidélisation)

---

### 5️⃣ PRD (Product Requirements Document)

#### 5.1 Vision Produit

**Recherche à effectuer :**
- Best practices PRD (Silicon Valley Product Group, Lenny's Newsletter)
- Exemples PRD de SaaS B2B (Notion, Linear, Asana...)

**Livrable attendu :**
- Énoncé vision produit (2-3 paragraphes)
- Objectifs produit 12 mois
- Critères de succès mesurables

#### 5.2 User Stories Priorisées (Format Agile)

**Pour chaque persona, lister 10-15 user stories :**

**Format** : "En tant que [persona], je veux [action], afin de [bénéfice]"

**Exemples :**
- "En tant que syndic, je veux publier une demande de devis ménage en 3 clics, afin de gagner du temps"
- "En tant que prestataire, je veux recevoir uniquement des demandes dans ma zone géographique, afin de ne pas perdre de temps"

**Critères de priorisation** : Méthode RICE (Reach, Impact, Confidence, Effort) ou MoSCoW

**Livrable attendu :**
- Backlog priorisé (Must Have, Should Have, Could Have, Won't Have)
- Répartition sur roadmap (MVP, V1, V2)

#### 5.3 Fonctionnalités MVP (3-6 Mois)

**Recherche à effectuer :**
- Features core de Companeo, Orgeco, marketplaces similaires
- Analyse Jobs-to-be-Done : quelles features résolvent les pains identifiés ?
- Benchmarks délais développement MVP (solo dev Next.js)

**CÔTÉ SYNDIC (Must Have MVP) :**

**Authentification & Profil**
- [ ] Inscription/connexion (email + mot de passe, ou LinkedIn OAuth)
- [ ] Profil cabinet (raison sociale, SIRET, adresse, contacts)
- [ ] Gestion portefeuille copropriétés (import manuel ou CSV)

**Création Demande de Devis**
- [ ] Formulaire intelligent par catégorie de service (ménage, travaux, énergie...)
- [ ] Champs dynamiques selon type de prestation
- [ ] Upload documents (cahier des charges, plans, diagnostics...)
- [ ] Définition critères (zone géographique, délais, budget indicatif)
- [ ] Prévisualisation avant publication

**Gestion Réponses & Comparaison**
- [ ] Réception devis prestataires (tableau comparatif)
- [ ] Filtres et tri (prix, note, délai, certifications)
- [ ] Visualisation détails offres (PDF, descriptions, garanties)
- [ ] Messagerie intégrée avec prestataires (questions/réponses)
- [ ] Notation et avis prestataires (après sélection)

**Historique & Suivi**
- [ ] Dashboard demandes en cours / passées
- [ ] Statistiques (économies réalisées, temps gagné)
- [ ] Export données (PDF, Excel) pour AG copropriétaires

**CÔTÉ PRESTATAIRE (Must Have MVP) :**

**Authentification & Profil**
- [ ] Inscription/connexion
- [ ] Profil entreprise (SIRET, assurances, certifications, références)
- [ ] Zones d'intervention géographiques
- [ ] Métiers/catégories de services proposés

**Réception & Réponse Opportunités**
- [ ] Feed opportunités matchées (selon profil et géographie)
- [ ] Filtres et recherche
- [ ] Détails demande syndic (cahier des charges, documents)
- [ ] Formulaire réponse/devis (upload PDF ou saisie inline)
- [ ] Suivi statut (en attente, sélectionné, refusé)

**Gestion Compte**
- [ ] Tableau de bord (opportunités répondues, taux de conversion)
- [ ] Notifications (nouvelles opportunités, messages syndics)

**FONCTIONNALITÉS TRANSVERSES MVP :**
- [ ] Système de matching intelligent (algorithme basique : géo + métier)
- [ ] Notifications email (nouveau devis, nouvelle réponse, rappels)
- [ ] Conformité RGPD (consentement, export données, suppression compte)
- [ ] Design responsive (mobile-first)
- [ ] Performance (Lighthouse >90)

**Livrable attendu :**
- Liste exhaustive features MVP avec description fonctionnelle détaillée
- Wireframes ou maquettes clés (page login, création demande, tableau comparatif)
- User flows critiques (schéma Figma/Miro)

#### 5.4 Spécifications Techniques

**Architecture Recommandée :**

**Frontend (Next.js 14)**
- App Router (Server Components par défaut)
- Client Components pour interactivité (formulaires, modals)
- tRPC pour API type-safe
- React Hook Form + Zod (validation formulaires)
- TanStack Query (cache et sync données)
- Zustand ou Jotai (state management léger si besoin)

**Backend (tRPC + Prisma)**
- API routes Next.js
- tRPC routers par domaine (users, demandes, devis, prestataires...)
- Middleware auth (NextAuth.js ou Supabase Auth)
- Prisma schema avec relations (User, Company, ServiceRequest, Quote, Review...)

**Base de Données (PostgreSQL via Supabase)**
- Schéma relationnel optimisé
- Index pour performances (recherche géographique, filtres)
- Row Level Security (RLS) pour multi-tenancy

**Fichiers & Storage**
- Supabase Storage (buckets : documents, devis, photos travaux)
- Génération URLs signées (sécurité accès fichiers)

**Emails Transactionnels**
- Resend ou SendGrid
- Templates (confirmation inscription, nouveau devis, rappels...)

**Paiements (post-MVP si commission)**
- Stripe Connect (marketplace payments)

**Monitoring & Analytics**
- Vercel Analytics (performance)
- PostHog ou Mixpanel (product analytics)
- Sentry (error tracking)

**Sécurité**
- HTTPS partout (Vercel par défaut)
- Validation input côté serveur (Zod schemas)
- Rate limiting (Upstash Redis)
- CSRF protection

**Livrable attendu :**
- Schéma architecture (diagramme C4 ou similaire)
- Modèle de données (ERD - Entity Relationship Diagram)
- Stack détaillée avec justifications (pourquoi ces choix ?)
- Estimation temps développement (Gantt ou timeline)

#### 5.5 Exigences Non-Fonctionnelles

- **Performance** : temps de chargement <2s, Lighthouse score >90
- **Disponibilité** : uptime 99,9%
- **Scalabilité** : architecture sans état, horizontal scaling possible
- **Accessibilité** : WCAG 2.1 niveau AA minimum
- **SEO** : SSR Next.js, meta tags, sitemap, structured data
- **Multi-device** : responsive mobile/tablet/desktop

#### 5.6 Intégrations Futures (Post-MVP)

**Recherche à effectuer :**
- APIs disponibles des principaux logiciels de syndic (Vilogi, Coxit, Vesta...)
- Possibilité webhooks ou exports automatiques
- Partenariats nécessaires

**Intégrations prioritaires V2 :**
- Import automatique copropriétés depuis logiciel syndic
- Export devis sélectionnés vers logiciel comptable
- Intégration calendrier (Google Calendar, Outlook) pour rappels échéances contrats
- Signature électronique (DocuSign, Yousign) pour contrats

**Livrable attendu :**
- Roadmap intégrations (priorité, faisabilité technique, partenariats requis)

---

### 6️⃣ PRODUCT ROADMAP (18 Mois)

#### Méthodologie
- Utiliser framework Now/Next/Later ou découpage trimestriel
- Aligner sur OKRs (Objectives & Key Results)
- Inclure dépendances techniques et capacité solo dev

---

#### PHASE 0 : PRÉ-LANCEMENT (M-1 à M0)

**Objectif** : Valider concept, préparer infrastructure, recruter beta testeurs

**Développement :**
- [ ] Setup infrastructure (Vercel, Supabase, domaine, emails)
- [ ] Design system & composants UI (TailwindCSS, Shadcn/ui)
- [ ] Architecture base de données
- [ ] Auth & gestion utilisateurs basique

**Marketing & Validation :**
- [ ] Landing page MVP (Next.js) : waitlist + valeur proposition
- [ ] Campagne LinkedIn (10 posts) pour recruter 20 beta testeurs
- [ ] Interviews utilisateurs (5 syndics + 5 prestataires)
- [ ] Création contenu (articles de blog SEO, vidéo démo concept)

**Légal :**
- [ ] Création entreprise (SASU, SAS ?)
- [ ] CGU/CGV version beta
- [ ] Conformité RGPD (registre traitements, mentions légales)

**KPIs Phase 0 :**
- 100 inscrits waitlist
- 20 beta testeurs confirmés
- 5 interviews utilisateurs complétées

---

#### PHASE 1 : MVP - CLOSED BETA (M1 à M3)

**Objectif** : Lancer produit minimal avec 20 beta testeurs, valider usage, itérer

**Fonctionnalités (cf. 5.3) :**
- Syndic : inscription, profil, création demande (2-3 catégories prioritaires : ménage, travaux courants)
- Prestataire : inscription, profil, réception opportunités, réponse devis
- Matching basique (géo + métier)
- Dashboard simple, notifications email

**Scope restreint MVP :**
- **Catégories de services** : 3 seulement (ex: ménage, ravalement, maintenance ascenseurs)
- **Géographie** : Île-de-France uniquement
- **Prestataires** : sourcing manuel initial (invitations directes via LinkedIn)

**Go-to-Market MVP :**
- Activation beta testeurs (onboarding 1-to-1, formations)
- Feedback loops hebdomadaires (appels, sondages)
- Suivi métriques usage (login rate, création demandes, réponses prestataires)

**KPIs Phase 1 (M3) :**
- 20 syndics beta actifs (au moins 1 demande créée)
- 50 prestataires inscrits
- 30 demandes de devis publiées
- 80 réponses prestataires
- 10 devis acceptés/signés (proof of value)

---

#### PHASE 2 : PRIVATE LAUNCH - EARLY ADOPTERS (M4 à M6)

**Objectif** : Élargir à 50 syndics payants, stabiliser produit, optimiser conversion

**Nouvelles Fonctionnalités :**
- **Catégories étendues** : 5-7 catégories (+ énergie, assurance, diagnostics)
- **Géographie étendue** : grandes métropoles (Lyon, Marseille, Toulouse, Bordeaux)
- **Matching v2** : algorithme amélioré (certifications, avis, taux de réponse)
- **Tableau comparatif avancé** : filtres, tri multi-critères, export Excel
- **Système d'avis & notations** : syndics notent prestataires, affichage profils
- **Messagerie in-app** : discussions syndic-prestataire
- **Historique & analytics** : stats économies, délais, comparaisons vs marché

**Monétisation Activée :**
- Lancement offre payante (modèle sélectionné via Lean Canvas)
- Freemium : limite 1-2 demandes/mois gratuites, puis abonnement
- Stratégie de conversion beta → payant (offre early bird)

**Go-to-Market Phase 2 :**
- **LinkedIn intensif** : 15-20 posts/mois, 3 articles longs, témoignages vidéo beta testeurs
- **LinkedIn Ads** : campagne ciblée syndics Île-de-France (budget 1-2K€)
- **Cold outreach** : DM personnalisés aux 724 abonnés + expansion réseau
- **SEO** : 10 articles de blog optimisés (mots-clés longue traîne)
- **Partenariats** : premiers contacts associations professionnelles (FNAIM, UNIS)

**KPIs Phase 2 (M6) :**
- 50 syndics actifs dont 30 payants
- 150 prestataires inscrits
- MRR : 5K€
- Churn <10%
- NPS >40

---

#### PHASE 3 : PUBLIC LAUNCH - GROWTH (M7 à M12)

**Objectif** : Atteindre 150 syndics, automatiser acquisition, améliorer rétention

**Nouvelles Fonctionnalités :**
- **Toutes catégories de services** (10+ catégories)
- **Couverture nationale**
- **Automatisation** :
  - Rappels automatiques renouvellement contrats récurrents
  - Suggestions prestataires basées sur historique
  - Pré-remplissage demandes (modèles par type)
- **Intégrations** :
  - API import copropriétés depuis logiciels syndics (si partenariats obtenus)
  - Export comptable
- **Features premium** :
  - Benchmark prix marché (données agrégées anonymisées)
  - Multi-utilisateurs par cabinet (gestion droits)
  - White-label pour grands groupes (branding personnalisé)
- **Mobile app** ou PWA optimisée

**Go-to-Market Phase 3 :**
- **Scaling LinkedIn** : 25-30 posts/mois, vidéos, lives, études de cas
- **LinkedIn Ads scale-up** : 5K€/mois, tests audiences, A/B testing
- **Content marketing** : 20+ articles SEO, guide "Comment optimiser ses achats en copropriété"
- **Partenariats stratégiques** : partenariats officiels logiciels syndics, présence salons (RENT, UNIS)
- **PR & médias** : communiqués presse, interviews fondateur (BFM Immo, Le Moniteur)
- **Referral program** : parrainages syndics (1 mois gratuit par filleul)

**KPIs Phase 3 (M12) :**
- 150 syndics actifs dont 100 payants
- 500 prestataires actifs
- MRR : 20K€ (ARR 240K€)
- CAC <500€, LTV >5K€ (ratio LTV/CAC >10)
- Churn <5%
- NPS >50

---

#### PHASE 4 : SCALE & OPTIMIZATION (M13 à M18)

**Objectif** : Consolider position marché, optimiser unit economics, préparer levée seed si pertinent

**Nouvelles Fonctionnalités :**
- **IA & Automation** :
  - Matching prédictif (machine learning sur données historiques)
  - Chatbot support (réponses FAQ, aide création demandes)
  - Analyse automatique devis (extraction données PDF, comparaison AI)
- **Marketplace avancée** :
  - Système d'enchères inversées (prestataires ajustent prix en temps réel)
  - Assurance qualité (garantie satisfaction, médiation litiges)
- **Financiarisation** :
  - Paiement intégré (Stripe Connect, facturation via plateforme)
  - Financement travaux (partenariat banques/crédit)
- **Expansion services** :
  - Gestion complète contrats (renouvellement auto, e-signature, archivage cloud)
  - Module comptabilité copropriété light (pour très petits syndics)

**Go-to-Market Phase 4 :**
- **Diversification canaux** :
  - Google Ads (search intent : "devis ravalement copropriété")
  - Affiliation (courtiers, experts-comptables touchent commission)
  - Marketplace ads (prestataires paient pour booster visibilité)
- **Account-Based Marketing (ABM)** : ciblage grands groupes syndics (Foncia, Nexity)
- **Événementiel** : organisation webinaires, conférences proptech
- **Expansion géographique** : tests marchés européens (Belgique, Suisse ?)

**KPIs Phase 4 (M18) :**
- 300 syndics actifs dont 200 payants
- 1000+ prestataires
- MRR : 40-50K€ (ARR 500K€)
- CAC <400€, LTV >8K€
- Churn <3%
- NPS >60

---

**Livrable attendu :**
- Roadmap visuelle (Gantt, timeline Notion, ou diagramme)
- Détails sprint par sprint (si méthodologie agile)
- Allocation ressources (temps dev solo, budget externe)
- Risques et dépendances par phase

---

### 7️⃣ GO-TO-MARKET STRATEGY (Focus LinkedIn)

#### 7.1 Segmentation & Ciblage ICP (Ideal Customer Profile)

**Recherche à effectuer :**
- Profil LinkedIn des syndics actifs (titres, hashtags, entreprises)
- Taille optimale cabinet pour early adoption (sweet spot)
- Géographie prioritaire (densité copropriétés, maturité digitale)

**ICP Prioritaire (Phase 1-2) :**
- Cabinet indépendant ou moyen
- 50-500 copropriétés
- Île-de-France, grandes métropoles
- Déjà équipé logiciel métier (maturité digitale)
- Gestionnaire actif sur LinkedIn

**Livrable attendu :**
- Fiche ICP détaillée (firmographique + comportementale)
- Critères de scoring leads (qualification)

#### 7.2 Stratégie LinkedIn Organique (724 Abonnés)

**PHASE 0 : AUDIT & OPTIMISATION PROFIL**

**Actions immédiates :**
- [ ] Optimiser profil LinkedIn fondateur (photo pro, bannière Copronomie, headline percutante)
- [ ] Section "À propos" : storytelling (pourquoi Copronomie, problème résolu)
- [ ] Section "Activité" : posts récents doivent refléter expertise copropriété
- [ ] Section "Services" : clarifier offre
- [ ] Créer page entreprise Copronomie (logo, description, lien website)

**PHASE 1 : ACTIVATION COMMUNAUTÉ EXISTANTE (724 Abonnés)**

**Recherche à effectuer :**
- Analyse composition des 724 abonnés (syndics, prestataires, autres ?)
- Taux d'engagement actuel (likes, commentaires par post)
- Benchmarks engagement LinkedIn B2B immobilier

**Stratégie d'activation :**

**Semaine 1-2 : Sondage & Interviews**
- Post sondage : "Quelle est votre plus grande difficulté dans la mise en concurrence de prestataires ?" (4 options)
- DM personnalisés : inviter 50 abonnés syndics à interview 15 min
- Objectif : 10-15 interviews, insights profonds, testimonials potentiels

**Semaine 3-4 : Teasing & Waitlist**
- 3-4 posts teaser : "Je développe une solution pour [problème identifié]... Bientôt disponible"
- Call-to-action : inscription waitlist via landing page
- Objectif : 50-100 inscrits waitlist depuis LinkedIn

**Mois 2 : Recrutement Beta Testeurs**
- Post annonce : "Cherche 20 syndics pour tester en avant-première [bénéfice clé]"
- Critères sélection : actifs, motivés, prêts à donner feedback
- Contrepartie : accès gratuit 6 mois + influence sur développement produit
- Objectif : 20 beta testeurs validés

**PHASE 2 : CONTENT MARKETING INTENSIF (Lancement → M12)**

**Ligne Éditoriale :**

**Recherche à effectuer :**
- Analyse top posts copropriété sur LinkedIn (viralité, format, thèmes)
- Veille concurrentielle : que postent les concurrents ?
- Tendances hashtags (#Copropriété, #GestionImmobilière, #Syndic, #PropTech)

**Piliers de contenu (répartition hebdomadaire 4 posts) :**

1. **Éducation / Expertise (40%)** : établir autorité
   - Réglementation (loi ALUR, obligations syndic)
   - Conseils pratiques (comment optimiser contrat ménage, checklist AG)
   - Décryptage actualités secteur (réforme copropriété, DPE, rénovation énergétique)
   - Formats : carrousels LinkedIn (slides PDF), articles longs

2. **Pain Points / Problèmes (30%)** : résonance émotionnelle
   - Témoignages frustrations syndics (anonymisés ou fictifs basés sur interviews)
   - Statistiques choc ("80% des syndics passent 10h/mois sur la mise en concurrence")
   - Memes / humour (si pertinent, ton décalé)
   - Formats : texte court percutant, images, vidéos courtes

3. **Solution / Produit (20%)** : promotion Copronomie
   - Fonctionnalités (1 feature = 1 post avec bénéfice clair)
   - Études de cas (témoignages beta testeurs, avant/après)
   - Démos vidéo (screencasts 30-60s)
   - Comparaisons (Copronomie vs méthode traditionnelle)
   - Formats : vidéos, GIFs, screenshots annotés

4. **Preuve Sociale / Communauté (10%)** : crédibilité
   - Témoignages clients vidéo
   - Milestones (100 utilisateurs, 1000 devis traités)
   - Coulisses (behind-the-scenes développement produit)
   - UGC (User Generated Content - partager posts clients)

**Calendrier de Publication :**
- **Fréquence** : 4-5 posts/semaine (lundi, mercredi, vendredi + 1-2 bonus)
- **Horaires optimaux** : 8h-9h, 12h-13h, 18h-19h (tester et analyser)
- **Format privilégié** : carrousels (meilleur reach LinkedIn 2024-2025), vidéos natives

**Exemples de Posts à Fort Engagement :**

**Post Éducation (carrousel) :**
Titre : "Les 7 erreurs fatales des syndics dans la mise en concurrence (et comment les éviter)"
Slides : 1 erreur par slide + solution concrète
CTA final : "Téléchargez notre guide complet (lien en commentaire)"

**Post Pain Point (texte + image) :**
"Il est 22h. Vous avez passé 3 heures à relancer des entreprises pour un devis ravalement. Aucune réponse.
Demain, AG. Les copropriétaires vont vous cuisiner.
Ce scénario vous parle ? Vous n'êtes pas seul. 87% des syndics...
[développement + CTA découvrir Copronomie]"

**Post Produit (vidéo démo 45s) :**
"Créez une mise en concurrence en 2 minutes chrono. Regardez ⬇️"
[Screencast création demande devis ménage de A à Z]
"Plus besoin de relancer 15 entreprises par email. Copronomie s'en charge."

**Post Témoignage (vidéo interview) :**
"Marie, gestionnaire de 120 copros, nous raconte comment Copronomie lui fait gagner 5h/semaine"
[Vidéo 1min portrait client]

**Stratégie d'Engagement :**
- **Répondre à TOUS les commentaires** (dans l'heure si possible, engagement = reach)
- **Commenter posts d'autres syndics/influenceurs copropriété** (15-20 commentaires/jour) pour visibilité
- **Republier avec commentaire** : partager posts pertinents avec valeur ajoutée
- **Poser questions** : terminer posts par question ouverte pour inciter commentaires

**Hashtags Stratégie :**
- 3-5 hashtags max par post (surcharge nuit au reach)
- Mix volume : 1 gros (#Immobilier), 2-3 moyens (#Copropriété, #GestionImmobilière), 1-2 niche (#Syndic, #PropTech)
- Créer hashtag branded : #CopronomieHub (pour UGC)

**Croissance Abonnés :**

**Objectif :** 724 → 2000 abonnés à M6, 5000 à M12

**Tactiques :**
1. **Invitations ciblées** : 20-30/jour (Sales Navigator ou recherche LinkedIn)
   - Critères : poste "syndic", "gestionnaire copropriété", "responsable technique"
   - Message personnalisé (jamais générique)
2. **Participation groupes LinkedIn** :
   - Rejoindre 10-15 groupes copropriété/immobilier (Syndic-Central, FNAIM...)
   - Poster contenus à valeur dans groupes (2-3x/semaine)
   - Répondre questions membres (autorité + visibilité)
3. **Collaborations** :
   - Guest posts sur profils influenceurs copropriété
   - Interviews croisées (tu interviews un expert, il te partage)
4. **LinkedIn Articles longs** :
   - 1 article/mois (2000+ mots) sur sujet de fond (SEO LinkedIn)
   - Exemple : "Guide complet 2025 : optimiser tous vos contrats de copropriété"

**Livrable attendu :**
- Calendrier éditorial 90 jours (feuille de calcul avec dates, thèmes, formats, CTA)
- 20 idées de posts détaillées (titre, structure, visuel, CTA)
- Templates posts (texte réutilisable à adapter)
- Guidelines visuelles (couleurs, police, style images)

---

#### 7.3 LinkedIn Ads (Paid Strategy)

**Recherche à effectuer :**
- Benchmarks CPM, CPC, CPL LinkedIn Ads secteur immobilier B2B
- Tailles d'audiences ciblables (syndics France)
- Formats ads performants (sponsored content, InMail, lead gen forms)

**Budget Recommandé :**
- **Phase 0-1 (M0-M3)** : 0€ (focus organique)
- **Phase 2 (M4-M6)** : 1500-2500€/mois (test & learn)
- **Phase 3 (M7-M12)** : 5000€/mois (scaling)

**Campagnes Prioritaires :**

**Campagne 1 : Lead Generation (Inscriptions Freemium)**
- **Objectif** : Acquérir 100 leads qualifiés/mois à <25€ CPL
- **Ciblage** :
  - Fonction : Syndic, Gestionnaire copropriété, Responsable technique immeuble
  - Secteur : Immobilier, Gestion immobilière
  - Taille entreprise : 1-50 employés (priorité petits/moyens cabinets)
  - Géographie : Île-de-France (Phase 2), puis top 10 métropoles
- **Format** : LinkedIn Lead Gen Forms (formulaire pré-rempli, conversion +30% vs landing page)
- **Créa** :
  - Visuel : mockup interface Copronomie ou infographie pain point
  - Headline : "Simplifiez vos mises en concurrence copropriété"
  - Body : "Gagnez 5h/semaine sur la gestion de vos prestataires. Essai gratuit 14 jours."
  - CTA : "Démarrer l'essai gratuit"
- **Landing page** : page dédiée avec vidéo démo 90s, bénéfices clés, social proof, formulaire court

**Campagne 2 : Retargeting (Conversion Freemium → Payant)**
- **Objectif** : Convertir inscrits freemium inactifs ou limite gratuite atteinte
- **Ciblage** : Audience personnalisée (visiteurs website, inscrits app)
- **Format** : Sponsored content (single image ou vidéo)
- **Message** : Témoignage client ou case study + offre limitée (10% réduction si upgrade avant 7 jours)

**Campagne 3 : Brand Awareness (Top of Funnel)**
- **Objectif** : Construire notoriété auprès syndics pour faciliter conversion future
- **Ciblage** : Large (tous syndics France)
- **Format** : Vidéo native LinkedIn (30-60s)
- **Contenu** : Vidéo éducative ("3 astuces pour optimiser vos contrats copropriété") + CTA soft (télécharger guide gratuit)
- **Métrique** : View rate, engagement, croissance abonnés page

**A/B Testing :**
- Tester 3-5 variantes créa par campagne (visuel, headline, CTA)
- Tester audiences (secteur vs fonction, taille entreprise)
- Budget test : 500€/variante, valider gagnante avant scaling

**Livrable attendu :**
- Plan média LinkedIn Ads 12 mois (budget, campagnes, audiences, KPIs)
- Briefs créatifs (mockups ads, textes, landing pages)
- Dashboard tracking (Google Sheets : CPC, CPL, ROI par campagne)

---

#### 7.4 Canaux Complémentaires (Beyond LinkedIn)

**SEO (Search Engine Optimization)**

**Recherche à effectuer :**
- Analyse keywords copropriété (volume, difficulté, intent)
  - Mots-clés cibles : "devis ménage copropriété", "comparateur contrat énergie copropriété", "mise en concurrence ravalement façade", "meilleur syndic Paris"...
- Audit SEO concurrents (Companeo, Orgeco : pages rankées, backlinks)
- Opportunités featured snippets ("comment choisir entreprise ménage copropriété ?")

**Stratégie SEO :**

**On-Page SEO :**
- **Page d'accueil** : optimisée mot-clé principal ("plateforme mise en concurrence copropriété")
- **Pages catégories** : 1 page par service (devis ménage, devis travaux, comparateur énergie...) avec contenu >1500 mots, FAQ, CTA
- **Blog** : 30+ articles longs (2000+ mots)
  - Guides pratiques ("Guide complet : comment mettre en concurrence votre contrat ménage")
  - Comparatifs ("Top 10 entreprises ménage Île-de-France 2025")
  - Actualités secteur (nouveautés loi ALUR, DPE, rénovation)
  - Intent informationnel → transactionnel (CTA vers inscription Copronomie)

**Off-Page SEO :**
- **Backlinks** : guest posts sur blogs immobilier (SeLoger, BienIci, PAP), médias spécialisés (Le Moniteur, BatiActu)
- **Annuaires** : inscription annuaires professionnels (FNAIM, UNIS, PropTech France)
- **PR digitale** : communiqués presse sur levée de fonds, partenariats, milestones

**SEO Local (Google My Business) :**
- Fiche entreprise complète (si bureau physique)
- Avis clients (inciter syndics satisfaits à laisser avis Google)

**KPIs SEO (M12) :**
- 20 mots-clés positionnés top 10 Google
- 5000 visiteurs organiques/mois
- Taux de conversion SEO : 2-3%

---

**Partenariats Stratégiques**

**Recherche à effectuer :**
- Cartographie écosystème copropriété (logiciels, associations, médias, événements)
- Modèles de partenariat SaaS (co-marketing, intégrations, affiliation, white-label)

**Partenaires Prioritaires :**

**1. Éditeurs Logiciels Syndics**
- **Cibles** : Vilogi, Coxit, Vesta, Immoware, Urbania
- **Proposition** : intégration API (import copros, export devis)
- **Bénéfice mutuel** : valeur ajoutée pour leurs clients, commission ou rev-share pour Copronomie
- **Effort** : Moyen-Élevé (développement API, accord commercial)

**2. Associations Professionnelles**
- **Cibles** : FNAIM, UNIS, CNAB, ARC (Association des Responsables de Copropriété)
- **Proposition** : partenariat institutionnel (membre, sponsor événements, présence salons)
- **Bénéfice** : légitimité, accès adhérents (newsletters, annuaires)
- **Effort** : Faible-Moyen (cotisations, participation événements)

**3. Fédérations Prestataires**
- **Cibles** : FFB (Fédération Française du Bâtiment), SNEPS (ascenseurs), FEP (propreté), courtiers énergie
- **Proposition** : référencement entreprises adhérentes sur Copronomie (visibilité, leads)
- **Bénéfice** : apport massif prestataires qualifiés (supply marketplace)
- **Effort** : Moyen (négociation partenariat)

**4. Médias Spécialisés**
- **Cibles** : Le Moniteur, BatiActu, L'Argus de l'Assurance, BFM Immo
- **Proposition** : tribunes, interviews, partenariats contenu (webinaires co-brandés)
- **Bénéfice** : notoriété, trafic qualifié, backlinks SEO
- **Effort** : Faible (relations presse)

**5. Plateformes Complémentaires**
- **Cibles** : plateformes gestion locative (Locatme, Rentila), PropTech adjacentes
- **Proposition** : intégrations, co-selling
- **Bénéfice** : cross-selling, élargissement offre
- **Effort** : Variable

**Livrable attendu :**
- Tableau partenaires (priorité, contact, proposition valeur, statut négociation)
- Pitch decks partenariats (slides adaptées par type partenaire)

---

**Événementiel & Salons**

**Recherche à effectuer :**
- Calendrier salons immobilier/copropriété France (dates, lieux, coûts)
- ROI participation salons (leads générés, coût/lead)

**Événements Prioritaires (M6-M18) :**
- **RENT** (Paris, novembre) : salon immobilier professionnel, 20K visiteurs
- **Congrès UNIS** : rassemblement syndics professionnels
- **Salon des Copropriétés** (Paris) : cible syndics bénévoles et pros
- **Salons régionaux** : RENT Régions (Lyon, Marseille, Toulouse)

**Stratégie événementielle :**
- **Phase 1 (M0-M6)** : participation visiteur (networking, veille)
- **Phase 2 (M6-M12)** : stand petit format (kakemono, flyers, démos iPad)
- **Phase 3 (M12+)** : stand premium + conférence/workshop

**Alternative low-cost :**
- Organiser propres événements (webinaires, meetups, petit-déjeuners syndics locaux)

---

**Email Marketing & Automation**

**Recherche à effectuer :**
- Benchmarks taux ouverture/clic emails B2B immobilier
- Outils emailing (Brevo, Mailchimp, SendGrid...)

**Stratégie emailing :**

**1. Nurturing Leads (Funnel Automation)**

**Séquence Onboarding Freemium (8 emails sur 30 jours) :**
- J0 : Bienvenue + guide démarrage rapide
- J2 : Tuto vidéo "Créez votre 1ère demande en 2 min"
- J5 : Case study "Comment X a économisé 20% sur son contrat ménage"
- J7 : Reminder "Avez-vous testé [feature clé] ?"
- J14 : Social proof "Rejoignez 500 syndics qui simplifient leur gestion"
- J21 : Offre limitée "Upgrade Premium -20% avant J30"
- J28 : Dernière chance "Votre essai se termine demain"
- J30 : Feedback (si non-converti) "Qu'est-ce qui vous empêche de passer Premium ?"

**Séquence Réactivation (utilisateurs inactifs) :**
- Déclencheur : pas de login depuis 14 jours
- 3 emails : rappel bénéfices, nouvelle feature, offre spéciale retour

**2. Newsletter Contenu (Hebdomadaire ou Bimensuelle)**
- Actualités copropriété (lois, tendances)
- Tips & best practices
- Success stories
- Nouveautés produit

**KPIs Email (M12) :**
- Liste : 2000+ contacts
- Taux d'ouverture : >25%
- Taux de clic : >3%
- Taux conversion email →RéessayerSContinuermarkdown**KPIs Email (M12) :**
- Liste : 2000+ contacts
- Taux d'ouverture : >25%
- Taux de clic : >3%
- Taux conversion email → inscription : >5%
- Taux désabonnement : <1%

---

**Cold Outreach (LinkedIn & Email)**

**Recherche à effectuer :**
- Benchmarks taux réponse cold outreach B2B (LinkedIn vs email)
- Réglementation RGPD prospection B2B (opt-in, opt-out)
- Outils scraping LinkedIn (Sales Navigator, Phantombuster, Lemlist)

**Stratégie Cold LinkedIn DM :**

**Phase 1 : Warm-up (724 Abonnés Existants)**
- **Segmentation** : identifier syndics dans les 724 abonnés (LinkedIn Sales Navigator)
- **Message personnalisé** :
Bonjour [Prénom],
J'ai vu que vous étiez gestionnaire chez [Cabinet]. Je développe actuellement un outil qui aide les syndics à simplifier la mise en concurrence de leurs prestataires (ménage, travaux, énergie...).
Je cherche quelques professionnels comme vous pour tester la solution en avant-première et me donner leur avis.
Seriez-vous intéressé par un échange de 15 minutes ? Je vous offre 6 mois d'accès gratuit en échange de vos retours.
Bien cordialement,
[Votre prénom]
- **Volume** : 50 messages/semaine (taux réponse attendu 15-25%)
- **Suivi** : relance J+3 si pas de réponse

**Phase 2 : Expansion Réseau (Connexions 2nd Degré)**
- **Demande de connexion** + note personnalisée (300 caractères max)
- **Critères ciblage** : 
  - Fonction : "syndic", "gestionnaire copropriété", "responsable technique"
  - Localisation : Île-de-France prioritaire
  - Activité récente (posté dans les 30 jours = plus réceptif)
- **Volume** : 20-30 invitations/jour (limite LinkedIn)
- **Séquence après acceptation** :
  - J0 : Remerciement + question ouverte (pas de pitch)
  - J+3 : Partage contenu à valeur (article, guide)
  - J+7 : Soft pitch Copronomie
  - J+10 : Offre démo/essai

**Phase 3 : Cold Email (Listes Achetées ou Scrapées)**
- **Source** : annuaires syndics (FNAIM, Pages Jaunes), scraping LinkedIn
- **Séquence 4 emails (sur 14 jours) :**
  - Email 1 : Problème + statistique choc
  - Email 2 : Case study court
  - Email 3 : Démonstration vidéo (Loom 60s)
  - Email 4 : Appel à l'action (démo ou essai gratuit)
- **Personnalisation** : nom, cabinet, ville (automatisation Lemlist/Mailshake)
- **Conformité RGPD** : lien désabonnement, mention légale prospection B2B

**Outils Recommandés :**
- **LinkedIn automation** : Phantombuster, Expandi, We-Connect (attention limites LinkedIn)
- **Email cold** : Lemlist, Mailshake, Woodpecker
- **Enrichissement data** : Dropcontact, Hunter.io (trouver emails)

**KPIs Cold Outreach (M6) :**
- 500 DM LinkedIn envoyés
- Taux réponse : 15%
- Taux conversion (réponse → démo) : 30%
- Coût acquisition : <100€/client

---

**Referral Program (Parrainage)**

**Recherche à effectuer :**
- Benchmarks programmes de parrainage SaaS B2B (Dropbox, Slack, HubSpot)
- Mécanique optimale (récompense parrain vs filleul)

**Proposition Programme Parrainage (Lancement M6) :**

**Mécanique :**
- **Parrain** (syndic client) : 1 mois gratuit par filleul qui devient client payant
- **Filleul** (nouveau syndic) : 20% réduction sur abonnement 1er mois
- **Conditions** : filleul doit rester actif 3 mois minimum

**Promotion :**
- Email dédié clients existants
- Section "Parrainer un confrère" dans dashboard
- Lien de parrainage unique trackable
- Leaderboard parrains (gamification : top 3 parrains gagnent 1 an gratuit)

**KPIs Referral (M12) :**
- 15% clients acquis via parrainage
- Viral coefficient : 0,3-0,5 (chaque client amène 0,3-0,5 nouveau client)

---

**Affiliation & Marketplace Ads (Phase 3-4)**

**Affiliation :**
- **Affiliés potentiels** : experts-comptables copropriété, consultants immobiliers, courtiers
- **Commission** : 20-30% premier paiement ou 10% récurrent pendant 12 mois
- **Plateforme** : Système maison (Stripe affiliates) ou réseau affiliation français

**Marketplace Ads (Monétisation Côté Prestataires) :**
- Prestataires paient pour :
  - **Booster visibilité** : apparaître en premier dans résultats matching
  - **Badges premium** : "Certifié Copronomie", "Meilleure note 2024"
  - **Accès opportunités prioritaires** : notifiés avant prestataires gratuits
- **Pricing** : Abonnement mensuel 49-199€ selon niveau boost

**Livrable attendu :**
- Playbook complet GTM (document 30-50 pages)
- Templates tous supports (emails, DM, ads, landing pages)
- Feuille de route acquisition 12 mois (Gantt, budget, ressources)

---

### 8️⃣ STRATÉGIE DE PRICING & BUSINESS MODEL

#### 8.1 Analyse Modèles Concurrents

**Recherche à effectuer :**
- Pricing public de Companeo, Orgeco, Batimmo
- Modèles SaaS B2B immobilier (Matera, Homys, logiciels syndics)
- Pricing psychologie (ancrage, versioning, freemium vs paywall)

**Benchmark Concurrence :**

| Concurrent | Modèle | Prix | Forces | Faiblesses |
|-----------|--------|------|---------|------------|
| Companeo | Gratuit syndics, commission prestataires | N/A public | Gratuit = adoption facile | Qualité prestataires variable |
| Orgeco | Abonnement syndics | ~100-300€/mois ? | Sérieux, pro | Cher pour petits syndics |
| Batimmo | Freemium + Premium | 0-200€/mois ? | Mix gratuit/payant | Limité travaux BTP |

**Livrable attendu :**
Tableau détaillé 10+ concurrents (tarifs, modèle, positionnement prix)

---

#### 8.2 Proposition Modèle Copronomie

**Recommandation : MODÈLE HYBRIDE FREEMIUM + ABONNEMENT TIERING**

**Justification :**
- **Freemium** : barrière entrée faible = adoption rapide, viralité, network effects marketplace
- **Abonnement** : revenus récurrents prévisibles (MRR/ARR), alignement valeur perçue
- **Tiering** : segmentation (petits vs grands syndics), upsell naturel

---

**GRILLE TARIFAIRE PROPOSÉE (Côté Syndics) :**

**🆓 PLAN GRATUIT (Freemium)**
- **Cible** : petits syndics, syndics bénévoles, test produit
- **Limites** :
  - 2 demandes de devis/mois maximum
  - 1 seul gestionnaire/compte
  - Catégories de services : 3 seulement (ex: ménage, travaux courants, diagnostics)
  - Pas d'historique >3 mois
  - Support : email uniquement (réponse 48h)
  - Branding Copronomie visible (pas de white-label)
- **Objectif** : Acquisition volume, conversion vers Starter après dépassement limites

**💼 PLAN STARTER (49€/mois ou 490€/an soit -17%)**
- **Cible** : petits cabinets indépendants (1-3 gestionnaires, <100 copros)
- **Inclus** :
  - **Demandes illimitées** (toutes catégories de services)
  - 2 utilisateurs inclus (gestionnaires multi-comptes)
  - Historique complet + export données (Excel, PDF)
  - Tableau comparatif avancé (filtres, tri, scoring prestataires)
  - Notifications email + SMS
  - Support : email (réponse 24h) + chat
  - Modèles de demandes pré-remplis (gain de temps)
- **Bénéfice clé** : "Gagnez 5h/semaine sur vos mises en concurrence"

**🚀 PLAN PROFESSIONAL (149€/mois ou 1490€/an soit -17%)**
- **Cible** : cabinets moyens (5-20 gestionnaires, 100-500 copros)
- **Inclus TOUT Starter +** :
  - **5 utilisateurs inclus** (puis +10€/utilisateur supplémentaire)
  - **Intégrations** : API import copropriétés depuis logiciels syndics (Vilogi, Coxit si disponibles), export comptable
  - **Benchmarks prix marché** : comparaison prix moyens par service/région (données agrégées Copronomie)
  - **Rappels automatiques** : renouvellement contrats récurrents (30/60/90 jours avant échéance)
  - **Multi-copropriétés** : création demande groupée (ex: même contrat ménage pour 10 copros)
  - **Signature électronique** : intégration Yousign (10 signatures/mois incluses)
  - Support prioritaire : email/chat (réponse 4h) + téléphone
  - Gestionnaire de compte dédié (onboarding, formations)
- **Bénéfice clé** : "Automatisez vos renouvellements et gagnez 15h/semaine"

**🏢 PLAN ENTERPRISE (Sur devis, ~500-2000€/mois)**
- **Cible** : grands groupes (Foncia, Nexity, Citya), gestion >1000 copros
- **Inclus TOUT Professional +** :
  - Utilisateurs illimités
  - **White-label** : plateforme aux couleurs du groupe (domaine personnalisé, logo)
  - **API complète** : intégration profonde avec SI existant
  - **SLA** : disponibilité 99,9%, support 24/7
  - **Formations équipes** : sessions dédiées gestionnaires
  - **Rapports personnalisés** : BI, dashboards exécutifs, analytics avancés
  - **Account manager dédié** : point de contact unique, réunions trimestrielles
  - **Sécurité renforcée** : SSO (Single Sign-On), audit logs, conformité ISO 27001
  - **Conditions commerciales négociées** : volume discounts, engagement annuel/pluriannuel
- **Bénéfice clé** : "Centralisez la gestion de milliers de contrats avec un ROI mesurable"

---

**CÔTÉ PRESTATAIRES (Modèle Freemium) :**

**🆓 PLAN GRATUIT**
- Création profil
- Réception opportunités matchées (limité : 5 consultations/mois)
- 1 réponse/devis par mois
- Visibilité standard dans résultats

**💎 PLAN PREMIUM PRESTATAIRE (79€/mois)**
- **Opportunités illimitées** (accès à toutes les demandes dans zone/métier)
- **Réponses illimitées**
- **Boost visibilité** : profil mis en avant dans résultats matching
- **Badge "Certifié Copronomie"** (après vérification : SIRET, assurances, références)
- **Statistiques détaillées** : taux de conversion, performance vs concurrents
- **Notifications prioritaires** : alerté 24h avant prestataires gratuits
- Support prioritaire

**Alternative Commission (Test Phase 3) :**
- Gratuit pour prestataires + **commission 3-5% sur contrats signés** via plateforme
- Nécessite système paiement intégré (Stripe Connect) + traçabilité signature contrats

---

**AUTRES REVENUS (Diversification Phase 3-4) :**
- **Marketplace Ads** : prestataires paient publicité ciblée (CPC, CPM)
- **Services Premium** :
  - Audit personnalisé contrats copropriété (consultant Copronomie) : 500-2000€
  - Formation syndics/gestionnaires : 200€/personne
- **Data & Insights** : vente données anonymisées (études de marché pour fédérations, assureurs) : respect RGPD

---

#### 8.3 Projections Financières MRR/ARR

**Hypothèses :**

**Répartition Plans Syndics (M12) :**
- Gratuit : 50 utilisateurs (lead generation)
- Starter (49€) : 60 clients payants
- Professional (149€) : 35 clients payants
- Enterprise (1000€ moyen) : 5 clients payants

**Répartition Prestataires (M12) :**
- Gratuit : 400
- Premium (79€) : 100 payants

**Calcul MRR M12 :**
- Syndics Starter : 60 × 49€ = 2 940€
- Syndics Pro : 35 × 149€ = 5 215€
- Syndics Enterprise : 5 × 1000€ = 5 000€
- Prestataires Premium : 100 × 79€ = 7 900€
- **TOTAL MRR M12 : 21 055€**
- **ARR M12 : ~252K€**

**Hypothèses Croissance :**
- Mois 1-3 (MVP Beta) : 0€ (gratuit pour beta testeurs)
- Mois 4 : lancement payant, 10 clients Starter → 490€ MRR
- Croissance mensuelle moyenne : +25-30% M4-M12

**Projection MRR :**
| Mois | MRR | Nouveaux Clients (payants) | Churn |
|------|-----|---------------------------|-------|
| M4 | 490€ | 10 | 0 |
| M5 | 1 200€ | +15 | -1 |
| M6 | 2 500€ | +20 | -2 |
| M9 | 8 000€ | +30 | -5 |
| M12 | 21 000€ | +40 | -8 |

---

#### 8.4 Sensibilité Prix & Optimisation

**Recherche à effectuer :**
- Tests de sensibilité prix (enquêtes Van Westendorp)
- Élasticité prix secteur immobilier B2B
- Optimisation conversion freemium → payant (benchmarks 10-20%)

**Tests Pricing à Mener (M4-M6) :**
- **A/B testing** : 49€ vs 59€ vs 39€ (Plan Starter)
- **Anchoring** : afficher prix barré (ex: 79€ ~~99€~~) pour Plan Starter
- **Offres limitées** : Early bird 30% réduction (créer urgence)
- **Annual vs Monthly** : tester discount annuel (15% vs 20% vs 25%)

**Signaux Pricing à Surveiller :**
- Taux conversion Gratuit → Starter <5% : trop cher ou value prop faible
- Taux upgrade Starter → Pro <10% : écart de valeur insuffisant
- Commentaires "trop cher" récurrents : repositionner ou ajouter tier intermédiaire

**Livrable attendu :**
- Modèle financier Excel (projections 24 mois, scenarii pessimiste/réaliste/optimiste)
- Grille tarifaire finalisée (tableau comparatif plans)
- Stratégie tests pricing (calendrier, métriques)

---

### 9️⃣ FINANCIAL PLAN (Plan Financier 24 Mois)

#### 9.1 Hypothèses Générales

**Contexte :**
- Fondateur solo, bootstrap
- Développement en interne (pas de coûts dev externes)
- Budget initial : 10 000€ (économies personnelles)
- Runway : 12 mois avant besoin impératif revenus

**Scenarii :**
- **Pessimiste** : adoption lente, churn élevé (10%), CAC élevé (800€)
- **Réaliste** : hypothèses médianes (présentées ci-dessous)
- **Optimiste** : viralité forte, churn faible (3%), CAC bas (300€)

---

#### 9.2 Projections Revenus (Scénario Réaliste)

**CÔTÉ SYNDICS :**

| Mois | Gratuit | Starter (49€) | Pro (149€) | Enterprise (1000€) | MRR Syndics |
|------|---------|---------------|------------|---------------------|-------------|
| M1-3 | 20 | 0 | 0 | 0 | 0€ |
| M4 | 25 | 10 | 0 | 0 | 490€ |
| M5 | 30 | 18 | 3 | 0 | 1 329€ |
| M6 | 35 | 30 | 8 | 1 | 2 662€ |
| M9 | 40 | 50 | 20 | 3 | 8 430€ |
| M12 | 50 | 60 | 35 | 5 | 13 155€ |
| M18 | 80 | 100 | 60 | 10 | 23 840€ |
| M24 | 120 | 150 | 100 | 20 | 42 250€ |

**CÔTÉ PRESTATAIRES :**

| Mois | Gratuit | Premium (79€) | MRR Prestataires |
|------|---------|---------------|------------------|
| M1-3 | 30 | 0 | 0€ |
| M4 | 50 | 5 | 395€ |
| M6 | 100 | 20 | 1 580€ |
| M9 | 200 | 50 | 3 950€ |
| M12 | 400 | 100 | 7 900€ |
| M18 | 700 | 200 | 15 800€ |
| M24 | 1200 | 350 | 27 650€ |

**TOTAL MRR & ARR :**

| Mois | MRR Total | ARR (×12) | Croissance MoM |
|------|-----------|-----------|----------------|
| M4 | 885€ | 10,6K€ | - |
| M6 | 4 242€ | 50,9K€ | +140% |
| M9 | 12 380€ | 148,6K€ | +48% |
| M12 | 21 055€ | 252,7K€ | +19% |
| M18 | 39 640€ | 475,7K€ | +11% |
| M24 | 69 900€ | 838,8K€ | +10% |

---

#### 9.3 Structure de Coûts Détaillée

**COÛTS FIXES MENSUELS :**

**Infrastructure & Tech (M1-M24) :**
| Poste | M1-6 | M7-12 | M13-24 | Notes |
|-------|------|-------|--------|-------|
| Hébergement Vercel | 0€ | 20€ | 50€ | Hobby (gratuit) puis Pro |
| Supabase (DB + Storage) | 0€ | 25€ | 100€ | Free tier puis Pro puis Team |
| Domaine + emails | 15€ | 15€ | 15€ | .com + Google Workspace 1 user |
| Outils dev (GitHub, Sentry) | 0€ | 20€ | 50€ | Free puis payant |
| **Sous-total Tech** | **15€** | **80€** | **215€** |

**Marketing & Acquisition (M1-M24) :**
| Poste | M1-3 | M4-6 | M7-12 | M13-24 |
|-------|------|------|-------|--------|
| LinkedIn Ads | 0€ | 1 500€ | 3 000€ | 5 000€ |
| SEO (rédaction, backlinks) | 200€ | 500€ | 1 000€ | 1 500€ |
| Outils marketing (Lemlist, analytics) | 50€ | 100€ | 150€ | 200€ |
| Événements (salons, meetups) | 0€ | 200€ | 500€ | 1 000€ |
| **Sous-total Marketing** | **250€** | **2 300€** | **4 650€** | **7 700€** |

**Opérationnel & Support (M1-M24) :**
| Poste | M1-6 | M7-12 | M13-24 |
|-------|------|-------|--------|
| Support client (emails, chat) | 0€ (moi) | 500€ | 1 500€ |
| Comptabilité (expert-comptable) | 100€ | 150€ | 200€ |
| Légal (CGU, contrats) | 200€ | 50€ | 100€ |
| Assurances (RC Pro, cyber) | 80€ | 100€ | 150€ |
| **Sous-total Opérationnel** | **380€** | **800€** | **1 950€** |

**TOTAL COÛTS FIXES MENSUELS :**
- M1-3 : ~650€/mois
- M4-6 : ~3 200€/mois
- M7-12 : ~5 500€/mois
- M13-24 : ~9 900€/mois

---

**COÛTS VARIABLES (par client) :**
- Emails transactionnels (Resend) : 0,10€/client/mois
- Stockage documents (Supabase) : 0,05€/client/mois
- Frais paiement Stripe (si abonnement) : 1,4% + 0,25€ par transaction
- **Total variable** : ~0,20€/client/mois (négligeable jusqu'à scale)

---

**COÛTS ONE-TIME (Lancement) :**
- Création entreprise (SASU) : 300€ (M0)
- Design logo & identité visuelle (Fiverr/99designs) : 200€ (M0)
- Landing page template premium (si besoin) : 50€ (M0)
- **Total one-time : 550€**

---

#### 9.4 Tableau de Trésorerie (24 Mois)

| Mois | Revenus (MRR) | Coûts Fixes | Coûts Variables | Cash Flow | Tréso Cumulée |
|------|---------------|-------------|-----------------|-----------|---------------|
| M0 | 0€ | -550€ | 0€ | -550€ | **9 450€** |
| M1 | 0€ | -650€ | 0€ | -650€ | **8 800€** |
| M2 | 0€ | -650€ | 0€ | -650€ | **8 150€** |
| M3 | 0€ | -650€ | 0€ | -650€ | **7 500€** |
| M4 | 885€ | -3 200€ | -10€ | -2 325€ | **5 175€** |
| M5 | 2 000€ | -3 200€ | -15€ | -1 215€ | **3 960€** |
| M6 | 4 242€ | -3 200€ | -25€ | +1 017€ | **4 977€** |
| M7 | 6 500€ | -5 500€ | -40€ | +960€ | **5 937€** |
| M8 | 9 000€ | -5 500€ | -55€ | +3 445€ | **9 382€** |
| M9 | 12 380€ | -5 500€ | -75€ | +6 805€ | **16 187€** |
| M10 | 15 500€ | -5 500€ | -95€ | +9 905€ | **26 092€** |
| M11 | 18 200€ | -5 500€ | -110€ | +12 590€ | **38 682€** |
| M12 | 21 055€ | -5 500€ | -130€ | +15 425€ | **54 107€** |
| M18 | 39 640€ | -9 900€ | -300€ | +29 440€ | **~200K€** |
| M24 | 69 900€ | -12 000€ | -600€ | +57 300€ | **~500K€** |

**⚠️ POINT CRITIQUE : M4-M5**
- Trésorerie tombe à **3 960€** (M5)
- Runway restant : **1 mois seulement** si revenus stagnent
- **Solutions si cash critique** :
  - Réduire budget LinkedIn Ads temporairement (1500€ → 500€)
  - Freelance ponctuel (dev, consulting) pour injecter cash
  - Micro-prêt BPI (2-5K€, sans garantie)
  - Pré-ventes : vendre abonnements annuels upfront avec discount

**🎯 BREAK-EVEN (Cash Flow Positif Durable) :**
- Atteint à **M6** : MRR (4 242€) > Coûts mensuels (~3 200€)
- Dès M6, chaque mois ajoute du cash (snowball effect)

---

#### 9.5 Métriques Clés (Unit Economics)

**CAC (Customer Acquisition Cost) :**

**Calcul :**
CAC = Coûts Marketing M4-M12 / Nb clients acquis M4-M12

- Coûts marketing M4-M12 : (2 300€ × 3 mois) + (4 650€ × 6 mois) = 6 900€ + 27 900€ = **34 800€**
- Clients payants acquis M4-M12 : 100 syndics + 100 prestataires = **200 clients**
- **CAC moyen : 174€/client**

**CAC par Canal :**
- LinkedIn organique (DM, posts) : ~50€/client (temps investi)
- LinkedIn Ads : 300-500€/client (initial), puis optimisation vers 200€
- SEO : 100€/client (long terme)
- Referral : 30€/client (coût marginal faible)

**LTV (Lifetime Value) :**

**Calcul LTV Syndic Starter (49€/mois) :**
- ARPU : 49€/mois
- Churn mensuel : 5% (hypothèse réaliste SaaS B2B)
- Lifetime moyen : 1 / 0,05 = 20 mois
- **LTV = 49€ × 20 = 980€**

**LTV Syndic Pro (149€/mois) :**
- Churn mensuel : 3% (plus engagés, contrats annuels)
- Lifetime : 33 mois
- **LTV = 149€ × 33 = 4 917€**

**LTV Prestataire Premium (79€/mois) :**
- Churn : 7% (plus volatil, ROI doit être immédiat)
- Lifetime : 14 mois
- **LTV = 79€ × 14 = 1 106€**

**LTV / CAC Ratio :**
- **Syndic Starter** : 980€ / 174€ = **5,6× (Acceptable)**
- **Syndic Pro** : 4 917€ / 174€ = **28,3× (Excellent !)**
- **Prestataire** : 1 106€ / 174€ = **6,4× (Bon)**

**Règle d'or SaaS : LTV/CAC > 3× = viable**
✅ Copronomie dépasse largement ce seuil

**Payback Period (Temps pour récupérer CAC) :**
- Starter : 174€ / 49€ = **3,6 mois**
- Pro : 174€ / 149€ = **1,2 mois** 🚀
- Cible idéale : <12 mois ✅

---

#### 9.6 Besoins de Financement & Stratégie

**SCÉNARIO 1 : BOOTSTRAP (Recommandé Phase 1-2)**

**Avantages :**
- Indépendance totale (pas de dilution)
- Focus product-market fit sans pression investisseurs
- Lean & agile (itérations rapides)

**Conditions de réussite :**
- Atteindre break-even M6 (validation hypothèses revenus)
- Maintenir churn <5%
- CAC maîtrisé <200€ via LinkedIn organique + referral

**Aide publique (non-dilutive) :**
- **BPI Bourse French Tech** : 30K€ subvention (si éligibilité deeptech/innovation)
- **Concours startup** : Pass French Tech, French IoT, Startup Week-End (visibilité + 5-10K€ dotations)
- **CCI/Région** : aides création entreprise (5-10K€)
- **JEI (Jeune Entreprise Innovante)** : exonérations fiscales si R&D >15% dépenses

**Revenus complémentaires court-terme :**
- Freelance dev (Next.js, React) : 400-600€/jour, 5-10 jours/mois = 2-6K€
- Consulting syndics (optimisation achats) : 1-2K€/mission

---

**SCÉNARIO 2 : PRE-SEED (50-150K€) à M9-M12**

**Timing idéal :**
- **Métriques atteintes** :
  - 50+ clients payants
  - 10-15K€ MRR
  - Churn <5%
  - Growth rate 20%+ mensuel
  - NPS >40
- **Proof points** :
  - Product-market fit validé
  - Unit economics sains (LTV/CAC >5×)
  - Traction organique (LinkedIn)

**Utilisation fonds :**
- **50% Marketing/Sales** : scaling LinkedIn Ads (10-15K€/mois), 1er commercial
- **30% Produit** : 1 dev fullstack, accélération roadmap (features premium, intégrations)
- **20% Opérations** : support client, outils, légal

**Investisseurs cibles :**
- **Business Angels immobilier** : profils syndics, promoteurs, investisseurs proptech
- **Fonds pre-seed proptech** : Impulse Partners, Breega, Kima Ventures, Side Capital
- **Crowdfunding equity** : Seedrs, WiSEED (si échec levée classique)

**Dilution acceptable :** 10-20% (valorisation 300-500K€)

---

**SCÉNARIO 3 : SEED (500K-1M€) à M18-M24**

**Conditions :**
- 200+ clients, 50K€+ MRR, ARR 600K€+
- Expansion nationale complète
- Équipe 5-8 personnes
- Leader marché copropriété digital

**Utilisation fonds :**
- Scaling équipe (sales, customer success, produit)
- Marketing massif (brand awareness, multi-canaux)
- Expansion internationale (Belgique, Suisse)

---

#### 9.7 Risques Financiers & Mitigation

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Churn >10% (perte clients rapide) | Moyenne | Critique | Onboarding renforcé, success manager, itérations produit |
| CAC >500€ (acquisition trop chère) | Faible | Élevé | Doubler LinkedIn organique, referral, SEO long-terme |
| Adoption lente (<20 clients M6) | Moyenne | Critique | Pivot pricing (gratuit étendu), partnerships, free pilot |
| Concurrence agressive (Companeo, Orgeco) | Faible | Moyen | Différenciation features, niche copropriété exclusive |
| Runway insuffisant (cash out M5) | Faible | Critique | Freelance parallèle, micro-prêt BPI, pré-ventes annuelles |
| Réglementation (statut juridique unclear) | Faible | Moyen | Conseil juridique spécialisé proptech, compliance early |

---

**Livrable attendu :**
- **Fichier Excel Financial Model** : 3 onglets (Revenus, Coûts, Trésorerie), scenarii pessimiste/réaliste/optimiste, formules dynamiques
- **Dashboard financier** : suivi hebdomadaire MRR, burn rate, runway
- **Memo investisseurs** (si levée) : executive summary financier 2 pages

---

### 🔟 PERSONA RESEARCH - COMPLÉMENTS COMPORTEMENTAUX

*(Section déjà détaillée en 4️⃣, ajout insights psychographiques)*

**Recherche complémentaire à effectuer :**
- **Études psychographiques** gestionnaires immobiliers (motivations, peurs, aspirations)
- **Analyse comportementale LinkedIn** : posts likés, commentés, partagés par syndics
- **Verbatims forums** : Syndic-Central.fr, LegalPlace, Reddit r/RealEstate (équivalent français)
- **Interviews qualitatives** : 10-15 syndics (30-45 min chacun), thèmes :
  - Journée type (chronophages, frustrations)
  - Processus décision achats (qui valide ? combien de temps ?)
  - Outils actuels (satisfactions, manques)
  - Rapport à la technologie (early adopter vs laggard)
  - Déclencheurs changement (pain assez fort pour changer habitudes ?)

**Personas Complémentaires (Secondaires) :**

**PERSONA 5 : Copropriétaire Impliqué (Conseil Syndical)**
- Influence décisions AG (choix prestataires, validation devis)
- Pain : manque de transparence syndic, devis opaques, soupçons ententes
- Gain : accès benchmark prix, possibilité comparer vs propositions syndic
- Rôle dans Copronomie : prescripteur (suggère outil au syndic), utilisateur secondaire (consultation devis si syndic partage accès)

**PERSONA 6 : Expert-Comptable Copropriété**
- Valide comptabilité copros, conseille syndics sur achats/contrats
- Pain : données dispersées, saisie manuelle factures prestataires
- Gain : intégration comptable, automatisation, visibilité contrats
- Rôle : affilié potentiel (recommande Copronomie à clients syndics, touche commission)

---

### 1️⃣1️⃣ COMPETITIVE ANALYSIS APPROFONDIE

#### 11.1 Matrice de Positionnement

**Axes d'analyse :**
- **Axe X (Horizontal)** : Simplicité d'usage (1-10)
- **Axe Y (Vertical)** : Étendue services (niche vs multi-catégories)

**Positionnement concurrents :**
- **Companeo** : Simplicité 7/10, Étendue 9/10 (généraliste tous secteurs)
- **Orgeco** : Simplicité 5/10, Étendue 8/10 (interface datée mais complète)
- **Batimmo** : Simplicité 6/10, Étendue 6/10 (focus travaux)
- **Logiciels syndics (Vilogi, Coxit)** : Simplicité 4/10, Étendue 5/10 (modules intégrés basiques)
- **🎯 COPRONOMIE** : Simplicité 9/10, Étendue 9/10 (niche copropriété, UX moderne, tous services)

**Insight stratégique :**
Copronomie vise le **quadrant supérieur droit** (simple ET complet), zone sous-servie actuellement.

---

#### 11.2 Analyse SWOT Détaillée

**STRENGTHS (Forces) :**
- ✅ Expertise métier (fondateur gestionnaire copropriété)
- ✅ Communauté LinkedIn établie (724 abonnés niche)
- ✅ Tech moderne (Next.js, performances, UX)
- ✅ Focus exclusif copropriété (vs généralistes)
- ✅ Multi-catégories dès MVP (ménage, travaux, énergie, assurances...)
- ✅ Bootstrap = agilité, décisions rapides

**WEAKNESSES (Faiblesses) :**
- ⚠️ Marque inconnue (vs 
 établi depuis 20 ans)
- ⚠️ Ressources limitées (solo founder, budget serré)
- ⚠️ Pas de réseau prestataires initial (marketplace froide au départ)
- ⚠️ Statut juridique unclear (courtage ? plateforme ?)
- ⚠️ Dépendance LinkedIn (si algo change, acquisition impactée)

**OPPORTUNITIES (Opportunités) :**
- 📈 Digitalisation accélérée post-COVID (syndics adoptent SaaS)
- 📈 Réglementation (loi ALUR, DPE, rénovation énergétique) complexifie métier → besoin outils
- 📈 Consolidation marché syndics (grands groupes cherchent efficacité)
- 📈 Proptech en croissance (investisseurs intéressés, écosystème dynamique)
- 📈 Insatisfaction logiciels syndics actuels (obsolètes, UX mauvaise)

**THREATS (Menaces) :**
- ❌ Companeo/Orgeco pourraient pivoter vers copropriété (mais lenteur grands acteurs)
- ❌ Logiciels syndics développent modules mise en concurrence intégrés
- ❌ Barrières réglementaires (statut juridique, agréments obligatoires)
- ❌ Chicken-and-egg marketplace (pas de prestataires = pas de syndics, vice-versa)
- ❌ Copie rapide du concept (barrière technologique faible)

---

#### 11.3 Avantages Compétitifs Défendables

**Recherche à effectuer :**
- Théorie avantages concurrentiels (7 Powers - Hamilton Helmer)
- Moats dans marketplaces B2B

**Avantages Copronomie (à construire) :**

**1. Network Effects (Effet Réseau)**
- Plus de syndics → plus de prestataires attirés → meilleure liquidité → plus de syndics
- **Timeline** : Significatif à partir de 500+ utilisateurs actifs des deux côtés
- **Défensivité** : Forte (winner-takes-most dans marketplaces)

**2. Data & Insights (Données Propriétaires)**
- Accumulation données prix (benchmarks marché)
- Historique performances prestataires (notes, délais, litiges)
- **Timeline** : Valeur à partir de 1000+ transactions, puis effet boule de neige
- **Défensivité** : Moyenne (données périmées rapidement, mais accumulation longue à répliquer)

**3. Brand & Community (Marque & Communauté)**
- Autorité copropriété (contenu LinkedIn, guides, événements)
- Communauté syndics engagés (NPS élevé, ambassadeurs)
- **Timeline** : 12-24 mois
- **Défensivité** : Moyenne (brand prend du temps mais peut être challengé par concurrent mieux financé)

**4. Intégrations (Switching Costs)**
- APIs avec logiciels syndics (Vilogi, Coxit)
- Historique centralisé (exit difficile = perte données)
- **Timeline** : 18-24 mois (post-PMF)
- **Défensivité** : Moyenne-Forte

**5. Expertise & Produit (Product Excellence)**
- UX optimisée métier copropriété (vs généralistes)
- Features uniques (rappels renouvellements, benchmarks, multi-copros)
- **Timeline** : Continue (amélioration itérative)
- **Défensivité** : Faible-Moyenne (peut être copié, mais exécution difficile)

**Stratégie de défense :**
- **Court terme (M0-M12)** : Vitesse d'exécution, intimité client, communauté
- **Moyen terme (M12-M24)** : Network effects, données, intégrations
- **Long terme (M24+)** : Brand, écosystème (API publique, partenariats profonds)

---

**Livrable attendu :**
- **Tableau comparatif concurrents** (Excel, 30+ critères : pricing, features, trafic web, avis clients, forces/faiblesses)
- **Matrice SWOT visuelle** (infographie)
- **Stratégie de différenciation** : 3 piliers uniques à communiquer (marketing, sales pitch)

---

### 1️⃣2️⃣ DOCUMENTS COMPLÉMENTAIRES ESSENTIELS

#### 12.1 Pitch Deck (Investisseurs/Partenaires)

**Structure 12 Slides :**

**Slide 1 : Cover**
- Logo Copronomie
- Tagline
- Contact

**Slide 2 : Problem**
- 3 pain points syndics (visuel : avant/après)
- Statistiques choc (temps perdu, coûts cachés)

**Slide 3 : Solution**
- Copronomie en 3 bullets
- Screenshot interface (wow factor)

**Slide 4 : Market Size**
- TAM/SAM/SOM
- Croissance marché proptech

**Slide 5 : Product**
- Features clés (carousel screenshots)
- Différenciation vs concurrence

**Slide 6 : Business Model**
- Grille tarifaire
- Unit economics (LTV/CAC)

**Slide 7 : Traction**
- Métriques actuelles (utilisateurs, MRR, growth rate)
- Témoignages clients (vidéos ou quotes)

**Slide 8 : Go-to-Market**
- Canaux acquisition (focus LinkedIn)
- Partenariats

**Slide 9 : Competition**
- Tableau comparatif (pourquoi Copronomie gagne)

**Slide 10 : Team**
- Fondateur (photo, background, why me?)
- Advisors si pertinents

**Slide 11 : Financials**
- Projection ARR 3 ans
- Path to profitability

**Slide 12 : Ask**
- Montant levée
- Utilisation fonds (% par poste)
- Milestones à atteindre

---

#### 12.2 One-Pager (A4 recto)

**Sections :**
- **Header** : Logo + tagline + 1 phrase value prop
- **Problème** : 3 bullets
- **Solution** : 3 bullets
- **Marché** : Chiffres clés (TAM, croissance)
- **Traction** : Métriques actuelles (MRR, clients, growth)
- **Équipe** : Fondateur + advisors (photos miniatures)
- **Contact** : Email, LinkedIn, website

**Usage :** Email partenaires, salons, quick pitch

---

#### 12.3 Legal & Compliance Checklist

**RGPD (Priorité Absolue) :**
- [ ] Registre des traitements de données
- [ ] Politique de confidentialité (privacy policy) publiée
- [ ] Mentions légales complètes
- [ ] Consentement cookies (bannière)
- [ ] Droit à l'oubli (fonctionnalité suppression compte + données)
- [ ] Portabilité données (export JSON/CSV)
- [ ] Sécurité données (chiffrement, accès restreints, audits)
- [ ] DPO si >250 employés (non applicable Phase 1-2)

**Statut Juridique Copronomie :**
- [ ] Déterminer statut : plateforme pure (pas d'engagement contractuel) vs courtage (si facilite signature contrats)
- [ ] Conseil juridique spécialisé proptech/marketplace
- [ ] Assurance RC Professionnelle adaptée

**CGU/CGV (Conditions Générales) :**
- [ ] CGU Syndics (utilisation plateforme, limites responsabilité)
- [ ] CGU Prestataires (règles plateforme, commissions si applicable)
- [ ] CGV (si vente abonnements = prestation de service)
- [ ] Clause de médiation (litiges)

**Conformité Sectorielle :**
- [ ] Si énergie : respect règles comparateurs (transparence, neutralité)
- [ ] Si assurance : agrément ORIAS si conseil/courtage (vérifier si simple mise en relation exemptée)
- [ ] Si BTP : vérification assurances/qualifications prestataires (décennale, RGE...)

**Propriété Intellectuelle :**
- [ ] Dépôt marque INPI "Copronomie" (250€)
- [ ] Protection code source (dépôt APP ou similaire, optionnel)

---

#### 12.4 Launch Checklist (30 Jours Avant Lancement)

**J-30 : Produit & Tech**
- [ ] MVP déployé en production (Vercel)
- [ ] Tests utilisateurs finalisés (20 beta testeurs)
- [ ] Bugs critiques résolus
- [ ] Performance optimisée (Lighthouse >90)
- [ ] Analytics installées (PostHog/Mixpanel + Vercel Analytics)
- [ ] Monitoring errors (Sentry)
- [ ] Backup automatiques DB (Supabase)

**J-30 : Marketing & Comm**
- [ ] Website/landing page finalisée
- [ ] 10 premiers articles blog publiés (SEO)
- [ ] Vidéo démo produit (90s, pro)
- [ ] Templates emails (onboarding, notifications)
- [ ] Calendrier posts LinkedIn 60 jours

**J-21 : Légal & Admin**
- [ ] Entreprise créée (SASU/SAS)
- [ ] Compte bancaire pro ouvert
- [ ] CGU/CGV validées par avocat
- [ ] RGPD compliance complète
- [ ] Assurances souscrites

**J-14 : Acquisition**
- [ ] Liste 100 premiers prospects (syndics LinkedIn)
- [ ] Messages DM personnalisés rédigés (10 templates)
- [ ] Campagne LinkedIn Ads configurée (si budget)
- [ ] Partenariats initiés (2-3 associations/médias)

**J-7 : Support & Ops**
- [ ] Helpdesk configuré (email support@, chatbot basique)
- [ ] FAQ complète (20+ questions)
- [ ] Processus onboarding documenté (vidéos, guides)
- [ ] Outils CRM installés (Notion, Airtable ou similaire)

**J-1 : Final Checks**
- [ ] Test complet parcours utilisateur (syndic + prestataire)
- [ ] Load testing (si trafic attendu important)
- [ ] Backup code + DB
- [ ] Communiqué presse rédigé (si pertinent)

**J0 : LAUNCH 🚀**
- [ ] Post LinkedIn annonce lancement
- [ ] Email liste waitlist (100+ inscrits)
- [ ] Activation beta testeurs (DM personnalisés)
- [ ] Monitoring temps réel (dashboards, alerts)

**J+7 : Post-Launch**
- [ ] Collecte feedback (sondage NPS, interviews)
- [ ] Itération rapide (fix bugs, ajustements UX)
- [ ] Analyse métriques (taux conversion, activation, churn)
- [ ] Ajustements marketing (A/B testing messages, audiences)

---

### 1️⃣3️⃣ OKRs (Objectives & Key Results) - 12 Mois

**Framework OKRs :** Objectifs ambitieux + 3-5 résultats clés mesurables par trimestre

---

**Q1 (M1-M3) : VALIDATE - Valider Product-Market Fit Initials**

**Objective :** Lancer MVP et valider que le produit résout vraiment le problème

**Key Results :**
- KR1 : 20 beta testeurs recrutés et actifs (au moins 1 demande créée)
- KR2 : 50 demandes de devis publiées sur la plateforme
- KR3 : 70% des beta testeurs notent le produit ≥8/10 (satisfaction)
- KR4 : 10 devis acceptés/signés (proof of value réel)

---

**Q2 (M4-M6) : MONETIZE - Activer Monétisation et Tester Pricing**

**Objective :** Générer premiers revenus et atteindre break-even opérationnel

**Key Results :**
- KR1 : 30 clients payants (syndics)
- KR2 : 5 000€ MRR
- KR3 : Taux de conversion freemium → payant ≥10%
- KR4 : Churn mensuel <8%
- KR5 : Break-even cash flow (revenus ≥ coûts mensuels)

---

**Q3 (M7-M9) : SCALE ACQUISITION - Accélérer Croissance via LinkedIn & Partenariats**

**Objective :** Doubler la base clients et établir canaux d'acquisition scalables

**Key Results :**
- KR1 : 80 clients payants (+50 vs Q2)
- KR2 : 12 000€ MRR
- KR3 : CAC LinkedIn Ads <300€
- KR4 : 2 partenariats stratégiques signés (associations ou logiciels syndics)
- KR5 : 3 000 abonnés LinkedIn (+2 276 vs initial)

---

**Q4 (M10-M12) : OPTIMIZE & EXPAND - Optimiser Rétention et Étendre Offre**

**Objective :** Consolider base clients, réduire churn, lancer features premium

**Key Results :**
- KR1 : 150 clients payants (+70 vs Q3)
- KR2 : 20 000€ MRR
- KR3 : Churn mensuel <5%
- KR4 : NPS ≥50
- KR5 : 3 features premium lancées (benchmarks, intégrations, rappels auto)
- KR6 : 15% revenus proviennent de upsell (Starter → Pro)

---

**North Star Metric (Métrique Étoile Polaire) :**
**"Nombre de mises en concurrence complétées par mois"** (demandes publiées + ≥3 réponses prestataires)

**Justification :** Reflète valeur créée pour les deux côtés du marketplace (liquidité)

---

### 1️⃣4️⃣ RISK ANALYSIS & MITIGATION (Analyse Risques)

| Risque | Type | Probabilité | Impact | Mitigation | Owner |
|--------|------|-------------|--------|------------|-------|
| **Chicken-and-egg (pas assez de prestataires pour attirer syndics)** | Business | Élevée | Critique | Sourcing manuel prestataires (LinkedIn, appels directs) avant lancement syndics. Garantir 50 prestataires par catégorie M0. | Fondateur |
| **Adoption lente syndics (<20 clients M6)** | Business | Moyenne | Élevée | Pricing agressif (freemium étendu), onboarding 1-to-1, incentives early adopters (6 mois gratuits beta). Pivot si échec : modèle 100% gratuit syndics. | Fondateur |
| **Churn élevé (>10% mensuel)** | Produit | Moyenne | Élevée | Customer success proactif, feedback loops hebdomadaires, itérations rapides produit, programme fidélité. | Fondateur |
| **Concurrence agressive (Companeo pivot copropriété)** | Marché | Faible | Moyenne | Vitesse exécution, intimité client, features spécialisées copropriété. Construire moat données/communauté rapidement. | Fondateur |
| **Problème juridique (statut plateforme unclear)** | Légal | Moyenne | Élevée | Conseil juridique spécialisé M0, veille réglementaire continue, adaptation CGU si besoin. | Fondateur + Avocat |
| **Dépendance LinkedIn (algo change, account ban)** | Marketing | Faible | Moyenne | Diversification canaux (SEO, partenariats, email). Backup contacts (export connexions LinkedIn régulier). | Fondateur |
| **Burnout fondateur (solo, surcharge travail)** | Opérationnel | Moyenne | Élevée | Délégation précoce (freelances support, VA admin), routines santé (sport, sommeil), deadlines réalistes. | Fondateur |
| **Runway insuffisant (cash-out M5)** | Financier | Faible | Critique | Monitoring tréso hebdomadaire, plan B (freelance dev), micro-prêt BPI, pré-ventes annuelles. | Fondateur |
| **Tech : Bug critique ou hack** | Technique | Faible | Moyenne | Tests automatisés (Playwright), monitoring (Sentry), backups quotidiens, sécurité (audits, pen testing post-M12). | Fondateur |
| **Qualité prestataires (arnaques, mauvais travaux)** | Plateforme | Moyenne | Moyenne | Vérification profils (SIRET, assurances), système avis, modération, exclusion prestataires notés <3/5. | Fondateur |

**Plan de Contingence Critique :**

**Si échec PMF à M6 (< 20 clients payants) :**
1. **Pivoter pricing** : 100% gratuit syndics, monétiser uniquement prestataires (modèle Companeo)
2. **Pivoter scope** : Se concentrer sur 1 seule catégorie (ex: contrats ménage uniquement, niche ultra-spécialisée)
3. **Pivoter cible** : Syndics bénévoles (moins exigeants, plus nombreux) au lieu de pros
4. **Fermer gracieusement** : Rembourser clients, open-sourcer code, capitaliser learnings

---

### 1️⃣5️⃣ SOURCES & MÉTHODOLOGIE RECHERCHE

**Pour maximiser qualité des données Perplexity, privilégier :**

**Sources Françaises Prioritaires :**
- **Institutions** : INSEE, ANAH, Ministère du Logement, ADEME
- **Fédérations** : FNAIM, UNIS, ARC, FFB, CNAB
- **Médias spécialisés** : Le Moniteur, BatiActu, Argus de l'Assurance, Décision Atelier
- **Études de marché** : Xerfi, Idate, Statista (secteur immobilier/copropriété)
- **PropTech** : Baromètre PropTech France (annuel), JLL Research

**Sources Business/SaaS (Internationales) :**
- **Pricing/SaaS** : ProfitWell, Price Intelligently, OpenView Partners, SaaStr
- **GTM B2B** : Gong, HubSpot Research, Salesforce State of Sales
- **LinkedIn Strategy** : LinkedIn Marketing Solutions Blog, Hootsuite, Buffer

**Veille Concurrentielle :**
- **Outils SEO** : Ahrefs, Semrush (trafic web concurrents, mots-clés)
- **Avis clients** : Trustpilot, Google Reviews, Capterra, G2
- **Archives web** : Wayback Machine (évolution sites concurrents)

**Validation Hypothèses :**
- **Interviews primaires** : 15-20 syndics + 10 prestataires (qualitatif)
- **Sondages** : Google Forms, Typeform (quantitatif, 100+ réponses)
- **Tests utilisateurs** : UserTesting.com, Hotjar (enregistrements sessions)

---

## 🎯 SYNTHÈSE LIVRABLES ATTENDUS

Perplexity doit produire un **dossier stratégique complet** incluant :

✅ **1. Analyse de Marché** (15-20 pages)
- Taille marché, segmentation, tendances, réglementation

✅ **2. Vision & Positionnement** (3-5 pages)
- Vision/mission, valeurs, UVP, tagline

✅ **3. Lean Canvas** (1 page visuelle + 3 pages détail)

✅ **4. Personas** (4 fiches détaillées, 5-7 pages chacune)
- Syndic indépendant, cabinet moyen, grand groupe, prestataire

✅ **5. PRD** (20-30 pages)
- Features MVP, user stories, architecture technique, roadmap développement

✅ **6. Product Roadmap** (1 Gantt visuel + 10 pages détail)
- Phases 0-4 (M0 à M18), features, jalons, ressources

✅ **7. GTM Strategy** (30-40 pages)
- Stratégie LinkedIn (organique + ads), SEO, partenariats, événementiel, email, cold outreach, referral, calendrier éditorial 90 jours, templates

✅ **8. Business Model & Pricing** (10-15 pages)
- Grille tarifaire, benchmark concurrence, projections MRR/ARR, sensibilité prix

✅ **9. Financial Plan** (15-20 pages + fichier Excel)
- Revenus, coûts, trésorerie 24 mois, unit economics (CAC, LTV), besoins financement, scenarii

✅ **10. Competitive Analysis** (10-15 pages)
- Tableau comparatif, matrice positionnement, SWOT, avantages concurrentiels

✅ **11. OKRs** (2-3 pages)
- Objectifs trimestriels M1-M12, North Star Metric

✅ **12. Risk Analysis** (5-7 pages)
- Risques identifiés, probabilité/impact, plans de mitigation

✅ **13. Documents Annexes**
- Pitch deck (12 slides)
- One-pager (1 page A4)
- Legal checklist (3-5 pages)
- Launch checklist (2-3 pages)

---

## 📐 FORMAT & PRÉSENTATION

**Structure Document Final :**
- **Format** : Markdown (facile à convertir PDF, Notion, Google Docs)
- **Longueur totale** : 150-250 pages (avec annexes)
- **Ton** : Professionnel mais accessible, data-driven, actionnable
- **Visuels** : Tableaux, graphiques, bullet points (pas de pavés de texte)
- **Citations sources** : Entre crochets [Source: Le Moniteur 2024] ou notes de bas de page

**Sections à Prioriser (si contrainte temps Perplexity) :**
1️⃣ **GTM Strategy** (LinkedIn prioritaire) → 🔥 URGENT
2️⃣ **Financial Plan** → 🔥 URGENT
3️⃣ **Lean Canvas + Personas** → Essentiel
4️⃣ **PRD + Roadmap** → Important
5️⃣ Reste → Complémentaire

---

## 🚀 QUICK WINS À EXTRAIRE

Au-delà du dossier complet, Perplexity doit identifier **10 actions immédiates (semaine 1)** pour démarrer :

1. [ ] Optimiser profil LinkedIn (photo, bannière, headline)
2. [ ] Créer page entreprise Copronomie
3. [ ] Publier 1er post LinkedIn (teasing projet)
4. [ ] LancerRéessayerSContinuermarkdown## 🚀 QUICK WINS À EXTRAIRE (Suite)

Au-delà du dossier complet, Perplexity doit identifier **10 actions immédiates (semaine 1)** pour démarrer :

1. [ ] Optimiser profil LinkedIn (photo, bannière, headline)
2. [ ] Créer page entreprise Copronomie
3. [ ] Publier 1er post LinkedIn (teasing projet)
4. [ ] Lancer sondage LinkedIn (pain points syndics)
5. [ ] Identifier 50 syndics dans les 724 abonnés (Sales Navigator ou manuel)
6. [ ] Envoyer 10 DM personnalisés pour interviews
7. [ ] Créer landing page waitlist MVP (Next.js + Vercel, 1 journée)
8. [ ] Configurer infrastructure de base (Supabase, domaine, emails)
9. [ ] Rédiger CGU/CGV version beta (template + adaptation)
10. [ ] Contacter 1 avocat spécialisé proptech (consultation 1h statut juridique)

---

## 🔍 QUESTIONS STRATÉGIQUES À TRANCHER (Perplexity doit recommander)

Perplexity doit **analyser les trade-offs** et recommander une décision pour chaque dilemme :

### Dilemme 1 : Quelle Verticale Lancer en Premier (MVP) ?

**Options :**
- **A. Contrats Récurrents** (ménage, gardiennage, maintenance)
  - ✅ Fréquence élevée (renouvellement annuel)
  - ✅ Processus standardisé, facile à digitaliser
  - ✅ Pain point fort (chronophage)
  - ❌ Montants plus faibles (marges réduites)

- **B. Travaux BTP** (ravalement, rénovation)
  - ✅ Montants élevés (marges importantes)
  - ✅ Syndics très motivés (enjeux AG, budget)
  - ❌ Cycle long (décision AG, validation copropriétaires)
  - ❌ Complexité technique (cahier des charges, normés)

- **C. Énergie** (électricité, gaz)
  - ✅ Marché mature, syndics habitués comparateurs
  - ✅ Commissions potentielles élevées
  - ❌ Concurrence forte (Opéra Energie, Selectra)
  - ❌ Réglementation stricte (comparateurs)

- **D. Multi-Catégories dès J0** (3-5 services)
  - ✅ Valeur perçue forte ("plateforme complète")
  - ✅ Use cases diversifiés (acquisition plus large)
  - ❌ Complexité développement (interfaces multiples)
  - ❌ Sourcing prestataires difficile (plusieurs métiers)

**🎯 Recommandation attendue Perplexity :**
Quelle option choisir et pourquoi ? (data-driven : fréquence besoins, willingness-to-pay, complexité exécution)

---

### Dilemme 2 : Marketplace Biface J0 ou Côté Syndic d'Abord ?

**Option A : Marketplace Biface dès MVP**
- Syndics ET prestataires s'inscrivent librement
- ✅ Network effects dès le début
- ✅ Autonomie (self-service)
- ❌ Chicken-and-egg (risque plateforme vide)
- ❌ Qualité prestataires variable

**Option B : Côté Syndic d'Abord (Sourcing Manuel Prestataires)**
- Syndics créent demandes, Copronomie sourcing prestataires en coulisses (appels, LinkedIn)
- ✅ Qualité garantie (curation manuelle)
- ✅ Pas de chicken-and-egg (prestataires recrutés on-demand)
- ✅ Feedback syndics puissant (intimité client)
- ❌ Non-scalable (temps fondateur limité)
- ❌ Retards réponses (attente sourcing)

**🎯 Recommandation attendue :**
Hybride ? Séquence (phase 1 manuel → phase 2 self-service) ? Justification.

---

### Dilemme 3 : Pricing Strategy

**Option A : Freemium Généreux (3-5 demandes/mois gratuites)**
- ✅ Adoption rapide, barrière faible
- ✅ Viralité (bouche-à-oreille)
- ❌ Conversion difficile (pourquoi payer si gratuit suffit ?)
- ❌ Utilisateurs low-value (petits syndics 1-2 demandes/an)

**Option B : Payant dès J0 (Trial 14 jours puis 49€/mois)**
- ✅ Qualifie leads (willingness-to-pay)
- ✅ MRR immédiat
- ❌ Friction adoption (barrière psychologique)
- ❌ Difficulté atteindre masse critique

**Option C : 100% Gratuit Syndics, Monétiser Prestataires Uniquement**
- ✅ Adoption explosive côté syndics
- ✅ Modèle éprouvé (Companeo, Hellopro)
- ❌ Dépendance prestataires (churn = perte revenus)
- ❌ Alignement moindre (syndic pas client payant)

**🎯 Recommandation attendue :**
Quel modèle selon phase ? (ex: gratuit M0-M3, freemium M4-M9, tiers premium M10+)

---

### Dilemme 4 : Géographie Initiale

**Option A : Île-de-France Uniquement (M0-M6)**
- ✅ Concentration copropriétés (33% marché français)
- ✅ Proximité (rencontres physiques, événements)
- ✅ Réseau LinkedIn déjà IDF-centré
- ❌ Limite TAM initial

**Option B : National dès J0**
- ✅ TAM maximum, opportunités partout
- ✅ SEO (mots-clés géolocalisés multiples)
- ❌ Dilution efforts marketing
- ❌ Sourcing prestataires complexe (couverture nationale)

**Option C : Top 5 Métropoles (Paris, Lyon, Marseille, Toulouse, Bordeaux)**
- ✅ Équilibre (80% copropriétés France)
- ✅ Diversification géographique
- ❌ Complexité logistique (5 marchés locaux)

**🎯 Recommandation attendue :**
Quelle séquence géographique optimale ? (critères : densité copros, maturité digitale, concurrence locale)

---

### Dilemme 5 : Solo Founder ou Recruter Co-Founder ?

**Option A : Rester Solo (M0-M12)**
- ✅ Agilité, décisions rapides
- ✅ Pas de dilution equity
- ✅ Bootstrap possible
- ❌ Workload énorme (dev + product + sales + support)
- ❌ Pas de complementarité skills
- ❌ Risque burnout

**Option B : Recruter Co-Founder (Profil Sales/BizDev)**
- ✅ Complémentarité (tech + commercial)
- ✅ Charge partagée, résilience
- ✅ Crédibilité investisseurs (équipe vs solo)
- ❌ Dilution 30-50%
- ❌ Difficile trouver bon match (vision, culture, engagement)
- ❌ Ralentit démarrage (temps recrutement)

**🎯 Recommandation attendue :**
Solo jusqu'à quel jalon (PMF, 50 clients, 10K MRR) ? Profil co-founder idéal si oui ?

---

## 🧠 MÉTHODOLOGIE PERPLEXITY (Instructions Spécifiques)

Pour chaque section du brief, Perplexity doit :

### 1️⃣ RECHERCHE APPROFONDIE
- **Minimum 10 sources par section majeure** (marché, concurrence, GTM, finance)
- **Croiser sources** : institutionnelles + médias + études + benchmarks startups
- **Prioriser données françaises** (marché copropriété FR ≠ international)
- **Données récentes** : 2023-2025 prioritaires (marché évolue vite)

### 2️⃣ ANALYSE CRITIQUE
- **Ne pas se limiter au descriptif** : analyser tendances, tirer insights actionnables
- **Identifier patterns** : que font les startups SaaS B2B qui réussissent ?
- **Challenger hypothèses** : si une info semble incohérente, investiguer davantage

### 3️⃣ RECOMMANDATIONS ACTIONNABLES
- **Éviter platitudes** : "il faut faire du marketing" ❌ → "publier 4 posts LinkedIn/semaine avec formats carrousel, tester audiences syndics IDF 30-50 ans, budget 2K€/mois" ✅
- **Chiffrer objectifs** : pas de "augmenter les ventes" mais "acquérir 30 clients payants d'ici M6"
- **Prioriser** : urgent vs important, quick wins vs long terme

### 4️⃣ TEMPLATES & OUTILS
- **Fournir templates réutilisables** :
  - 20 idées posts LinkedIn (titres + structure)
  - Email sequences (onboarding, nurturing, réactivation)
  - Scripts DM LinkedIn
  - Pitch deck (structure + textes clés)
- **Outils recommandés** : avec pricing, alternatives, justifications

### 5️⃣ BENCHMARKS & EXEMPLES CONCRETS
- **Citer cas réels** : "Matera (proptech française) a levé 15M€ en 2022 en ciblant bailleurs avec modèle freemium, atteignant 5K clients en 18 mois via LinkedIn organique + partenariats comptables"
- **Métriques secteur** : "CAC moyen SaaS B2B immobilier France : 300-800€, LTV : 3-8K€" (avec sources)

### 6️⃣ SCENARII & SENSIBILITÉ
- **Toujours 3 scenarii** : pessimiste / réaliste / optimiste
- **Hypothèses explicites** : "si churn 5% vs 10%, impact MRR M12 = -40%"
- **Plans de contingence** : "si objectif M6 raté, alors pivoter pricing de X vers Y"

---

## 📊 LIVRABLES FINAUX STRUCTURÉS

Perplexity doit organiser la réponse en **plusieurs documents** (ou sections clairement délimitées) :

### 📄 DOCUMENT 1 : EXECUTIVE SUMMARY (5-10 pages)
- Synthèse haute-niveau pour lecture rapide (15 min)
- Sections : Vision, Marché (TAM/SAM/SOM), Concurrence (top 3), Business Model, Projections (MRR M12/M24), Besoins financement, Top 10 actions immédiates

### 📄 DOCUMENT 2 : ANALYSE DE MARCHÉ & CONCURRENCE (20-30 pages)
- Section 1️⃣ complète : marché, tendances, réglementation
- Section 1️⃣1️⃣ complète : competitive analysis, SWOT

### 📄 DOCUMENT 3 : STRATÉGIE PRODUIT (30-40 pages)
- Section 2️⃣ : Vision/Mission
- Section 3️⃣ : Lean Canvas
- Section 4️⃣ : Personas (4 fiches détaillées)
- Section 5️⃣ : PRD
- Section 6️⃣ : Roadmap

### 📄 DOCUMENT 4 : GO-TO-MARKET (40-50 pages)
- Section 7️⃣ complète : tous canaux (LinkedIn prioritaire, SEO, partenariats, événements, email, cold outreach, referral)
- Templates, calendriers, budgets

### 📄 DOCUMENT 5 : BUSINESS MODEL & FINANCE (25-35 pages)
- Section 8️⃣ : Pricing
- Section 9️⃣ : Financial Plan
- + Fichier Excel séparé (modèle financier dynamique)

### 📄 DOCUMENT 6 : RISQUES & GOUVERNANCE (15-20 pages)
- Section 1️⃣2️⃣ : Risk Analysis
- Section 1️⃣1️⃣ : OKRs
- Section 1️⃣3️⃣ : Legal & Compliance

### 📄 DOCUMENT 7 : ANNEXES (20-30 pages)
- Pitch deck (12 slides en markdown ou PowerPoint outline)
- One-pager
- Launch checklist
- Bibliographie complète (toutes sources citées)

---

## 🎨 ÉLÉMENTS VISUELS À INCLURE

Perplexity doit **décrire précisément** les visuels nécessaires (je les créerai ensuite) :

### Graphiques & Diagrammes
1. **Courbe MRR/ARR** (M0-M24, 3 scenarii)
2. **Funnel Acquisition** (visiteur → inscription → payant, taux conversion)
3. **Répartition Revenus** (Starter vs Pro vs Enterprise, camembert)
4. **Timeline Roadmap** (Gantt M0-M18)
5. **Matrice Concurrence** (axe X/Y : simplicité vs étendue services)
6. **Customer Journey Map** (5 étapes : découverte → considération → achat → usage → fidélisation)
7. **SWOT** (quadrants visuel)
8. **TAM/SAM/SOM** (entonnoir ou cercles concentriques)

### Tableaux
1. **Grille Tarifaire Comparative** (Gratuit / Starter / Pro / Enterprise)
2. **Features MVP** (Must Have / Should Have / Could Have / Won't Have)
3. **Benchmark Concurrents** (20+ critères)
4. **Projection Financière** (revenus, coûts, trésorerie par mois)
5. **OKRs Trimestriels** (Q1-Q4, objectifs + KRs)
6. **Risk Matrix** (probabilité/impact, 2x2)

---

## 💡 INSIGHTS ATTENDUS AU-DELÀ DES DONNÉES

Perplexity doit **interpréter** et **contextualiser**, pas seulement restituer :

### Exemples d'Insights Attendus :

❌ **Mauvais** (simple fact) :
"Le marché de la copropriété en France représente 9,8 millions de logements."

✅ **Bon** (insight actionnable) :
"Le marché compte 9,8M logements en copropriété, gérés par ~10K syndics professionnels. En ciblant les 2K cabinets moyens (50-500 copros chacun) en Île-de-France, Copronomie adresse un SAM de 1,5M copropriétés. Avec un taux de pénétration modeste de 5% à M24, cela représente 75K copropriétés, soit ~1500 cabinets clients si 50 copros/cabinet en moyenne. À 149€/mois (Plan Pro moyen), cela projette un ARR de 2,7M€."

---

❌ **Mauvais** :
"LinkedIn Ads coûte 5-8€ le clic pour cible B2B en France."

✅ **Bon** :
"LinkedIn Ads en B2B immobilier France : CPC 6-10€, taux conversion landing page 3-5%, soit CPL 120-300€. Avec objectif 30 clients M6 et taux conversion lead→client de 20%, il faut 150 leads, donc budget 18-45K€. Trop élevé pour bootstrap. **Recommandation : limiter LinkedIn Ads à 2K€/mois (20 leads) et compenser par organique (DM, posts) pour 80% acquisition.**"

---

❌ **Mauvais** :
"Il faut faire du SEO."

✅ **Bon** :
"SEO copropriété : mots-clés 'devis ménage copropriété' (320 recherches/mois, difficulté 25/100), 'ravalement façade prix' (1200 recherches/mois, difficulté 45/100). **Stratégie : cibler 20 mots-clés longue traîne faible concurrence (ex: 'contrat ménage parties communes Paris'), publier 1 article 2000 mots/semaine, obtenir 10 backlinks qualité (guest posts Le Moniteur, forums). Résultats attendus : 1000 visiteurs organiques/mois à M9, coût ~200€/mois (rédaction outsourcée).** ROI supérieur à LinkedIn Ads long terme."

---

## 🔗 INTERCONNEXIONS ENTRE SECTIONS

Perplexity doit **créer cohérence** entre toutes les sections :

### Exemple Cohérence :
- **Personas** identifient pain point : "Renouvellement contrats récurrents chronophage"
- **PRD** inclut feature : "Rappels automatiques échéances contrats"
- **Roadmap** place feature en Phase 2 (M7-M9)
- **GTM** met en avant bénéfice dans posts LinkedIn : "Gagnez 3h/mois sur renouvellements"
- **Pricing** : feature disponible uniquement Plan Pro (argument upsell)
- **Financial** : assume 30% clients Starter upgradent vers Pro grâce à cette feature

---

## 🚨 ERREURS À ÉVITER (Instructions Négatives)

Perplexity NE DOIT PAS :

❌ **Être vague** : "il faut communiquer sur les réseaux sociaux" (quel réseau ? quelle fréquence ? quel contenu ?)

❌ **Ignorer contraintes** : recommander "recruter 5 devs" alors que budget bootstrap 10K€

❌ **Copier-coller générique** : templates SaaS B2C alors que Copronomie est B2B

❌ **Données obsolètes** : citer étude 2018 alors qu'études 2024 disponibles

❌ **Ignorer spécificités françaises** : benchmarks US alors que marché copropriété très français

❌ **Jargon sans explication** : "mettre en place une stratégie ABM avec intent data" (définir termes)

❌ **Optimisme irréaliste** : "vous aurez 1000 clients en 6 mois" sans justification

❌ **Pessimisme paralysant** : "le marché est saturé, impossible de réussir"

❌ **Oublier actionnabilité** : analyses théoriques sans plan d'exécution concret

---

## 📚 BIBLIOGRAPHIE & SOURCES (À Inclure en Fin)

Perplexity doit lister **TOUTES les sources consultées** avec :
- Titre complet
- Auteur/Organisation
- Date de publication
- URL (si en ligne)
- Type de source (étude, article, rapport institutionnel, etc.)

**Format APA ou Chicago, au choix.**

**Exemple :**
> Xerfi. (2024). *Le marché de la gestion de copropriété en France - Analyse et perspectives 2024-2027*. Rapport sectoriel. https://www.xerfi.com/...

> FNAIM. (2023). *Baromètre annuel de la copropriété 2023*. Fédération Nationale de l'Immobilier. https://www.fnaim.fr/...

---

## 🎯 VALIDATION FINALE (Checklist Perplexity)

Avant de soumettre le dossier complet, Perplexity doit vérifier :

### Complétude
- [ ] Les 15 sections principales sont traitées
- [ ] Chaque section contient données chiffrées + sources
- [ ] Dilemmes stratégiques ont des recommandations argumentées
- [ ] Templates et outils sont fournis (calendriers, emails, scripts...)

### Qualité
- [ ] Données récentes (priorité 2023-2025)
- [ ] Sources françaises privilégiées (marché copropriété FR)
- [ ] Insights actionnables (pas que du descriptif)
- [ ] Cohérence inter-sections (personas ↔ PRD ↔ GTM ↔ pricing)

### Actionnabilité
- [ ] Quick wins identifiés (10 actions semaine 1)
- [ ] Roadmap claire avec jalons et deadlines
- [ ] Budgets chiffrés (par canal, par phase)
- [ ] Métriques de succès définies (KPIs, objectifs chiffrés)

### Format
- [ ] Markdown structuré (titres, listes, tableaux)
- [ ] Sections numérotées et hiérarchisées
- [ ] Longueur totale : 150-250 pages (adapté à la profondeur)
- [ ] Executive summary 5-10 pages (synthèse haute-niveau)
- [ ] Bibliographie complète en fin

---

## ⏱️ PRIORISATION SI CONTRAINTES (Plan B)

Si Perplexity Labs a des **limites de tokens/temps**, traiter dans cet ordre :

### 🔥 URGENT (à produire en priorité absolue)
1. **Executive Summary** (synthèse 10 pages)
2. **GTM Strategy - LinkedIn** (section 7.2 complète : organique + ads + calendrier 90 jours)
3. **Financial Plan** (section 9 complète : projections MRR, coûts, trésorerie, scenarii)
4. **Lean Canvas** (section 3)
5. **Quick Wins** (10 actions immédiates)

### ⚡ IMPORTANT (ensuite)
6. **Personas** (section 4 : 4 fiches)
7. **PRD** (section 5 : features MVP, user stories)
8. **Pricing** (section 8 : grille tarifaire, recommandations)
9. **Competitive Analysis** (section 11)
10. **Roadmap** (section 6 : phases, timeline)

### 📋 COMPLÉMENTAIRE (si temps restant)
11. Analyse marché (section 1)
12. Vision/Mission (section 2)
13. OKRs (section 11)
14. Risk Analysis (section 12)
15. Documents annexes (pitch deck, one-pager, legal checklist)

---

## 💬 TONE & STYLE (Instructions Rédactionnelles)

### Ton Attendu
- **Professionnel mais accessible** : pas de jargon excessif, expliquer termes techniques
- **Pragmatique** : focus exécution, pas théorie abstraite
- **Data-driven** : chiffres, sources, benchmarks (pas d'opinions non étayées)
- **Optimiste réaliste** : ambition forte mais hypothèses prudentes
- **Actionnable** : chaque section se termine par "What's Next" ou "Actions Immédiates"

### Style Rédactionnel
- **Phrases courtes** (15-20 mots max en moyenne)
- **Listes à puces** privilégiées (scannabilité)
- **Gras pour mots-clés** importants
- **Pas de language marketing creux** : "révolutionnaire", "disruptif", "game-changer" ❌
- **Exemples concrets** : "Matera a fait X et obtenu Y résultat" plutôt que "les startups proptech réussissent"

### Formatage Markdown
- Titres : `#` (H1) pour sections principales, `##` (H2) pour sous-sections, `###` (H3) pour détails
- **Gras** : `**texte**` pour emphase
- *Italique* : `*texte*` pour citations ou nuances
- Listes : `-` ou `1.` (numérotées si ordre important)
- Tableaux : syntaxe markdown standard `| Colonne 1 | Colonne 2 |`
- Code/formules : \`inline\` ou \`\`\`block\`\`\`
- Citations : `> Texte cité`
- Liens : `[Texte](URL)`

---

## 🧩 COMPLÉMENTS FINAUX

### Section Bonus 1 : Tech Stack Détaillé (si temps)

**Frontend :**
- Framework : Next.js 14 (App Router, RSC, SSR)
- Language : TypeScript (type safety)
- Styling : TailwindCSS + Shadcn/ui components
- Forms : React Hook Form + Zod validation
- State : Zustand (si besoin client state complexe)
- Data fetching : tRPC + TanStack Query

**Backend :**
- API : tRPC (type-safe, no REST boilerplate)
- ORM : Prisma (type-safe DB queries)
- Auth : NextAuth.js ou Supabase Auth
- Queue jobs (futur) : BullMQ + Redis (emails, notifications)

**Database & Storage :**
- DB : PostgreSQL (Supabase hosted)
- Storage : Supabase Storage (S3-compatible)
- Cache (futur) : Upstash Redis

**Infrastructure :**
- Hosting : Vercel (edge functions, global CDN)
- CI/CD : GitHub Actions → Vercel auto-deploy
- Monitoring : Sentry (errors), Vercel Analytics (performance), PostHog (product analytics)

**Payments (Phase 2) :**
- Stripe (abonnements, facturation)
- Stripe Connect (si commissions marketplace)

**Communication :**
- Emails : Resend (dev-friendly) ou SendGrid
- SMS (optionnel) : Twilio
- Notifications in-app : WebSockets (Supabase Realtime) ou polling

**Coûts Stack (estimés) :**
| Service | M0-M6 | M7-M12 | M13-M24 |
|---------|-------|--------|---------|
| Vercel | 0€ (Hobby) | 20€ (Pro) | 50€ (Team) |
| Supabase | 0€ (Free) | 25€ (Pro) | 100€ (Team) |
| Domaine + DNS | 15€/an | 15€/an | 15€/an |
| Stripe | 0€ (pay-as-you-go, 1,4%+0,25€/transaction) | ~50€ | ~200€ |
| Resend | 0€ (<1K emails/mois) | 20€ | 80€ |
| Monitoring | 0€ (free tiers) | 30€ | 100€ |
| **TOTAL** | **~2€/mois** | **~160€/mois** | **~545€/mois** |

---

### Section Bonus 2 : Growth Hacking Tactics (LinkedIn Focus)

**Recherche à effectuer :**
- Tactiques growth hacking B2B (Andrew Chen, Sean Ellis, Reforge)
- LinkedIn growth hacks 2024-2025 (algorithme, formats viraux)

**Tactiques à Tester (M4-M12) :**

**1. LinkedIn Pod (Groupes d'Engagement Mutuel)**
- Rejoindre ou créer pod de 10-20 membres (syndics, acteurs proptech)
- Engagement mutuel (like, commenter) dans 1ère heure post publication (boost reach algorithme)
- Outils : Lempod, UpLift, ou groupe WhatsApp

**2. Comment Hijacking**
- Commenter posts populaires d'influenceurs copropriété/immobilier
- Apporter valeur ajoutée (pas de spam), mentionner Copronomie subtilement
- Objectif : visibilité auprès audience qualifiée

**3. LinkedIn Live & Audio Events**
- Organiser LinkedIn Live mensuel : "30 min Questions/Réponses Gestion Copropriété"
- Inviter expert (avocat ALUR, comptable, prestataire) → co-branding
- Promotion 2 semaines avant, replay en article LinkedIn

**4. Lead Magnets (Aimants à Leads)**
- Créer ressources gratuites haute valeur :
  - "Guide 2025 : Optimiser tous vos contrats copropriété" (PDF 30 pages)
  - "Template Excel : Comparateur devis travaux" (téléchargeable)
  - "Checklist AG : Renouvellement contrats" (infographie)
- Gating : email requis pour télécharger → nurturing
- Promotion : posts LinkedIn, ads, SEO

**5. Webinaires Éducatifs**
- Thèmes : "Loi ALUR : obligations mise en concurrence", "Réduire charges copropriété de 15%"
- Partenariats : co-organiser avec FNAIM, UNIS (crédibilité)
- Pitch soft Copronomie en fin (5 min), CTA essai gratuit

**6. Referral Loops (Boucles de Parrainage)**
- Inciter partage : "Invitez 3 confrères syndics, obtenez 1 mois gratuit"
- Social proof automatique : "X syndics ont rejoint Copronomie cette semaine"
- Badges LinkedIn : "Early Adopter Copronomie" (gamification)

**7. Content Repurposing (Réutilisation Contenu)**
- 1 article blog long (2000 mots) → découper en :
  - 5 posts LinkedIn (1 insight par post)
  - 1 carrousel (10 slides PDF)
  - 1 vidéo YouTube (script article)
  - 1 thread Twitter/X (si pertinent)
  - 1 newsletter email (envoi abonnés)
- Maximise ROI temps création contenu

**8. Scraping & Hyper-Personnalisation**
- Scraper profils LinkedIn (Phantombuster, Sales Navigator)
- Données : nom, cabinet, nb copros (si LinkedIn), ville
- Cold DM hyper-personnalisé :
Bonjour [Prénom],
J'ai vu que vous gériez [Nom Cabinet] à [Ville].
Gérer [X] copropriétés, c'est jongler avec des dizaines de contrats à renouveler chaque année.
J'ai créé Copronomie pour simplifier exactement ça : comparer prestataires (ménage, travaux, énergie) en quelques clics.
[Client Similaire] économise déjà 5h/semaine avec notre outil.
15 min pour vous montrer ? (même si vous décidez de ne pas utiliser, j'adorerais avoir votre retour de pro)
[Votre prénom]

**9. LinkedIn Polls (Sondages)**
- Publier sondages hebdomadaires (engagement algorithmique favorisé)
- Exemples :
  - "Quelle est votre plus grande difficulté en copropriété ? A) Mise en concurrence B) Gestion comptable C) Communication copropriétaires D) Travaux"
  - "Combien de temps passez-vous par mois à renouveler vos contrats ? A) <2h B) 2-5h C) 5-10h D) >10h"
- Analyser résultats → insights pour roadmap produit + posts follow-up

**10. User-Generated Content (Contenu Utilisateurs)**
- Encourager clients à partager expérience LinkedIn :
  - "Partagez comment Copronomie vous a simplifié la vie (tag @Copronomie)"
  - Incentive : featured dans newsletter, 1 mois gratuit
- Reshare avec commentaire (social proof authentique)

---

### Section Bonus 3 : Métriques Avancées (North Star + AARRR)

**Framework AARRR (Pirate Metrics) appliqué à Copronomie :**

**A - ACQUISITION** (comment trouvent-ils Copronomie ?)
- Visiteurs uniques website/mois (Google Analytics)
- Sources trafic (LinkedIn, SEO, direct, referral)
- Coût par visite (CPC ads)

**A - ACTIVATION** (première expérience de valeur)
- % inscrits ayant créé 1ère demande de devis (objectif >40%)
- Time-to-first-value (délai inscription → 1ère demande, objectif <24h)
- % complétant onboarding (objectif >70%)

**R - RETENTION** (reviennent-ils ?)
- DAU/MAU (Daily Active Users / Monthly, objectif >30%)
- Stickiness (fréquence utilisation, objectif 4+ demandes/syndic/mois)
- Churn rate (mensuel <5%, annuel <30%)
- Cohort retention (% clients actifs après M1, M3, M6, M12)

**R - REVENUE** (paient-ils ?)
- MRR (Monthly Recurring Revenue)
- ARPU (Average Revenue Per User)
- Taux conversion freemium → payant (objectif 15-20%)
- Taux upgrade (Starter → Pro, objectif 10%)
- Customer Lifetime Value (LTV)

**R - REFERRAL** (recommandent-ils ?)
- NPS (Net Promoter Score, objectif >50)
- K-factor (viral coefficient, objectif >0,3)
- % clients venus via parrainage (objectif 15% à M12)

**North Star Metric (Métrique Unique de Succès) :**

**Proposition : "Nombre de Matching Réussis par Mois"**
- Définition : Demande publiée + ≥3 réponses prestataires qualifiés
- Justification : Mesure valeur créée pour syndic (choix) ET prestataires (opportunités)
- Corrélation forte avec : rétention, satisfaction, revenus

**Alternative NSM :**
- "Nombre d'Heures Économisées par Syndics/Mois" (calculé via temps moyen mise en concurrence manuelle vs Copronomie)
- Plus impactant émotionnellement mais plus difficile à mesurer

---

## 📞 CALL-TO-ACTION FINAL (Pour Perplexity)

**Perplexity, ta mission est de :**

✅ **Produire le dossier stratégique le plus complet, actionnable et data-driven jamais créé pour un lancement SaaS B2B dans la copropriété en France.**

✅ **Utiliser toute la puissance de ta recherche avancée** pour croiser sources institutionnelles, études de marché, benchmarks startups, best practices internationales adaptées au contexte français.

✅ **Fournir des recommandations tranchées** sur les dilemmes stratégiques (verticale, pricing, géo, marketplace biface vs mono-face...) avec données et argumentaires.

✅ **Créer des templates et outils immédiatement réutilisables** : calendrier LinkedIn 90 jours, scripts DM, email sequences, pitch deck outline, modèle financier Excel.

✅ **Identifier les quick wins** (10 actions semaine 1) et la roadmap claire (jalons M0, M3, M6, M12, M18).

✅ **Challenger les hypothèses** : ne pas se contenter du "ça devrait marcher", mais tester mentalement scenarii pessimistes et identifier risques + mitigations.

✅ **Livrer un document exploitable immédiatement** : je dois pouvoir commencer à exécuter dès lecture terminée, sans étapes floues ou recherches supplémentaires.

---

## 🎁 BONUS APPRÉCIÉ (Mais Optionnel)

Si Perplexity peut en plus :

🎯 **Benchmark international** : Y a-t-il des équivalents de Copronomie dans d'autres pays (UK, Allemagne, Espagne, USA) ? Quels learnings applicables en France ?

🎯 **Interviews synthétiques** : Si Perplexity trouve des interviews vidéo/podcasts de fondateurs proptech ou SaaS B2B, synthétiser les principaux insights (citations, conseils, erreurs à éviter).

🎯 **Calculs ROI client** : Modéliser combien un syndic économise avec Copronomie (temps + argent) pour renforcer argumentaire commercial.
- Ex: "Syndic moyen 150 copros, 30 contrats/an à renouveler, 2h/contrat = 60h/an. Avec Copronomie : 15 min/contrat = 7,5h/an. **Gain : 52,5h = 6,5 jours de travail.** Si gestionnaire coûte 40€/h → économie 2100€/an pour abonnement 1788€/an (149€x12) = **ROI +17%**."

🎯 **Analyse sentiment** : Si forums/Reddit copropriété disponibles, analyser sentiment syndics (frustrations récurrentes, vocabulaire utilisé, objections typiques) pour affiner messaging.

---

## ✅ VALIDATION & ITÉRATION

Une fois le dossier livré, je pourrai :

1. **Challenger certaines recommandations** : "Pourquoi privilégier contrats récurrents vs travaux BTP en MVP ?" → Perplexity approfondit analyse.

2. **Demander approfondissements** : "Détaille davantage la stratégie LinkedIn Ads : audiences, budgets, A/B tests à mener."

3. **Adapter au contexte** : "Si je n'ai que 5K€ budget (au lieu de 10K€), comment ajuster le plan ?"

4. **Itérer sur dilemmes** : "Finalement, je préfère marketplace biface dès J0. Comment adapter la roadmap et les coûts ?"

---

## 🏁 CONCLUSION DU BRIEF

Ce prompt est conçu pour que **Perplexity Labs produise un plan stratégique exhaustif, prêt à l'exécution, pour lancer Copronomie avec succès.**

**Objectif ultime :**
- À M6 : 30 clients payants, 5K€ MRR, break-even
- À M12 : 100 clients payants, 20K€ MRR, product-market fit validé
- À M18 : 200 clients payants, 40K€ MRR, leader marché copropriété digital, prêt levée Seed si pertinent

**Maintenant, Perplexity, c'est à toi. 🚀**

**Génère le dossier stratégique complet qui fera de Copronomie la référence de la mise en concurrence en copropriété en France.**