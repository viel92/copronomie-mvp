# Documentation du Projet Copronomie (Version Lovable)

## Vue d'ensemble
**Copronomie** est une plateforme SaaS de gestion de copropriétés permettant à trois types d'acteurs (syndics, entreprises de travaux, copropriétaires) de collaborer sur des projets, devis et contrats.

## Stack Technique Actuelle

### Frontend
- **Framework**: React 18.3.1 avec TypeScript 5.8.3
- **Bundler**: Vite 5.4.19
- **Routing**: React Router DOM 6.30.1
- **UI Framework**:
  - Tailwind CSS 3.4.17
  - shadcn/ui (60+ composants Radix UI)
  - Lucide React pour les icônes
- **State Management**: TanStack Query 5.83.0
- **Forms**: React Hook Form 7.61.1 + Zod 3.25.76

### Backend & Infrastructure
- **BaaS**: Supabase (PostgreSQL, Auth, Storage, Functions)
- **Auth**: Supabase Auth avec localStorage
- **Base de données**: PostgreSQL via Supabase
- **Storage**: Supabase Storage
- **API**: Direct Supabase client (pas de backend séparé)

## Architecture du Projet

```
copronomie/
├── src/
│   ├── pages/              # Pages principales et routes
│   │   ├── syndic/         # 19 pages spécifiques syndics
│   │   ├── Auth.tsx        # Authentification
│   │   ├── Dashboard.tsx   # Dashboard générique
│   │   └── ...
│   ├── components/         # Composants réutilisables
│   │   ├── ui/            # 60+ composants shadcn/ui
│   │   ├── dashboard/     # Composants dashboard
│   │   ├── analytics/     # Composants analytiques
│   │   ├── alerts/        # Système d'alertes
│   │   └── quotes/        # Gestion des devis
│   ├── services/          # Services métier
│   │   ├── AlertService.ts
│   │   ├── AnalyticsService.ts
│   │   └── PDFExtractionService.ts
│   ├── integrations/      # Intégrations externes
│   │   └── supabase/      # Client et types Supabase
│   ├── hooks/             # Hooks personnalisés
│   │   ├── useAuth.tsx
│   │   ├── useUserData.tsx
│   │   └── use-toast.ts
│   └── lib/               # Utilitaires
└── public/                # Assets statiques
```

## Fonctionnalités Principales

### 1. Gestion Multi-Rôles
- **Syndics**: Gestion complète des copropriétés, projets, devis
- **Entreprises**: Soumission de devis, suivi des projets
- **Copropriétaires**: Consultation, vote, suivi

### 2. Modules Fonctionnels

#### Projets de Travaux
- Création et gestion de projets
- Types: toiture, chauffage, ascenseur, peinture, façade, plomberie, électricité
- Statuts: brouillon, publié, analyse, attribué, terminé
- Comparaison de projets
- Attribution automatique

#### Gestion des Devis
- Création et soumission de devis
- Comparaison multi-critères
- Statuts: brouillon, soumis, accepté, rejeté
- Analyse PDF de devis

#### Contrats
- Contrats immobiliers
- Contrats énergétiques
- Commandes de service
- Gestion des échéances

#### Analytics et Reporting
- KPIs en temps réel
- Graphiques de tendances
- Analyses comparatives
- Export de données

#### Système d'Alertes
- Alertes configurables par type
- Notifications email
- Dashboard d'alertes
- Historique

### 3. Fonctionnalités Techniques

#### Authentification
- Inscription/Connexion
- Reset de mot de passe
- Sessions persistantes
- Protection des routes par rôle

#### Upload et Traitement
- Upload de fichiers PDF
- Extraction de données PDF
- Stockage sécurisé

#### Interface Responsive
- Design mobile-first
- Thème clair/sombre
- Skeleton loaders
- Toast notifications

## Base de Données

### Tables Principales (14)

