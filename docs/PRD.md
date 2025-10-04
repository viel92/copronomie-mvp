# PRD (Product Requirements Document) - Copronomie

## 1. Vision Produit

### Vision
Copronomie est la plateforme de référence qui simplifie et digitalise la gestion des travaux de copropriété en France, en connectant de manière transparente les syndics de copropriété avec des entreprises qualifiées du BTP.

### Mission
Transformer le processus traditionnel, chronophage et inefficace de mise en concurrence pour les travaux de copropriété en une expérience digitale fluide, transparente et collaborative.

### Problématique Résolue
- **Pour les Syndics** : Difficulté à trouver et comparer rapidement des entreprises qualifiées, gestion manuelle des devis, manque de traçabilité
- **Pour les Entreprises** : Accès limité aux projets de copropriété, processus de devis complexe, difficulté à se différencier

## 2. Besoins Utilisateurs

### Syndics de Copropriété

**Besoins Primaires:**
- Créer et gérer des projets de travaux simplement
- Lancer des appels d'offres vers plusieurs entreprises qualifiées
- Comparer facilement les devis reçus
- Suivre l'avancement des projets en temps réel
- Gérer leur portefeuille de copropriétés

**Besoins Secondaires:**
- Historique complet des projets et devis
- Communication centralisée avec les entreprises
- Gestion documentaire des projets
- Reporting pour les assemblées générales

### Entreprises du BTP

**Besoins Primaires:**
- Accéder à des opportunités de projets qualifiés
- Soumettre des devis de manière structurée
- Suivre le statut de leurs propositions
- Gérer leur profil et leurs qualifications

**Besoins Secondaires:**
- Historique des projets remportés
- Statistiques de performance (taux de conversion)
- Communication directe avec les syndics
- Gestion de la facturation

## 3. Fonctionnalités Actuelles

### Module Authentification
- Inscription/Connexion multi-rôles (Syndic/Entreprise)
- Gestion de profils utilisateurs
- Sécurité basée sur Supabase Auth

### Module Copropriétés (Syndics)
- Import en masse via SIRET
- Création manuelle de copropriétés
- Gestion du portefeuille
- Filtrage et recherche

### Module Projets
**Pour les Syndics:**
- Création de projets détaillés (titre, description, type, budget)
- Sélection de la copropriété concernée
- Gestion des statuts (DRAFT, PUBLISHED, IN_PROGRESS, COMPLETED, CANCELLED)
- Édition et suppression de projets
- Lancement d'appels d'offres

**Pour les Entreprises:**
- Visualisation des projets disponibles
- Détails complets des projets
- Possibilité de soumettre des devis

### Module Devis
**Pour les Entreprises:**
- Création de devis détaillés
- Lignes de devis multiples (description, quantité, prix unitaire)
- Calcul automatique TTC avec TVA
- Gestion du statut (DRAFT, SUBMITTED, ACCEPTED, REJECTED)

**Pour les Syndics:**
- Réception et visualisation des devis
- Comparaison des offres
- Acceptation/Rejet de devis
- Historique complet

### Tableaux de Bord
**Syndic Dashboard:**
- Vue d'ensemble des projets actifs
- Statistiques (projets, devis reçus, en attente)
- Actions rapides

**Entreprise Dashboard:**
- Projets disponibles
- Devis en cours
- Statistiques de performance

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
- [ ] Système de notifications en temps réel
- [ ] Chat intégré syndic-entreprise
- [ ] Upload et gestion documentaire
- [ ] Amélioration de l'UX mobile
- [ ] Système de notation et avis

### Phase 2 - Croissance (Q2 2025)
- [ ] Module de facturation intégré
- [ ] Tableau de bord analytique avancé
- [ ] Export de données (PDF, Excel)
- [ ] Intégration calendrier
- [ ] API publique pour intégrations tierces

### Phase 3 - Scale (Q3-Q4 2025)
- [ ] Marketplace d'entreprises vérifiées
- [ ] Assurance qualité et garanties
- [ ] Module de paiement sécurisé
- [ ] Application mobile native
- [ ] IA pour matching automatique projet-entreprise

## 6. Métriques de Succès

### Métriques d'Adoption
- **Syndics inscrits:** Objectif 100 en 6 mois
- **Entreprises inscrites:** Objectif 500 en 6 mois
- **Projets créés:** Objectif 50/mois après 3 mois
- **Taux d'activation:** >60% des inscrits créent au moins 1 projet/devis

### Métriques d'Engagement
- **Taux de conversion projet→devis:** >40%
- **Temps moyen de réponse entreprise:** <48h
- **Nombre moyen de devis par projet:** 3-5
- **Taux de complétion de profil:** >80%

### Métriques Business
- **Taux d'acceptation de devis:** >25%
- **Valeur moyenne des projets:** €15,000-€50,000
- **GMV (Gross Merchandise Value):** €500k en 12 mois
- **NPS (Net Promoter Score):** >40

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
- Respect du cadre légal français pour les marchés de travaux
- Conformité avec les règles de copropriété
- Protection des données personnelles (RGPD)

### Dépendances Techniques
- Supabase (BDD + Auth)
- Vercel (Hébergement)
- Services tiers pour emails (à définir)

### Risques
- Adoption lente du marché (syndics traditionnels)
- Complexité réglementaire
- Concurrence de plateformes établies
- Dépendance à des services tiers
