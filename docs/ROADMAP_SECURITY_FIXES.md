# PLAN DE CORRECTION SÉCURITÉ - COPRONOMIE V2
## Audit Pré-Production - 28 Octobre 2025

**Rapport audit complet:** `C:\Dev\copronomie-v2\docs\SECURITY_AUDIT_REPORT.md`

---

## ⚠️ ALERTE CRITIQUE: NE PAS DÉPLOYER EN PRODUCTION

Un audit de sécurité complet a révélé **58 problèmes** qui doivent être corrigés avant le déploiement en production.

| Priorité | Nombre | Effort estimé | Status |
|----------|--------|---------------|--------|
| **CRITIQUE** | 23 | 3-5 jours | ⚠️ À FAIRE |
| **HAUTE** | 15 | 2-3 jours | ⚠️ À FAIRE |
| **MOYENNE** | 12 | 2-3 jours | 📋 Planifié |
| **BASSE** | 8 | 1-2 jours | 📋 Planifié |
| **TOTAL** | 58 | 8-13 jours | 🔴 BLOQUANT |

---

## Top 10 Problèmes Critiques

1. **CRITIQUE-1:** Rate limiting désactivé sur endpoints auth
   - **Impact:** Attaques par force brute, credential stuffing
   - **Fichier:** `apps\api\src\routes\auth.routes.ts:40`

2. **CRITIQUE-2:** Rate limiter en mémoire non adapté production
   - **Impact:** Contournement en multi-instance
   - **Fichier:** `apps\api\src\middleware\rateLimiter.middleware.ts:14,44-46`

3. **CRITIQUE-3:** CORS configuré pour une seule origine
   - **Impact:** Environnements staging/production bloqués
   - **Fichier:** `apps\api\src\index.ts:31-34`

4. **CRITIQUE-4:** Données sensibles loggées (59 occurrences)
   - **Impact:** Tokens/passwords exposés dans logs
   - **Fichiers:** 11 fichiers avec console.log

5. **CRITIQUE-5:** Validation Supabase manquante
   - **Impact:** Échecs silencieux en production
   - **Fichier:** `apps\api\src\config\supabase.ts:29-47`

6. **CRITIQUE-6:** Cache token sans invalidation
   - **Impact:** Logout non effectif (5 min délai)
   - **Fichier:** `apps\api\src\middleware\auth.middleware.ts:18-31`

7. **CRITIQUE-7:** Pas de sanitization d'entrée
   - **Impact:** XSS stocké, injection SQL
   - **Fichiers:** `project.service.ts`, `quote.service.ts`

8. **CRITIQUE-8:** Bypass auth dev dans code production
   - **Impact:** Authentification contournée si NODE_ENV mal configuré
   - **Fichier:** `apps\api\src\trpc\trpc.ts:20-37`

9. **CRITIQUE-9:** Mots de passe faibles (6 caractères)
   - **Impact:** Comptes facilement compromis
   - **Fichier:** `apps\api\src\routes\auth.routes.ts:19`

10. **CRITIQUE-10:** Pas d'enforcement HTTPS
    - **Impact:** Man-in-the-middle, vol de credentials
    - **Fichiers:** `apps\api\src\index.ts`, configuration déploiement

---

## PLAN DE CORRECTION - 13 JOURS

### PHASE 1: SÉCURITÉ CRITIQUE (Jours 1-5) 🔴 OBLIGATOIRE

**Objectif:** Corriger les 10 vulnérabilités CRITIQUES bloquant le déploiement

#### Jour 1-2: Rate Limiting & CORS

**Tâches:**
- [ ] Créer compte Upstash Redis (gratuit: 10k req/jour)
- [ ] Installer dépendances
  ```bash
  pnpm add @upstash/redis @upstash/ratelimit
  ```
- [ ] Migrer rate limiter vers Redis
  - **Fichier:** `apps\api\src\middleware\rateLimiter.middleware.ts`
  - Remplacer `const store: RateLimitStore = {}` par Upstash client
  - Configuration sliding window: 5 req/15min

- [ ] Réactiver rate limiting sur routes auth
  - **Fichier:** `apps\api\src\routes\auth.routes.ts:40`
  - Décommenter: `app.use('*', rateLimiter(...))`
  - Limites spécifiques:
    - Login: 10 requêtes/15min
    - Register: 5 requêtes/15min
    - Forgot-password: 3 requêtes/1h

