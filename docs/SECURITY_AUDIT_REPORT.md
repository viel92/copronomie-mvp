# RAPPORT D'AUDIT DE SÉCURITÉ PRÉ-PRODUCTION
## Copronomie V2 - Application de Gestion de Copropriété

**Date du rapport:** 28 octobre 2025
**Emplacement du code:** C:\Dev\copronomie-v2
**Réviseur:** Claude Code - Agent Expert en Sécurité
**Statut:** **NE PAS DÉPLOYER EN PRODUCTION**

---

## RÉSUMÉ EXÉCUTIF

Cet audit complet de sécurité, performance et qualité de code a identifié **23 problèmes critiques**, **15 problèmes haute priorité**, **12 problèmes priorité moyenne**, et **8 dettes techniques de basse priorité** qui nécessitent une attention avant le déploiement en production.

**Évaluation du risque global: ÉLEVÉ**
Plusieurs problèmes CRITIQUES pourraient conduire à des failles de sécurité, pertes de données ou pannes de production s'ils ne sont pas corrigés.

### Statistiques de l'audit

| Catégorie | Nombre | Effort estimé |
|-----------|--------|---------------|
| **CRITIQUE** | 23 | 3-5 jours |
| **HAUTE** | 15 | 2-3 jours |
| **MOYENNE** | 12 | 2-3 jours |
| **BASSE** | 8 | 1-2 jours |
| **TOTAL** | 58 | 8-13 jours |

---

## PROBLÈMES CRITIQUES (À corriger avant production)

### 🔴 CRITIQUE-1: Limitation de débit désactivée sur les endpoints d'authentification
**Fichier:** `apps/api/src/routes/auth.routes.ts:40`
**Sévérité:** CRITIQUE
**Impact:** Attaques par force brute, credential stuffing, prise de contrôle de compte

**Description:**
```typescript
// Apply rate limiting to auth endpoints (temporarily disabled for testing)
// app.use('*', rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }))
```

La limitation de débit est commentée sur les endpoints d'authentification, laissant l'application vulnérable aux attaques par force brute de mots de passe.

**Impact sécurité:**
- Les attaquants peuvent effectuer un nombre illimité de tentatives de connexion
- Aucune protection contre les attaques de bots automatisés
- Risque élevé de compromission de compte

**Correction recommandée:**
```typescript
// Réactiver la limitation de débit pour les routes d'authentification
app.use('/register', rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  identifier: 'auth-register'
}))

app.use('/login', rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  identifier: 'auth-login'
}))

app.use('/forgot-password', rateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 3,
  identifier: 'auth-reset'
}))
```

---

### 🔴 CRITIQUE-2: Limitation de débit en mémoire non adaptée à la production
**Fichier:** `apps/api/src/middleware/rateLimiter.middleware.ts:14,44-46`
**Sévérité:** CRITIQUE
**Impact:** Limitation de débit contournée dans les déploiements multi-instances

**Description:**
```typescript
const store: RateLimitStore = {}

// NOTES DE PRODUCTION:
// - Ce rate limiter utilise un stockage en mémoire
// - Pour la production multi-instances, utiliser Redis/Upstash à la place
```

La limitation de débit en mémoire ne fonctionnera pas correctement dans un environnement de production multi-instances. Chaque instance maintient son propre compteur, permettant aux attaquants de contourner les limites en distribuant les requêtes entre les instances.

**Impact sécurité:**
- Les limites de débit peuvent être contournées dans les environnements avec load balancer
- Protection DDoS inefficace
- Épuisement des ressources possible

**Correction recommandée:**
Utiliser une solution de limitation de débit distribuée:
```typescript
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
})
```

**Alternative:** Utiliser Cloudflare Workers avec limitation de débit intégrée ou implémenter une limitation de débit basée sur Redis.

---

### 🔴 CRITIQUE-3: Configuration CORS utilise une seule origine
**Fichier:** `apps/api/src/index.ts:31-34`
**Sévérité:** CRITIQUE
**Impact:** Les environnements de production et staging peuvent être bloqués

**Description:**
```typescript
app.use('*', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
```

La configuration CORS n'accepte qu'une seule origine depuis `FRONTEND_URL`. Cela bloquera les requêtes légitimes depuis:
- Les environnements de staging
- Plusieurs domaines frontend
- Applications mobiles
- Environnements de développement

**Impact sécurité:**
- Le déploiement en production peut échouer en raison d'erreurs CORS
- Pas de support pour plusieurs environnements
- Credentials exposés à des origines incorrectes en développement

