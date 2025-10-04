# Debug E2E Tests - Création de Copropriété

## Modifications effectuées

### 1. Fix du démarrage de l'API
**Fichier**: `apps/api/src/index.ts:81-90`

Problème: Les logs indiquaient que le serveur était prêt avant qu'il ne le soit réellement.

Solution: Utilisation du callback de `serve()` pour logger uniquement quand le serveur écoute.

### 2. GlobalSetup Playwright
**Fichier**: `tests/global-setup.ts`

Ajout d'un setup qui attend que l'API (port 4000) soit prête avant de lancer les tests.

**Fichier**: `playwright.config.ts:10`

Ajout de `globalSetup: './tests/global-setup.ts'`

### 3. Amélioration du test E2E
**Fichier**: `tests/e2e/full-workflow.spec.ts:42-46`

Ajout d'attentes explicites pour le tab "Saisie Manuelle":
- Wait pour le sélecteur "Saisie Manuelle"
- Click sur le tab
- Wait pour que le formulaire soit visible

### 4. Test de debug créé
**Fichier**: `tests/e2e/condo-creation.spec.ts`

Test isolé pour débugger uniquement la création de copropriété.

## Problème actuel

### Symptôme
La création de copropriété échoue avec un toast d'erreur "1 error" visible. La page reste sur `/syndic/condos/new`.

### Hypothèse
Le `protectedProcedure` tRPC rejette la requête car:
- `ctx.user` est `undefined`
- Le token n'est pas correctement transmis depuis le frontend

### Architecture de l'authentification

```
[FRONTEND]
1. Inscription via /api/auth/register (REST)
2. Login automatique qui retourne { session, user }
3. AuthProvider sauvegarde dans localStorage:
   - copronomie_session { access_token, refresh_token, expires_at }
   - copronomie_user { id, email, role }

[TRPC CLIENT]
4. trpc-client.ts lit copronomie_session
5. Envoie Authorization: Bearer {access_token}

[BACKEND]
6. optionalAuth middleware valide le token avec Supabase
7. Récupère user.user_metadata.role
8. Stocke dans c.set('user', authUser)
9. createContext récupère c.get('user')
10. protectedProcedure vérifie ctx.user existe
11. condo.router vérifie ctx.user.role === 'syndic'
```

### Points de vérification nécessaires

1. **Vérifier que le token est bien sauvegardé après inscription**
   ```javascript
   // Dans le test, après inscription:
   const localStorage = await page.evaluate(() => ({
     session: window.localStorage.getItem('copronomie_session'),
     user: window.localStorage.getItem('copronomie_user')
   }))
   console.log('Session:', localStorage)
   ```

2. **Vérifier que le role est bien 'syndic'**
   ```javascript
   // Dans AuthProvider après login:
   console.log('User metadata:', result.user.user_metadata)
   ```

3. **Vérifier les logs API lors de la requête tRPC**
   - Le middleware `optionalAuth` devrait logger
   - Le `protectedProcedure` devrait throw si pas d'user

## Prochaines étapes

### Option A: Ajouter plus de logs
1. Logger localStorage dans le test
2. Logger les headers tRPC envoyés
3. Logger l'user dans optionalAuth middleware
4. Logger ctx.user dans protectedProcedure

### Option B: Vérifier Supabase
1. Vérifier que user_metadata.role est bien défini après inscription
2. Vérifier les RLS policies sur la table `condos`
3. Tester manuellement la création via l'UI

### Option C: Simplifier pour debug
Temporairement utiliser `devProcedure` au lieu de `protectedProcedure` dans le router pour bypasser l'auth et vérifier si c'est bien un problème d'authentification.

## Commandes utiles

```bash
# Lancer le test de debug
pnpm test:e2e tests/e2e/condo-creation.spec.ts

# Voir les logs de l'API
# (dans un autre terminal)
cd apps/api && pnpm dev

# Vérifier le HTML report
# Après le test, ouvrir le lien fourni dans la console
```

## Fichiers clés

- `apps/api/src/trpc/routers/condo.router.ts:21-48` - Router de création
- `apps/api/src/services/condo.service.ts:74-83` - Service de création
- `apps/api/src/middleware/auth.middleware.ts:132-172` - Middleware optionalAuth
- `apps/api/src/trpc/trpc.ts:9-18` - protectedProcedure
- `apps/web/src/lib/trpc-client.ts:8-36` - Headers tRPC
- `apps/web/src/components/providers/AuthProvider.tsx` - Gestion session
