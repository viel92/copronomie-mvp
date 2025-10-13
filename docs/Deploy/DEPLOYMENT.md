# Guide de Déploiement - Copronomie v2

Ce guide explique comment déployer l'application Copronomie en production.

## Architecture de Déploiement

- **Frontend (Next.js):** Vercel
- **Backend (Hono API):** Railway
- **Database:** Supabase (déjà hébergé)
- **Emails:** Resend (déjà configuré)

## Prérequis

1. Compte GitHub avec le repo Copronomie
2. Compte Vercel (gratuit)
3. Compte Railway (5$/mois)
4. Accès à Supabase (déjà configuré)
5. Clé API Resend (déjà obtenue)

---

## Étape 1: Déploiement Backend (Railway)

### 1.1 Créer un Nouveau Projet Railway

1. Aller sur https://railway.app
2. Se connecter avec GitHub
3. Cliquer "New Project"
4. Sélectionner "Deploy from GitHub repo"
5. Choisir le repo `copronomie-v2`

### 1.2 Configurer le Service API

1. Dans Railway, sélectionner le projet créé
2. Cliquer "New Service" → "GitHub Repo"
3. Choisir le repo `copronomie-v2`
4. **Important:** Configurer le Root Directory
   - Dans Settings → Build
   - Root Directory: `apps/api`
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `node dist/index.js`

### 1.3 Configurer les Variables d'Environnement

Dans Railway → Variables, ajouter:

```
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://votre-app.vercel.app

# Supabase (copier depuis apps/api/.env)
SUPABASE_URL=https://lslkfxvscecwoqrrrwie.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# CORS
CORS_ORIGIN=https://votre-app.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logs
LOG_LEVEL=info

# Resend (copier depuis apps/api/.env)
RESEND_API_KEY=re_J3UoSXmL_NkZbrYLwzZyPfc7Vdc5oVyAM
RESEND_FROM_EMAIL=bonjour@copronomie.fr
```

### 1.4 Déployer

1. Railway déploie automatiquement après configuration
2. Copier l'URL générée (ex: `https://copronomie-api-production.up.railway.app`)
3. Cette URL sera utilisée pour `NEXT_PUBLIC_API_URL` sur Vercel

---

## Étape 2: Déploiement Frontend (Vercel)

### 2.1 Créer un Nouveau Projet Vercel

1. Aller sur https://vercel.com
2. Se connecter avec GitHub
3. Cliquer "Add New Project"
4. Importer le repo `copronomie-v2`

### 2.2 Configurer le Build

Dans Vercel → Project Settings:

- **Framework Preset:** Next.js
- **Root Directory:** `apps/web`
- **Build Command:** `cd ../.. && pnpm build --filter=@copronomie/web`
- **Output Directory:** `.next` (default)
- **Install Command:** `pnpm install`

### 2.3 Configurer les Variables d'Environnement

Dans Vercel → Settings → Environment Variables:

```
# API Backend (URL Railway de l'étape 1.4)
NEXT_PUBLIC_API_URL=https://copronomie-api-production.up.railway.app

# Supabase (copier depuis apps/web/.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://lslkfxvscecwoqrrrwie.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.4 Déployer

1. Cliquer "Deploy"
2. Vercel build et déploie automatiquement
3. Copier l'URL de production (ex: `https://copronomie-v2.vercel.app`)

### 2.5 Mettre à Jour Railway

1. Retourner sur Railway
2. Mettre à jour la variable `FRONTEND_URL` avec l'URL Vercel
3. Mettre à jour `CORS_ORIGIN` avec l'URL Vercel
4. Railway redéploie automatiquement

---

## Étape 3: Configurer le Domaine Custom (Optionnel)

### 3.1 Sur Vercel (Frontend)

1. Aller dans Settings → Domains
2. Ajouter votre domaine (ex: `app.copronomie.fr`)
3. Configurer les DNS selon les instructions Vercel

### 3.2 Sur Railway (Backend)

1. Aller dans Settings → Networking
2. Ajouter un custom domain (ex: `api.copronomie.fr`)
3. Configurer les DNS selon les instructions Railway

### 3.3 Mettre à Jour les Variables

1. **Sur Railway:** `FRONTEND_URL=https://app.copronomie.fr`
2. **Sur Vercel:** `NEXT_PUBLIC_API_URL=https://api.copronomie.fr`
3. **Sur Railway:** `CORS_ORIGIN=https://app.copronomie.fr`

---

## Étape 4: Tests Post-Déploiement

### 4.1 Vérifier la Santé de l'API

```bash
curl https://votre-api.railway.app/health
# Devrait retourner: {"status":"ok"}
```

### 4.2 Tester le Workflow Complet

1. **Inscription Syndic**
   - Aller sur `https://votre-app.vercel.app/auth`
   - Créer un compte syndic
   - Vérifier redirection vers `/syndic/dashboard`

2. **Création Copropriété**
   - Aller sur `/syndic/condos/new`
   - Créer une copropriété en saisie manuelle
   - Vérifier apparition dans `/syndic/condos`

3. **Création Projet**
   - Aller sur `/syndic/projects/new`
   - Créer et publier un projet
   - Vérifier statut "published"