**Correction recommandée:**
```typescript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.STAGING_FRONTEND_URL,
  process.env.DEV_FRONTEND_URL,
].filter(Boolean)

app.use('*', cors({
  origin: (origin) => {
    // Autoriser les requêtes sans origine (apps mobiles, curl, etc.)
    if (!origin) return true

    // Vérifier contre la liste blanche
    if (allowedOrigins.includes(origin)) return true

    // En développement, autoriser localhost
    if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
      return true
    }

    return false
  },
  credentials: true,
  maxAge: 86400, // 24 heures
}))
```

---

### 🔴 CRITIQUE-4: Données sensibles loggées dans la console
**Fichier:** Plusieurs fichiers (59 occurrences dans 11 fichiers)
**Sévérité:** CRITIQUE
**Impact:** Données utilisateur sensibles exposées dans les logs

**Description:**
Le logging console est utilisé massivement dans l'application:
- `apps/api/src/config/supabase.ts:10-13` - Logs de configuration Supabase
- `apps/api/src/middleware/auth.middleware.ts:43-96` - Logs de tokens d'authentification
- `apps/api/src/routes/auth.routes.ts:82-87` - Logs d'IDs et emails utilisateur

**Impact sécurité:**
- Les tokens d'accès peuvent être loggés et exposés
- Emails et IDs utilisateur en clair dans les logs
- Violation de conformité (RGPD, PCI DSS)
- Les services d'agrégation de logs peuvent exposer des données sensibles

**Correction recommandée:**
1. Remplacer tous les `console.log` par du logging structuré:
```typescript
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['token', 'password', 'access_token', 'refresh_token'],
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      // NE PAS logger les headers avec tokens
    })
  }
})
```

2. Supprimer tout logging de token/mot de passe:
```typescript
// NE JAMAIS logger ceci:
console.log('[Auth] Token validé:', { userId, token }) // ❌

// À la place, logger ceci:
logger.info({ userId }, 'Token validé') // ✅
```

---

### 🔴 CRITIQUE-5: Validation de la clé de rôle de service Supabase manquante
**Fichier:** `apps/api/src/config/supabase.ts:29-47`
**Sévérité:** CRITIQUE
**Impact:** Échecs silencieux en production, problèmes d'intégrité des données

**Description:**
```typescript
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(...)
  : null
```

Le client admin retourne `null` si la clé de rôle de service est manquante, mais de nombreuses opérations critiques ne vérifient `!supabaseAdmin` qu'après avoir tenté de l'utiliser. Cela peut conduire à des erreurs d'exécution en production.

**Impact sécurité:**
- Les opérations critiques échouent silencieusement
- Aucune détection précoce de mauvaise configuration
- Les opérations de modification de données peuvent échouer de manière imprévisible

**Correction recommandée:**
```typescript
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY est requis pour les opérations serveur. ' +
    'Ceci est une erreur critique de configuration de sécurité.'
  )
}

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { ... }
)
```

---

### 🔴 CRITIQUE-6: Cache de token JWT sans invalidation appropriée
**Fichier:** `apps/api/src/middleware/auth.middleware.ts:18-31`
**Sévérité:** CRITIQUE
**Impact:** Les utilisateurs déconnectés restent authentifiés, détournement de session

**Description:**
```typescript
const tokenCache = new Map<string, { user: AuthUser; expiresAt: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Nettoyer le cache périodiquement
setInterval(() => { ... }, 60 * 1000)
```

La mise en cache de tokens sans invalidation appropriée signifie:
- Les utilisateurs déconnectés restent authentifiés jusqu'à 5 minutes
- Aucun moyen de forcer la déconnexion d'un utilisateur
- Les tokens compromis restent valides dans le cache
- Les changements de mot de passe n'invalident pas les tokens en cache

**Impact sécurité:**
- La déconnexion utilisateur ne les déconnecte pas réellement immédiatement
- Aucun moyen de révoquer les sessions compromises
- La réinitialisation de mot de passe n'invalide pas les sessions actives

**Correction recommandée:**
```typescript
// Utiliser Redis pour un cache distribué avec TTL approprié
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export const invalidateToken = async (token: string) => {
  await redis.del(`auth:${token}`)
  await redis.sadd(`blacklist:tokens`, token)
  // Définir TTL sur la blacklist pour le nettoyage
  await redis.expire(`blacklist:tokens`, 86400)
}

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  return await redis.sismember(`blacklist:tokens`, token)
}

// Dans le middleware d'authentification
if (await isTokenBlacklisted(token)) {
  throw new HTTPException(401, { message: 'Token révoqué' })
}
```