- [ ] Corriger configuration CORS
  - **Fichier:** `apps\api\src\index.ts:31-34`
  - Remplacer:
    ```typescript
    origin: process.env.FRONTEND_URL || 'http://localhost:3000'
    ```
  - Par:
    ```typescript
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.STAGING_FRONTEND_URL,
      process.env.DEV_FRONTEND_URL,
    ].filter(Boolean)

    origin: (origin) => {
      if (!origin) return true
      if (allowedOrigins.includes(origin)) return true
      if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
        return true
      }
      return false
    }
    ```

- [ ] Ajouter protection CSRF
  ```typescript
  import { csrf } from 'hono/csrf'
  app.use('*', csrf({
    origin: allowedOrigins,
    excludePaths: ['/health']
  }))
  ```

- [ ] Tests rate limiting
  - Test: 11e requête login échoue (HTTP 429)
  - Test: Multi-instance partage compteur Redis

**Variables env à ajouter:**
```bash
# .env.production et .env.staging
UPSTASH_REDIS_URL=https://...
UPSTASH_REDIS_TOKEN=...
STAGING_FRONTEND_URL=https://staging-app.copronomie.fr
```

---

#### Jour 3: Logging Sécurisé & Validation

**Tâches:**
- [ ] Installer pino
  ```bash
  pnpm add pino pino-pretty
  ```

- [ ] Créer service logging
  - **Fichier:** `apps\api\src\lib\logger.ts` (nouveau)
  ```typescript
  import pino from 'pino'

  export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    redact: ['token', 'password', 'access_token', 'refresh_token'],
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
      })
    }
  })
  ```

- [ ] Remplacer tous console.log (59 occurrences)
  - **Fichiers prioritaires:**
    - `apps\api\src\config\supabase.ts:10-13`
    - `apps\api\src\middleware\auth.middleware.ts:43-96`
    - `apps\api\src\routes\auth.routes.ts:82-87`
  - Remplacer: `console.log('[Auth] Token validated:', { userId, token })`
  - Par: `logger.info({ userId }, 'Token validated')`
  - **NE JAMAIS logger:** token, password, access_token, refresh_token

- [ ] Valider config Supabase au startup
  - **Fichier:** `apps\api\src\config\supabase.ts:29-47`
  - Remplacer:
    ```typescript
    export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? createClient(...)
      : null
    ```
  - Par:
    ```typescript
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is required')
    }

    export const supabaseAdmin = createClient(...)
    ```

- [ ] Supprimer bypass auth développement
  - **Fichier:** `apps\api\src\trpc\trpc.ts:20-37`
  - Supprimer entièrement `devProcedure` OU
  - Protéger par feature flag:
    ```typescript
    export const devProcedure =
      process.env.ALLOW_TEST_AUTH === 'true' && process.env.NODE_ENV === 'development'
        ? t.procedure.use(...)
        : protectedProcedure
    ```

**Variables env:**
```bash
LOG_LEVEL=info  # production
LOG_LEVEL=debug # development
ALLOW_TEST_AUTH=false # Toujours false en production
```

---

#### Jour 4: Input Sanitization & Passwords

**Tâches:**
- [ ] Installer DOMPurify
  ```bash
  pnpm add isomorphic-dompurify
  ```

- [ ] Créer fonction sanitization
  - **Fichier:** `apps\api\src\lib\sanitize.ts` (nouveau)
  ```typescript
  import DOMPurify from 'isomorphic-dompurify'

  export const sanitizeHtml = (html: string): string => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: []
    })
  }
  ```

- [ ] Appliquer sanitization sur tous inputs
  - **Fichiers:**
    - `apps\api\src\services\project.service.ts`
    - `apps\api\src\services\quote.service.ts`
  - Champs à sanitizer: title, description, details
  - Exemple:
    ```typescript
    import { sanitizeHtml } from '../lib/sanitize'

    const projectSchema = z.object({
      title: z.string().min(1).max(200).transform(sanitizeHtml),
      description: z.string().max(5000).transform(sanitizeHtml).optional(),
    })
    ```

- [ ] Validation Zod renforcée
  - Toutes strings: ajouter `.max()` approprié
  - Champ `details` JSON: valider structure au lieu de `any`