4. **Inscription Company**
   - Ouvrir mode incognito
   - Créer un compte entreprise
   - Vérifier redirection vers `/company/dashboard`

5. **Soumission Devis**
   - Aller sur `/company/projects`
   - Trouver le projet publié
   - Soumettre un devis
   - Vérifier email de notification (syndic)

6. **Acceptation Devis**
   - Retourner au compte syndic
   - Aller sur le projet
   - Accepter le devis
   - Vérifier email de notification (company)

### 4.3 Vérifier les Emails

- Connecter à la boîte email du syndic
- Vérifier réception "Nouveau devis reçu"
- Connecter à la boîte email de l'entreprise
- Vérifier réception "Devis accepté"

---

## Étape 5: Monitoring (Optionnel mais Recommandé)

### 5.1 Sentry (Gratuit pour petits projets)

#### Frontend (Vercel)

1. Créer compte sur https://sentry.io
2. Créer projet Next.js
3. Installer SDK:
```bash
cd apps/web
pnpm add @sentry/nextjs
```

4. Ajouter dans `apps/web/next.config.js`:
```javascript
const { withSentry } = require('@sentry/nextjs')

module.exports = withSentry({
  // ... config existante
})
```

5. Ajouter variable Vercel:
```
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

#### Backend (Railway)

1. Dans Sentry, créer projet Node.js
2. Installer SDK:
```bash
cd apps/api
pnpm add @sentry/node
```

3. Ajouter dans `apps/api/src/index.ts`:
```typescript
import * as Sentry from '@sentry/node'

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN })
}
```

4. Ajouter variable Railway:
```
SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

### 5.2 Uptime Monitoring

Utiliser un service gratuit comme:
- https://uptimerobot.com
- https://betterstack.com

Ajouter 2 moniteurs:
1. Frontend: `https://votre-app.vercel.app`
2. Backend: `https://votre-api.railway.app/health`

---

## Étape 6: CI/CD (Automatisation Déploiement)

### Configuration Automatique

- **Vercel:** Déploie automatiquement chaque push sur `main`
- **Railway:** Déploie automatiquement chaque push sur `main`

### Workflow Recommandé

1. Créer branche feature: `git checkout -b feat/ma-feature`
2. Développer et commit
3. Push: `git push origin feat/ma-feature`
4. Créer Pull Request sur GitHub
5. Merger dans `main` après review
6. Vercel + Railway déploient automatiquement

---

## Troubleshooting

### Erreur "Cannot connect to database"

- Vérifier `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sur Railway
- Vérifier que Supabase n'est pas en pause (plan gratuit)

### Erreur "CORS policy"

- Vérifier `CORS_ORIGIN` sur Railway contient l'URL Vercel exacte
- Pas de trailing slash dans l'URL

### Build échoue sur Vercel

- Vérifier Root Directory: `apps/web`
- Vérifier Build Command inclut `cd ../..`
- Vérifier pnpm est installé (Vercel le détecte via `pnpm-lock.yaml`)

### API retourne 502/503

- Vérifier Railway logs: `railway logs`
- Vérifier `PORT` est bien 4000
- Vérifier Start Command: `node dist/index.js`

### Emails ne partent pas

- Vérifier `RESEND_API_KEY` sur Railway
- Vérifier `RESEND_FROM_EMAIL` est un domaine vérifié
- Checker logs Resend: https://resend.com/logs

---

## Coûts Mensuels Estimés

- **Vercel:** 0€ (plan Hobby gratuit)
- **Railway:** 5€/mois (starter plan)
- **Supabase:** 0€ (plan gratuit jusqu'à 500MB)
- **Resend:** 0€ (plan gratuit jusqu'à 100 emails/jour)
- **Sentry:** 0€ (plan gratuit jusqu'à 5K events/mois)

**Total:** ~5€/mois pour commencer

---

## Commandes Utiles

### Railway CLI

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Login
railway login

# Voir logs en temps réel
railway logs

# SSH dans le container
railway shell
```

### Vercel CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Login
vercel login

# Déployer manuellement
vercel --prod
```

---

## Checklist Finale

Avant de marquer le déploiement comme complet:

- [ ] Backend API accessible et répond à `/health`
- [ ] Frontend accessible et pages se chargent
- [ ] Inscription syndic fonctionne
- [ ] Inscription company fonctionne
- [ ] Création copropriété fonctionne
- [ ] Création projet fonctionne
- [ ] Publication projet fonctionne
- [ ] Soumission devis fonctionne
- [ ] Acceptation devis fonctionne
- [ ] Emails de notification fonctionnent
- [ ] Monitoring configuré (Sentry + Uptime)
- [ ] Variables d'environnement correctes
- [ ] Domaines custom configurés (optionnel)
- [ ] SSL/HTTPS actif (automatique sur Vercel/Railway)

---

## Support

En cas de problème:
1. Vérifier les logs Railway: `railway logs`
2. Vérifier les logs Vercel: Project → Deployments → Logs
3. Vérifier Sentry pour erreurs runtime
4. Consulter la documentation:
   - Vercel: https://vercel.com/docs
   - Railway: https://docs.railway.app
   - Supabase: https://supabase.com/docs

---

**Dernière mise à jour:** 4 Octobre 2025
**Temps estimé déploiement:** 2-3 heures