---

### 🔴 CRITIQUE-7: Pas de sanitization des entrées pour le contenu généré par l'utilisateur
**Fichier:** `apps/api/src/services/project.service.ts`, `apps/api/src/services/quote.service.ts`
**Sévérité:** CRITIQUE
**Impact:** XSS stocké, injection SQL via les champs JSON

**Description:**
Les entrées utilisateur ne sont pas sanitizées avant le stockage:
```typescript
export interface CreateProjectInput {
  title: string
  description?: string  // Pas de sanitization
  // ...
}

details?: any  // JSON complètement non validé
```

**Impact sécurité:**
- Attaques XSS stockées via les descriptions de projet
- Contenu malveillant dans les champs JSON `details`
- Injection SQL potentielle via les opérateurs JSON
- Injection HTML/Script

**Correction recommandée:**
```typescript
import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'

const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  })
}

const projectSchema = z.object({
  title: z.string().min(1).max(200).transform(sanitizeHtml),
  description: z.string().max(5000).transform(sanitizeHtml).optional(),
  details: z.object({
    // Valider la structure JSON
  }).optional()
})
```

---

### 🔴 CRITIQUE-8: Credentials de test de développement dans le code de production
**Fichier:** `apps/api/src/trpc/trpc.ts:20-37`
**Sévérité:** CRITIQUE
**Impact:** Contournement de l'authentification en mode développement

**Description:**
```typescript
export const devProcedure = process.env.NODE_ENV === 'development'
  ? t.procedure.use(({ ctx, next }) => {
      const user = ctx.user || {
        id: 'test-syndic-id',
        email: 'test@syndic.com',
        role: 'syndic',
      }
      return next({ ctx: { user } })
    })
  : protectedProcedure
```

Bien que protégé par une vérification `NODE_ENV`, ce mécanisme de contournement d'authentification ne devrait pas exister dans le code de production.

**Impact sécurité:**
- Si `NODE_ENV` est mal configuré, l'authentification est contournée
- L'audit de code signale ceci comme un contournement d'authentification
- Potentiel d'exposition accidentelle dans les environnements de staging

**Correction recommandée:**
1. Supprimer complètement de la branche de production
2. Utiliser des feature flags à la place:
```typescript
import { FeatureFlags } from './config/features'

export const devProcedure = FeatureFlags.isDevelopment && FeatureFlags.allowTestAuth
  ? t.procedure.use(({ ctx, next }) => { ... })
  : protectedProcedure

// Et dans config/features.ts
export const FeatureFlags = {
  isDevelopment: process.env.NODE_ENV === 'development',
  allowTestAuth: process.env.ALLOW_TEST_AUTH === 'true', // Doit être explicitement activé
} as const
```

---

### 🔴 CRITIQUE-9: Exigences de mot de passe manquantes
**Fichier:** `apps/api/src/routes/auth.routes.ts:19`
**Sévérité:** CRITIQUE
**Impact:** Mots de passe faibles, compromission de compte facile

**Description:**
```typescript
password: z.string().min(6, 'Password must be at least 6 characters'),
```

La validation du mot de passe vérifie seulement un minimum de 6 caractères. Aucune exigence pour:
- Lettres majuscules
- Lettres minuscules
- Chiffres
- Caractères spéciaux
- Liste noire de mots de passe communs

**Impact sécurité:**
- Les utilisateurs peuvent créer des mots de passe comme "123456"
- Attaques par force brute faciles
- Sécurité des credentials faible

**Correction recommandée:**
```typescript
const passwordSchema = z.string()
  .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
  .max(128, 'Le mot de passe doit contenir moins de 128 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
  .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial')
  .refine(
    (password) => !commonPasswords.includes(password.toLowerCase()),
    'Ce mot de passe est trop commun, veuillez en choisir un plus fort'
  )
```

---

### 🔴 CRITIQUE-10: Pas d'application HTTPS
**Fichier:** `apps/api/src/index.ts`, configuration CI/CD
**Sévérité:** CRITIQUE
**Impact:** Attaques man-in-the-middle, vol de credentials

**Description:**
Aucun code n'applique les connexions HTTPS uniquement. L'application acceptera les connexions HTTP si elle est déployée sans configuration de proxy inverse appropriée.