```sql
-- Utilisateurs et profils
users (id, email, user_role, created_at)
syndics (id, user_id, company_name, siret, phone, address)
companies (id, user_id, name, siret, specialties, rating)
condos (id, name, address, syndic_id, units_count)

-- Projets et devis
projects (id, title, type, status, condo_id, syndic_id, budget)
quotes (id, project_id, company_id, amount, status, details)

-- Contrats et services
property_contracts (id, syndic_id, contract_number, type)
energy_contracts (id, syndic_id, provider, contract_type)
service_orders (id, syndic_id, company_id, service_type, status)

-- Système
alerts (id, syndic_id, type, priority, message, is_read)
alert_settings (id, syndic_id, alert_type, enabled, config)
subscriptions (id, syndic_id, plan_name, status, current_period_end)
coproprietes_registry (id, name, address, immatriculation_number)
```

### Enums
- `user_role`: syndic | company | condo
- `project_status`: draft | published | analyzing | awarded | completed
- `project_type`: roofing | heating | elevator | painting | facade | plumbing | electrical
- `quote_status`: draft | submitted | accepted | rejected

## Routes et Navigation

### Routes Publiques
- `/` - Landing page
- `/auth` - Authentification
- `/dev` - Dashboard développeur

### Routes Protégées

#### Syndic (/syndic/*)
- `/syndic/dashboard` - Dashboard principal
- `/syndic/projects` - Gestion des projets
- `/syndic/companies` - Entreprises partenaires
- `/syndic/condos` - Copropriétés
- `/syndic/analytics` - Analyses
- `/syndic/alerts` - Alertes
- `/syndic/subscription` - Abonnement
- Et 12+ autres routes spécialisées

#### Entreprise (/company/*)
- `/company/dashboard` - Dashboard entreprise
- `/company/projects` - Projets disponibles
- `/company/quotes` - Mes devis

#### Copropriétaire (/condo/*)
- `/condo/dashboard` - Dashboard copropriétaire
- `/condo/projects` - Projets de la copropriété
- `/condo/documents` - Documents

## Intégrations Supabase

### Configuration
```typescript
// URL: https://lslkfxvscecwoqrrrwie.supabase.co
// Clé publique: Configuration dans .env
// Storage: localStorage
// Auto-refresh: Activé
```

### Utilisation par Module

#### Direct (via client Supabase)
- Services: AlertService, AnalyticsService
- Hooks: useAuth, useUserData
- Components: TestDataGenerator, Analytics, Alerts

#### Indirect (via hooks)
- Toutes les pages dashboard
- Composants protégés
- Formulaires de données

#### Sans Supabase
- Landing page
- Composants UI purs
- Utilitaires

## Flux de Données

### Authentification
```
User → Auth.tsx → useAuth → Supabase Auth → Session → Dashboard
```

### CRUD Operations
```
Component → useUserData → TanStack Query → Supabase Client → PostgreSQL
```

### Alertes
```
Trigger → AlertService → Supabase Function → Email/Notification
```

## Points d'Attention pour la Migration

### Dépendances Critiques à Supabase
1. **Authentification**: Tout le système auth dépend de Supabase
2. **Requêtes directes**: 50+ requêtes directes depuis le frontend
3. **Types générés**: Types TypeScript générés depuis la DB
4. **Storage**: Fichiers stockés dans Supabase Storage
5. **Functions**: Logique métier dans les functions Supabase

### Architecture Monolithique
- Pas de séparation frontend/backend
- Logique métier dans le frontend
- Pas de couche API intermédiaire
- Couplage fort avec Supabase

### Absence de Tests
- Aucun test unitaire
- Aucun test d'intégration
- Aucun test E2E

### Performance
- Pas de SSR/SSG
- Bundle non optimisé
- Requêtes non mises en cache côté serveur

## Métriques du Projet

- **Composants**: 100+ composants React
- **Pages**: 25+ pages
- **Tables DB**: 14 tables principales
- **Services**: 3 services métier
- **Hooks**: 4 hooks personnalisés
- **Dépendances**: 64 packages npm

## Recommandations pour la Migration

### Priorités
1. Extraire la logique métier du frontend
2. Créer une couche API intermédiaire
3. Implémenter SSR avec Next.js
4. Ajouter des tests
5. Optimiser les performances

### Réutilisable
- Composants UI (shadcn/ui)
- Styles Tailwind
- Types TypeScript
- Structure des données

### À Refactorer
- Hooks avec logique Supabase
- Services avec requêtes directes
- Pages avec logique métier
- Gestion d'état globale