- [ ] Renforcer exigences mots de passe
  - **Fichier:** `apps\api\src\routes\auth.routes.ts:19`
  - Remplacer:
    ```typescript
    password: z.string().min(6, 'Password must be at least 6 characters')
    ```
  - Par:
    ```typescript
    const commonPasswords = ['123456', 'password', 'qwerty', '12345678']

    password: z.string()
      .min(12, 'Minimum 12 caractères')
      .max(128, 'Maximum 128 caractères')
      .regex(/[A-Z]/, 'Au moins 1 majuscule')
      .regex(/[a-z]/, 'Au moins 1 minuscule')
      .regex(/[0-9]/, 'Au moins 1 chiffre')
      .regex(/[^A-Za-z0-9]/, 'Au moins 1 caractère spécial')
      .refine(
        (password) => !commonPasswords.includes(password.toLowerCase()),
        'Mot de passe trop commun'
      )
    ```

---

#### Jour 5: Token Management & HTTPS

**Tâches:**
- [ ] Implémenter token blacklist Redis
  - **Fichier:** `apps\api\src\lib\token-blacklist.ts` (nouveau)
  ```typescript
  import { Redis } from '@upstash/redis'

  const redis = Redis.fromEnv()

  export const invalidateToken = async (token: string) => {
    await redis.sadd('blacklist:tokens', token)
    await redis.expire('blacklist:tokens', 86400) // 24h
  }

  export const isTokenBlacklisted = async (token: string) => {
    return await redis.sismember('blacklist:tokens', token)
  }
  ```

- [ ] Supprimer cache token en mémoire
  - **Fichier:** `apps\api\src\middleware\auth.middleware.ts:18-31`
  - Supprimer: `const tokenCache = new Map<...>()`
  - Intégrer `isTokenBlacklisted()` dans auth middleware:
    ```typescript
    if (await isTokenBlacklisted(token)) {
      throw new HTTPException(401, { message: 'Token révoqué' })
    }
    ```

- [ ] Appeler invalidateToken au logout
  - **Fichier:** `apps\api\src\routes\auth.routes.ts` (route logout)
  - Ajouter:
    ```typescript
    await invalidateToken(token)
    ```

- [ ] Migrer localStorage vers httpOnly cookies (Frontend)
  - **Fichier:** `apps\web\src\components\providers\AuthProvider.tsx:49-50,116-117`
  - Backend: set cookie au login
    ```typescript
    c.cookie('auth_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/'
    })
    ```
  - Frontend: supprimer `localStorage.setItem(SESSION_STORAGE_KEY)`
  - Cookie auto-envoyé avec chaque requête