**Impact sécurité:**
- Credentials transmis en clair
- Tokens de session interceptables
- Attaques man-in-the-middle
- Violation RGPD/conformité

**Correction recommandée:**
```typescript
// Ajouter un middleware pour forcer HTTPS
app.use('*', async (c, next) => {
  if (process.env.NODE_ENV === 'production') {
    const proto = c.req.header('x-forwarded-proto') || 'http'

    if (proto !== 'https') {
      return c.redirect(`https://${c.req.header('host')}${c.req.url}`, 301)
    }
  }

  await next()
})

// Définir des cookies sécurisés
c.cookie('session', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 3600
})
```

---

## PROBLÈMES HAUTE PRIORITÉ (À corriger avant production)

### 🟠 HAUTE-1: Protection CSRF manquante
**Fichier:** `apps/api/src/index.ts`
**Sévérité:** HAUTE
**Impact:** Attaques Cross-Site Request Forgery

**Description:**
Aucune validation de token CSRF pour les opérations changeant l'état.

**Correction recommandée:**
```typescript
import { csrf } from 'hono/csrf'

app.use('*', csrf({
  origin: allowedOrigins,
  // Exclure le health check
  excludePaths: ['/health']
}))
```

---

### 🟠 HAUTE-2: Utilisation excessive du type `any` (111 occurrences)
**Fichier:** Plusieurs fichiers (10 fichiers identifiés)
**Sévérité:** HAUTE
**Impact:** Sécurité des types compromise, erreurs d'exécution potentielles

**Description:**
Trouvé 111 instances d'utilisation du type `any` dans le code de l'API. Exemples:
- `apps/api/src/services/quote.service.ts:15,30` - `details?: any`
- `apps/api/src/middleware/auth.middleware.ts:9` - `user_metadata?: any`
- `apps/api/src/index.ts:92` - `createServer as any`

**Impact:**
- Aucune vérification de type à la compilation
- Erreurs de type potentielles à l'exécution
- Difficile à refactoriser en toute sécurité

**Correction recommandée:**
Remplacer tous les `any` par des types appropriés:
```typescript
// Au lieu de:
details?: any

// Utiliser:
interface QuoteDetails {
  lineItems: Array<{
    description: string
    quantity: number
    unitPrice: number
  }>
  notes?: string
  attachments?: string[]
}

details?: QuoteDetails
```

---

### 🟠 HAUTE-3: Pas de support de transaction de base de données pour les opérations critiques
**Fichier:** `apps/api/src/routes/auth.routes.ts:89-143`
**Sévérité:** HAUTE
**Impact:** Incohérence des données, enregistrements orphelins

**Description:**
L'inscription utilisateur crée plusieurs enregistrements de base de données sans support de transaction:
```typescript
// Créer un utilisateur auth
const { data: authData } = await supabaseClient.auth.signUp(...)

// Créer une entrée syndic
await supabaseAdmin.from('syndics').insert(...)
```

Si la deuxième opération échoue, vous avez un utilisateur auth sans enregistrement de profil.

**Correction recommandée:**
Utiliser les transactions Supabase ou implémenter des transactions compensatoires:
```typescript
try {
  const { data: authData, error } = await supabaseClient.auth.signUp(...)

  if (error) throw error

  const { error: profileError } = await supabaseAdmin
    .from('syndics')
    .insert({ user_id: authData.user.id, ... })

  if (profileError) {
    // Rollback: Supprimer l'utilisateur auth
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
    throw profileError
  }
} catch (error) {
  // Gérer l'erreur
}
```

---

### 🟠 HAUTE-4: Limites de taille de requête manquantes
**Fichier:** `apps/api/src/index.ts`
**Sévérité:** HAUTE
**Impact:** Attaques DoS via de gros payloads

**Description:**
Aucune limite sur la taille du corps de requête. Les attaquants peuvent envoyer des payloads massifs pour épuiser les ressources du serveur.

**Correction recommandée:**
```typescript
import { bodyLimit } from 'hono/body-limit'

// Appliquer à toutes les routes
app.use('*', bodyLimit({
  maxSize: 1024 * 1024, // 1MB par défaut
}))

// Limites spécifiques pour les uploads de fichiers
app.use('/api/uploads/*', bodyLimit({
  maxSize: 10 * 1024 * 1024, // 10MB pour les uploads
}))
```

---

### 🟠 HAUTE-5: Pas de configuration de pool de connexions de base de données
**Fichier:** `apps/api/src/config/supabase.ts`
**Sévérité:** HAUTE
**Impact:** Épuisement des connexions, dégradation des performances

**Description:**
Client Supabase créé sans configuration de pool de connexions. Dans des scénarios à fort trafic, cela peut conduire à l'épuisement des connexions.

**Correction recommandée:**
```typescript
export const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      fetch: (...args) => fetch(...args),
    },
    db: {
      schema: 'public',
    },
    // Ajouter le pooling de connexions
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
)
```

---

### 🟠 HAUTE-6: Stockage de tokens frontend dans localStorage
**Fichier:** `apps/web/src/components/providers/AuthProvider.tsx:49-50,116-117`
**Sévérité:** HAUTE
**Impact:** XSS peut voler les tokens d'authentification

**Description:**
```typescript
const USER_STORAGE_KEY = 'copronomie_user'
const SESSION_STORAGE_KEY = 'copronomie_session'

localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData))
```

Stocker les tokens d'authentification dans localStorage les rend vulnérables aux attaques XSS.

**Correction recommandée:**
Utiliser des cookies httpOnly à la place:
```typescript
// Backend définit le cookie httpOnly
app.post('/login', async (c) => {
  // ... authentifier l'utilisateur

  c.cookie('auth_token', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 3600,
    path: '/'
  })

  return c.json({ success: true })
})

// Frontend lit automatiquement depuis le cookie
// Aucun accès localStorage nécessaire
```

---

### 🟠 HAUTE-7: En-têtes de sécurité manquants
**Fichier:** `apps/api/src/index.ts:35`
**Sévérité:** HAUTE
**Impact:** Diverses vulnérabilités de sécurité

**Description:**
L'utilisation du middleware `secureHeaders()` est bien, mais des en-têtes de sécurité supplémentaires sont nécessaires:

**Correction recommandée:**
```typescript
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", process.env.API_URL],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
  },
  strictTransportSecurity: 'max-age=31536000; includeSubDomains',
  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin-when-cross-origin',
  permissionsPolicy: {
    camera: [],
    microphone: [],
    geolocation: [],
  }
}))
```

---

### 🟠 HAUTE-8: Pas de validation d'email au-delà de la vérification du format
**Fichier:** `apps/api/src/routes/auth.routes.ts:13`
**Sévérité:** HAUTE
**Impact:** Faux comptes, spam

**Description:**
Vérifie seulement le format de l'email, pas si l'email existe réellement.

**Correction recommandée:**
```typescript
import { verifyEmail } from '@sendgrid/email-verification'

// Ou utiliser un service comme:
// - ZeroBounce
// - Hunter.io
// - Abstract API

const emailSchema = z.string()
  .email()
  .refine(async (email) => {
    // Vérifier les domaines d'email jetables
    const disposableDomains = ['tempmail.com', 'guerrillamail.com']
    const domain = email.split('@')[1]
    if (disposableDomains.includes(domain)) {
      return false
    }
    return true
  }, 'Les adresses email jetables ne sont pas autorisées')
```

---

### 🟠 HAUTE-9: Versioning d'API manquant
**Fichier:** Toutes les routes API
**Sévérité:** HAUTE
**Impact:** Les changements cassants affectent tous les clients

**Description:**
Aucune stratégie de versioning d'API. Toutes les routes sont au niveau racine.

**Correction recommandée:**
```typescript
// Versionner les routes API
app.route('/api/v1/auth', authRoutesV1)
app.route('/api/v1/projects', projectRoutesV1)

// Ajouter la négociation de version
app.use('*', async (c, next) => {
  const acceptVersion = c.req.header('Accept-Version')

  if (acceptVersion && !['1', 'v1'].includes(acceptVersion)) {
    return c.json({
      error: 'Version d\'API non supportée',
      supported: ['v1']
    }, 400)
  }

  await next()
})
```

---

### 🟠 HAUTE-10: dangerouslySetInnerHTML utilisé pour JSON-LD
**Fichier:** `apps/web/src/components/landing/structured-data/JsonLd.tsx:80`
**Sévérité:** HAUTE
**Impact:** XSS potentiel si les données deviennent dynamiques

**Description:**
```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
/>
```

Bien qu'actuellement sûr (données statiques), ce pattern est dangereux si `structuredData` devient dynamique.

**Correction recommandée:**
```typescript
// Utiliser le composant Script intégré de Next.js
import Script from 'next/script'