- [ ] Enforcement HTTPS en production
  - **Fichier:** `apps\api\src\index.ts`
  - Ajouter middleware:
    ```typescript
    app.use('*', async (c, next) => {
      if (process.env.NODE_ENV === 'production') {
        const proto = c.req.header('x-forwarded-proto') || 'http'
        if (proto !== 'https') {
          return c.redirect(`https://${c.req.header('host')}${c.req.url}`, 301)
        }
      }
      await next()
    })
    ```

**CHECKPOINT FIN JOUR 5:**
- ✅ 10 vulnérabilités CRITIQUES corrigées
- ✅ Tests sécurité automatisés passants
- ✅ Production DÉBLOQUÉE

---

### PHASE 2: HAUTE PRIORITÉ (Jours 6-8) 🟠

#### Jour 6: Type Safety & Transactions

**Tâches:**
- [ ] Éliminer types `any` (priorité haute, 111 occurrences)
  - **Fichiers:**
    - `apps\api\src\services\quote.service.ts:15,30`
      - Créer `interface QuoteDetails { ... }`
      - Remplacer `details?: any` par `details?: QuoteDetails`

    - `apps\api\src\middleware\auth.middleware.ts:9`
      - Créer `interface UserMetadata { ... }`
      - Remplacer `user_metadata?: any` par `user_metadata?: UserMetadata`

    - `apps\api\src\index.ts:92`
      - Typer correctement `createServer`

- [ ] Transactions database pour inscription
  - **Fichier:** `apps\api\src\routes\auth.routes.ts:89-143`
  - Implémenter rollback compensatoire:
    ```typescript
    try {
      const { data: authData, error } = await supabaseClient.auth.signUp(...)
      if (error) throw error

      const { error: profileError } = await supabaseAdmin
        .from('syndics')
        .insert({ user_id: authData.user.id, ... })

      if (profileError) {
        // ROLLBACK: Supprimer user auth créé
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        throw profileError
      }
    } catch (error) {
      // Handle error
    }
    ```

- [ ] Limites taille requête
  - **Fichier:** `apps\api\src\index.ts`
  ```typescript
  import { bodyLimit } from 'hono/body-limit'

  app.use('*', bodyLimit({ maxSize: 1024 * 1024 })) // 1MB default
  app.use('/api/uploads/*', bodyLimit({ maxSize: 10 * 1024 * 1024 })) // 10MB uploads
  ```

---

#### Jour 7: Security Headers & Email

**Tâches:**
- [ ] Configurer security headers complets
  - **Fichier:** `apps\api\src\index.ts:35`
  ```typescript
  app.use('*', secureHeaders({
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.API_URL],
    },
    strictTransportSecurity: 'max-age=31536000; includeSubDomains',
    xFrameOptions: 'DENY',
    xContentTypeOptions: 'nosniff',
    referrerPolicy: 'strict-origin-when-cross-origin',
  }))
  ```

- [ ] Validation email avancée
  - **Fichier:** `apps\api\src\routes\auth.routes.ts:13`
  - Blacklist domaines jetables:
    ```typescript
    const disposableDomains = ['tempmail.com', 'guerrillamail.com', '10minutemail.com']

    email: z.string()
      .email()
      .refine((email) => {
        const domain = email.split('@')[1]
        return !disposableDomains.includes(domain)
      }, 'Adresses email jetables non autorisées')
    ```

- [ ] Supprimer dangerouslySetInnerHTML
  - **Fichier:** `apps\web\src\components\landing\structured-data\JsonLd.tsx:80`
  - Remplacer par composant Script Next.js:
    ```typescript
    import Script from 'next/script'

    <Script
      id="structured-data"
      type="application/ld+json"
      strategy="beforeInteractive"
    >
      {JSON.stringify(structuredData)}
    </Script>
    ```

---

#### Jour 8: API Versioning & Pooling

**Tâches:**
- [ ] Versionner tous les routers
  - Créer `/api/v1/*` pour toutes les routes
  - Exemple: `/api/v1/auth`, `/api/v1/projects`, `/api/v1/quotes`
  - Ajouter header validation:
    ```typescript
    app.use('*', async (c, next) => {
      const acceptVersion = c.req.header('Accept-Version')
      if (acceptVersion && !['1', 'v1'].includes(acceptVersion)) {
        return c.json({ error: 'Version API non supportée' }, 400)
      }
      await next()
    })
    ```

- [ ] Connection pooling Supabase
  - **Fichier:** `apps\api\src\config\supabase.ts`
  ```typescript
  export const supabaseClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      // ... config existante
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    }
  )
  ```

- [ ] Tests sécurité basiques
  - Test RLS: syndic A ne voit pas projets syndic B
  - Test rate limiting: vérifier multi-tentatives bloquées

---

### PHASE 3: ROBUSTESSE (Jours 9-10) 🟡

#### Jour 9: Database & Performance

**Tâches:**
- [ ] Créer indexes manquants
  - **Fichier:** `scripts\create_indexes.sql`
  ```sql
  CREATE INDEX IF NOT EXISTS idx_projects_syndic_id ON projects(syndic_id);
  CREATE INDEX IF NOT EXISTS idx_quotes_project_id ON quotes(project_id);
  CREATE INDEX IF NOT EXISTS idx_quotes_company_id ON quotes(company_id);
  CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status) WHERE status != 'archived';
  ```
  - Exécuter: `psql -h ... -d ... -f scripts\create_indexes.sql`

- [ ] Implémenter pagination partout
  - **Fichiers:** `apps\api\src\services\user.service.ts:34-42` et autres
  - Template:
    ```typescript
    async getAllUsers(page = 1, limit = 50) {
      const offset = (page - 1) * limit

      const { data, error, count } = await supabaseClient
        .from('users')
        .select('*', { count: 'exact' })
        .range(offset, offset + limit - 1)

      return {
        data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }
    }
    ```

- [ ] Health check avec DB connectivity
  - **Fichier:** `apps\api\src\index.ts:39-45`
  ```typescript
  app.get('/health', async (c) => {
    const checks = {
      api: 'ok',
      database: 'unknown',
      timestamp: new Date().toISOString()
    }

    try {
      const { error } = await supabaseClient
        .from('users')
        .select('count')
        .limit(1)

      checks.database = error ? 'error' : 'ok'
    } catch (e) {
      checks.database = 'error'
    }

    const isHealthy = checks.database === 'ok'
    return c.json(checks, isHealthy ? 200 : 503)
  })
  ```

- [ ] Timeouts requêtes
  ```typescript
  import { timeout } from 'hono/timeout'
  app.use('*', timeout(30000)) // 30 secondes
  ```

---

#### Jour 10: Error Handling & CI/CD

**Tâches:**
- [ ] Masquer détails erreurs en production
  - **Fichier:** `apps\api\src\index.ts`
  ```typescript
  app.onError((err, c) => {
    Sentry.captureException(err)

    if (process.env.NODE_ENV === 'production') {
      return c.json({
        error: 'Internal Server Error',
        message: 'Une erreur inattendue s\'est produite'
      }, 500)
    }

    // Development seulement
    return c.json({
      error: err.name,
      message: err.message,
      stack: err.stack
    }, 500)
  })
  ```

- [ ] Supprimer continue-on-error CI/CD
  - **Fichier:** `.github\workflows\ci-cd.yml:51,71`
  - Supprimer `continue-on-error: true` pour lint et tests
  - Optionnel: garder seulement pour branches feature

- [ ] Authentification WebSocket
  - **Fichier:** `apps\api\src\lib\websocket.ts`
  ```typescript
  ws.on('connection', async (client, request) => {
    const url = new URL(request.url, 'ws://localhost')
    const token = url.searchParams.get('token')

    if (!token) {
      client.close(1008, 'Non autorisé')
      return
    }

    try {
      const { data: { user } } = await supabaseClient.auth.getUser(token)
      if (!user) throw new Error('Token invalide')

      client.userId = user.id
    } catch (error) {
      client.close(1008, 'Token invalide')
    }
  })
  ```

- [ ] Validation env vars au startup
  - **Fichier:** `apps\api\src\lib\env.ts` (nouveau)
  ```typescript
  import { z } from 'zod'

  const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    PORT: z.string().regex(/^\d+$/).transform(Number),
    UPSTASH_REDIS_URL: z.string().url(),
    UPSTASH_REDIS_TOKEN: z.string().min(1),
  })

  export const env = envSchema.parse(process.env)
  ```
  - Importer dans `index.ts` au début

**CHECKPOINT FIN JOUR 10:**
- ✅ Application production-ready
- ✅ Sécurité renforcée
- ✅ Monitoring complet

---

### PHASE 4: DETTE TECHNIQUE (Jours 11-13) 🟢

#### Jour 11-12: Code Quality

**Tâches:**
- [ ] Supprimer TODOs dans code
  - `apps\web\src\components\providers\AuthProvider.tsx:188,200`
  - Rechercher tous: `git grep -n "TODO"`

- [ ] Extraire magic numbers en constantes
  - Exemple: `const CACHE_TTL_MS = 5 * 60 * 1000`

- [ ] Standardiser error handling
  - Pattern uniforme dans tous services

- [ ] Ajouter JSDoc sur APIs publiques
  - Tous services exportés

---

#### Jour 13: Docker & Environment

**Tâches:**
- [ ] Optimiser Dockerfiles multi-stage
  - Minimiser taille images
  - Nettoyer build artifacts

- [ ] User non-root partout
  - Vérifier tous Dockerfiles

- [ ] Response time logging
  - Middleware pour tracker temps réponse

- [ ] Nettoyage automatique Docker
  - Script cron pour `docker system prune`

---

## CHECKLIST PRÉ-PRODUCTION

**À valider avant déploiement:**

### Sécurité (Obligatoire)
- [ ] 23 problèmes CRITIQUES corrigés
- [ ] 15 problèmes HAUTE priorité corrigés
- [ ] Tests sécurité automatisés: 6/6 passants
- [ ] Scan OWASP ZAP: 0 HIGH/CRITICAL
- [ ] Scan Snyk: 0 HIGH/CRITICAL

### Tests Sécurité Automatisés
1. [ ] Test rate limiting (11e requête → HTTP 429)
2. [ ] Test CSRF (token invalide bloqué)
3. [ ] Test XSS (input avec `<script>` rejeté)
4. [ ] Test RLS (syndic A ne voit pas data syndic B)
5. [ ] Test password requirements (6 chars → rejected)
6. [ ] Test token invalidation (logout → 401 sur requêtes)

### Performance
- [ ] Lighthouse Security score >90
- [ ] Temps réponse <3s toutes pages
- [ ] Database indexes créés
- [ ] Pagination active partout

### Monitoring
- [ ] Sentry frontend + backend opérationnel
- [ ] Logging structuré avec redaction
- [ ] Health checks avec DB connectivity
- [ ] Alertes configurées

---

## MÉTRIQUES DE SUCCÈS

**Objectifs chiffrés post-correction:**
- 🎯 Vulnérabilités CRITICAL: 10 → 0 ✅
- 🎯 Vulnérabilités HIGH: 15 → 0 ✅
- 🎯 Type `any`: 111 → <10 (90% réduction)
- 🎯 Test coverage: 2% → >60%
- 🎯 Lighthouse Security: N/A → >90

---

## VARIABLES D'ENVIRONNEMENT

**Ajouter dans `.env.production` et `.env.staging`:**

```bash
# Redis Upstash (gratuit)
UPSTASH_REDIS_URL=https://...
UPSTASH_REDIS_TOKEN=...

# Logging
LOG_LEVEL=info

# Feature Flags
ALLOW_TEST_AUTH=false

# CORS (production)
FRONTEND_URL=https://app.copronomie.fr
STAGING_FRONTEND_URL=https://staging-app.copronomie.fr
DEV_FRONTEND_URL=http://localhost:3000
```

---

## DÉPENDANCES À INSTALLER

```bash
# Phase 1: Sécurité critique
pnpm add @upstash/redis @upstash/ratelimit
pnpm add pino pino-pretty
pnpm add isomorphic-dompurify

# Déjà installé (vérifier):
# - zod (validation)
# - @sentry/nextjs, @sentry/node (monitoring)
# - hono/csrf, hono/body-limit, hono/timeout
```

---

## TIMELINE VISUELLE

```
┌──────────────────────────────────────────────────────┐
│      CORRECTION SÉCURITÉ - 13 JOURS                  │
├──────────────────────────────────────────────────────┤
│                                                       │
│  🔴 PHASE 1 (J1-5): CRITIQUE - BLOQUANT             │
│  ├─ J1-2: Rate limiting + CORS + CSRF               │
│  ├─ J3:   Logging + Config + Bypass auth            │
│  ├─ J4:   Sanitization + Passwords                  │
│  ├─ J5:   Tokens + HTTPS                            │
│  └─ ✅ Production débloquée                         │
│                                                       │
│  🟠 PHASE 2 (J6-8): HAUTE                           │
│  ├─ J6: Types + Transactions + Body limits          │
│  ├─ J7: Headers + Email validation                  │
│  ├─ J8: API versioning + Pooling                    │
│  └─ ✅ Production sécurisée                         │
│                                                       │
│  🟡 PHASE 3 (J9-10): ROBUSTESSE                     │
│  ├─ J9:  Database + Pagination + Health             │
│  ├─ J10: Errors + CI/CD + WebSocket                 │
│  └─ ✅ Production robuste                           │
│                                                       │
│  🟢 PHASE 4 (J11-13): DETTE TECHNIQUE               │
│  └─ Cleanup + Optimisations                         │
│                                                       │
└──────────────────────────────────────────────────────┘

🚦 STATUS: 🔴 BLOQUANT
   Production bloquée jusqu'à fin Phase 1 (Jour 5)
```

---

## ACTIONS IMMÉDIATES

**AUJOURD'HUI (28 Octobre):**
1. ✅ Audit complété (58 problèmes)
2. ✅ Rapport généré
3. ✅ Plan de correction créé
4. ⏭️ **NEXT:** Commencer Phase 1 Jour 1

**DEMAIN (29 Octobre) - JOUR 1:**
1. Créer compte Upstash Redis
2. Installer dépendances Phase 1
3. Implémenter rate limiting distribué
4. Corriger CORS multi-origines
5. Ajouter CSRF protection

**OBJECTIF FIN SEMAINE (2 Novembre):**
- ✅ Phase 1 complétée (10 CRITIQUES corrigés)
- ✅ Production DÉBLOQUÉE
- ✅ Tests sécurité passants

---

**Dernière mise à jour:** 28 Octobre 2025
**Prochaine révision:** Après chaque phase complétée