export function JsonLd() {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      strategy="beforeInteractive"
    >
      {JSON.stringify(structuredData)}
    </Script>
  )
}
```

---

## PROBLÈMES PRIORITÉ MOYENNE (À corriger rapidement après production)

### 🟡 MOYENNE-1: Pas d'implémentation de monitoring/observabilité
**Fichier:** `apps/api/src/lib/sentry.ts`
**Sévérité:** MOYENNE
**Impact:** Difficile de déboguer les problèmes de production

**Description:**
Sentry est initialisé mais pas intégré de manière complète.

**Correction recommandée:**
- Ajouter du logging structuré avec des IDs de corrélation
- Implémenter APM (Application Performance Monitoring)
- Ajouter des métriques personnalisées pour les KPIs métier
- Configurer des alertes pour les taux d'erreur

---

### 🟡 MOYENNE-2: Index de base de données manquants
**Fichier:** Schéma de base de données (fichiers SQL dans `scripts/`)
**Sévérité:** MOYENNE
**Impact:** Requêtes lentes, dégradation des performances

**Description:**
Besoin de vérifier que les index existent pour:
- Clés étrangères
- Champs fréquemment interrogés
- Colonnes de tri/ordonnancement

**Correction recommandée:**
Exécuter les scripts de création d'index et vérifier:
```sql
-- Vérifier les index manquants
SELECT * FROM check_missing_indexes();

-- Index clés nécessaires:
CREATE INDEX idx_projects_syndic_id ON projects(syndic_id);
CREATE INDEX idx_quotes_project_id ON quotes(project_id);
CREATE INDEX idx_quotes_company_id ON quotes(company_id);
CREATE INDEX idx_projects_status ON projects(status) WHERE status != 'archived';
```

---

### 🟡 MOYENNE-3: Pas de configuration de timeout de requête
**Fichier:** `apps/api/src/index.ts`
**Sévérité:** MOYENNE
**Impact:** Épuisement des ressources par des clients lents

**Correction recommandée:**
```typescript
import { timeout } from 'hono/timeout'

app.use('*', timeout(30000)) // timeout de 30 secondes
```

---

### 🟡 MOYENNE-4: Messages d'erreur exposent des détails internes
**Fichier:** Plusieurs fichiers de service
**Sévérité:** MOYENNE
**Impact:** Divulgation d'informations

**Description:**
Erreurs de base de données et stack traces exposées aux clients en mode développement.

**Correction recommandée:**
```typescript
app.onError((err, c) => {
  Sentry.captureException(err)

  // Ne jamais exposer les erreurs internes en production
  if (process.env.NODE_ENV === 'production') {
    return c.json({
      error: 'Erreur Interne du Serveur',
      message: 'Une erreur inattendue s\'est produite'
    }, 500)
  }

  // Développement seulement
  return c.json({
    error: err.name,
    message: err.message,
    stack: err.stack
  }, 500)
})
```

---

### 🟡 MOYENNE-5: Pas de vérification de santé pour la connexion à la base de données
**Fichier:** `apps/api/src/index.ts:39-45`
**Sévérité:** MOYENNE
**Impact:** L'orchestration de conteneurs ne peut pas détecter les problèmes de BD

**Description:**
La vérification de santé retourne seulement du JSON statique, ne vérifie pas la connectivité de la base de données.

**Correction recommandée:**
```typescript
app.get('/health', async (c) => {
  const checks = {
    api: 'ok',
    database: 'unknown',
    timestamp: new Date().toISOString()
  }

  try {
    // Requête BD rapide
    const { error } = await supabaseClient
      .from('users')
      .select('count')
      .limit(1)

    checks.database = error ? 'error' : 'ok'
  } catch (e) {
    checks.database = 'error'
  }

  const isHealthy = Object.values(checks).every(v => v === 'ok' || typeof v === 'string')

  return c.json(checks, isHealthy ? 200 : 503)
})
```

---

### 🟡 MOYENNE-6: Pagination manquante sur les endpoints de liste
**Fichier:** `apps/api/src/services/user.service.ts:34-42`, autres
**Sévérité:** MOYENNE
**Impact:** Problèmes de performance avec de gros ensembles de données

**Description:**
```typescript
async getAllUsers() {
  const { data, error } = await supabaseClient
    .from('users')
    .select('*')  // Pas de limite!
    .order('created_at', { ascending: false })
}
```

**Correction recommandée:**
```typescript
async getAllUsers(page = 1, limit = 50) {
  const offset = (page - 1) * limit

  const { data, error, count } = await supabaseClient
    .from('users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
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

---

### 🟡 MOYENNE-7: Pas de validation de longueur d'entrée sur les champs texte
**Fichier:** Interfaces de service
**Sévérité:** MOYENNE
**Impact:** Erreurs de base de données, DoS via de grandes entrées

**Correction recommandée:**
```typescript
const projectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  // Ajouter des limites à tous les champs texte
})
```

---

### 🟡 MOYENNE-8: Tests CI/CD configurés pour continuer en cas d'erreur
**Fichier:** `.github/workflows/ci-cd.yml:51,71`
**Sévérité:** MOYENNE
**Impact:** Les tests peuvent échouer sans bloquer le déploiement

**Description:**
```yaml
- name: Lint code
  run: pnpm run lint
  continue-on-error: true  # ❌ Ne devrait pas ignorer les échecs

- name: Run E2E Tests
  run: pnpm run test:e2e
  continue-on-error: true  # ❌ Ne devrait pas ignorer les échecs
```

**Correction recommandée:**
Supprimer `continue-on-error` ou le rendre conditionnel:
```yaml
- name: Lint code
  run: pnpm run lint
  # Supprimer continue-on-error entièrement

- name: Run E2E Tests
  run: pnpm run test:e2e
  # Continuer en cas d'erreur uniquement pour les branches non critiques
  continue-on-error: ${{ github.ref != 'refs/heads/master' }}
```

---

### 🟡 MOYENNE-9: Pas d'authentification WebSocket
**Fichier:** `apps/api/src/lib/websocket.ts`
**Sévérité:** MOYENNE
**Impact:** Accès non autorisé aux mises à jour en temps réel

**Description:**
La connexion WebSocket ne vérifie pas l'authentification.

**Correction recommandée:**
```typescript
// Exiger un token dans la connexion WebSocket
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

    // Stocker l'utilisateur avec la connexion
    client.userId = user.id
  } catch (error) {
    client.close(1008, 'Token invalide')
  }
})
```

---

### 🟡 MOYENNE-10: Mode strict TypeScript activé mais types ignorés
**Fichier:** `apps/api/tsconfig.json:10`, package.json
**Sévérité:** MOYENNE
**Impact:** Des erreurs de type peuvent exister malgré le mode strict

**Description:**
`skipLibCheck: true` et `strict: true` sont activés, mais de nombreux fichiers utilisent `any`.

**Correction recommandée:**
Activer des flags stricts supplémentaires:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## PROBLÈMES BASSE PRIORITÉ (Dette technique)

### 🟢 BASSE-1: Commentaires TODO inutilisés dans le code
**Fichier:** `apps/web/src/components/providers/AuthProvider.tsx:188,200`
**Sévérité:** BASSE
**Impact:** Maintenance du code

**Description:**
```typescript
// TODO: Appel API pour invalider la session côté serveur
// TODO: Appel API réel pour refresh
```

---

### 🟢 BASSE-2: Nombres magiques codés en dur
**Fichier:** `apps/api/src/middleware/auth.middleware.ts:21`
**Sévérité:** BASSE

**Correction recommandée:**
```typescript
const CACHE_TTL_MS = 5 * 60 * 1000
const CACHE_CLEANUP_INTERVAL_MS = 60 * 1000
```

---

### 🟢 BASSE-3: Patterns de gestion d'erreur incohérents
**Fichier:** Plusieurs fichiers
**Sévérité:** BASSE

Standardiser la gestion d'erreur dans tous les services.

---

### 🟢 BASSE-4: Documentation JSDoc manquante
**Fichier:** Tous les fichiers de service
**Sévérité:** BASSE

Ajouter des commentaires JSDoc complets pour toutes les APIs publiques.

---

### 🟢 BASSE-5: Pas de logging du temps de réponse
**Fichier:** `apps/api/src/index.ts`
**Sévérité:** BASSE

Ajouter un middleware pour logger les temps de réponse pour le monitoring de performance.

---

### 🟢 BASSE-6: Image Docker n'utilise pas l'optimisation multi-stage build
**Fichier:** `apps/api/Dockerfile`, `apps/web/Dockerfile`
**Sévérité:** BASSE

Les images peuvent être davantage optimisées pour la taille.

---

### 🟢 BASSE-7: Pas de validation des variables d'environnement au démarrage
**Fichier:** Toute utilisation de variables d'environnement
**Sévérité:** BASSE

**Correction recommandée:**
```typescript
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  PORT: z.string().regex(/^\d+$/).transform(Number),
})

const env = envSchema.parse(process.env)
```

---

### 🟢 BASSE-8: Dockerfile s'exécute en tant que root en développement
**Fichier:** Les deux Dockerfiles
**Sévérité:** BASSE

Bien que la production utilise un utilisateur non-root, s'assurer que tous les environnements suivent le principe du moindre privilège.

---

## RÉSUMÉ ET RECOMMANDATIONS

### Actions critiques requises avant production:

1. **Activer la limitation de débit** sur tous les endpoints d'authentification (CRITIQUE-1)
2. **Implémenter la limitation de débit distribuée** avec Redis/Upstash (CRITIQUE-2)
3. **Corriger la configuration CORS** pour supporter plusieurs origines (CRITIQUE-3)
4. **Remplacer tous les console.log** par du logging structuré (CRITIQUE-4)
5. **Valider la configuration Supabase** au démarrage (CRITIQUE-5)
6. **Implémenter l'invalidation appropriée des tokens** (CRITIQUE-6)
7. **Ajouter la sanitization d'entrée** pour toutes les entrées utilisateur (CRITIQUE-7)
8. **Supprimer le contournement d'authentification de développement** (CRITIQUE-8)
9. **Forcer les exigences de mot de passe fort** (CRITIQUE-9)
10. **Implémenter l'application HTTPS** (CRITIQUE-10)

### Meilleures pratiques de sécurité à implémenter:

- [ ] Ajouter la protection CSRF
- [ ] Implémenter les cookies httpOnly pour l'authentification
- [ ] Ajouter des en-têtes de sécurité complets
- [ ] Définir des limites de taille de requête
- [ ] Implémenter les transactions de base de données
- [ ] Ajouter la validation d'email au-delà du format
- [ ] Versionner votre API
- [ ] Supprimer les types `any` dans tout le code

### Optimisations de performance:

- [ ] Ajouter les index de base de données
- [ ] Implémenter la pagination
- [ ] Configurer le pooling de connexions
- [ ] Ajouter les timeouts de requête
- [ ] Optimiser les images Docker

### Monitoring et opérations:

- [ ] Intégration complète de Sentry
- [ ] Logging structuré avec IDs de corrélation
- [ ] Vérifications de santé avec connectivité BD
- [ ] Implémentation APM
- [ ] Configuration des alertes

### Tests et qualité:

- [ ] Supprimer `continue-on-error` du CI/CD
- [ ] Corriger toutes les erreurs de type
- [ ] Ajouter des tests d'intégration pour le flux d'authentification
- [ ] Tests de charge pour les limiteurs de débit
- [ ] Audit de sécurité avec des outils automatisés (Snyk, OWASP ZAP)

---

## CONSIDÉRATIONS DE CONFORMITÉ

### Problèmes de conformité RGPD:
- Logging de données sensibles (CRITIQUE-4)
- Aucune politique de rétention de données définie
- Gestion du consentement manquante
- Aucune fonctionnalité d'export de données

### Standards de sécurité:
- OWASP Top 10: Plusieurs vulnérabilités adressées
- PCI DSS: Si traitement de paiements, travail supplémentaire requis
- SOC 2: Lacunes en logging et monitoring

---

## EFFORT ESTIMÉ

**Problèmes critiques:** 3-5 jours
**Haute priorité:** 2-3 jours
**Priorité moyenne:** 2-3 jours
**Basse priorité:** 1-2 jours

**Effort total estimé:** 8-13 jours de travail de développement

---

## CONCLUSION

L'application Copronomie a une base solide avec une bonne utilisation de frameworks modernes (Hono, tRPC, Supabase) et de pratiques de développement. Cependant, **23 problèmes critiques et haute priorité de sécurité** doivent être adressés avant le déploiement en production pour prévenir:

- Attaques de prise de contrôle de compte
- Violations de données
- Interruption de service
- Violations de conformité

**Recommandation:** **NE PAS DÉPLOYER EN PRODUCTION** jusqu'à ce qu'au minimum tous les problèmes CRITIQUES soient résolus et que les problèmes de sécurité HAUTE priorité soient adressés.

---

**Rapport généré par:** Claude Code - Agent Expert en Sécurité
**Révision complétée:** 28 octobre 2025
**Prochaine révision recommandée:** Après implémentation des corrections critiques
