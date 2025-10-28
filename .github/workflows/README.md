# GitHub Actions Workflows

Ce dossier contient les workflows GitHub Actions pour l'automatisation CI/CD de Copronomie.

## Workflows Disponibles

### 1. `ci-cd.yml` - Pipeline CI/CD Principal

**Déclenchement**:
- Push sur `master` → Exécution complète (tests + build + déploiement)
- Push sur `develop` → Tests et build uniquement
- Pull Request vers `master` → Tests et build uniquement

**Jobs**:
1. **test-and-build**: Tests, linting, build (Ubuntu, ~5-7 min)
2. **build-and-push**: Build et push images Docker vers GHCR (~8-10 min)
3. **deploy-staging**: Déploiement SSH vers VPS staging (~2-3 min)
4. **notify**: Notification des résultats

**Temps Total**: ~15-20 minutes

**Secrets Requis**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STAGING_VPS_HOST`
- `STAGING_VPS_USER`
- `STAGING_VPS_SSH_KEY`

Voir `docs/GITHUB_SECRETS_SETUP.md` pour la configuration.

---

## Structure du Pipeline

```
┌─────────────────────────────────────────────────┐
│  Push to master                                  │
└─────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│  Job 1: test-and-build (Ubuntu)                 │
│  ├─ Install dependencies (pnpm)                 │
│  ├─ Lint code (continue-on-error)               │
│  ├─ Type check (blocking)                       │
│  ├─ Build API                                   │
│  ├─ Build Web                                   │
│  ├─ Install Playwright browsers                 │
│  ├─ Run E2E Tests (continue-on-error)           │
│  └─ Upload Playwright Report (artifact)         │
└─────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│  Job 2: build-and-push (Ubuntu)                 │
│  ├─ Login to GitHub Container Registry          │
│  ├─ Build Docker image: Web                     │
│  ├─ Build Docker image: API                     │
│  ├─ Push to ghcr.io/OWNER/REPO-web:latest       │
│  └─ Push to ghcr.io/OWNER/REPO-api:latest       │
└─────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│  Job 3: deploy-staging (Ubuntu)                 │
│  ├─ SSH to VPS (46.62.158.59)                   │
│  ├─ Git pull origin master                      │
│  ├─ Docker pull latest images                   │
│  ├─ Update docker-compose.yml                   │
│  ├─ Docker compose down                         │
│  ├─ Docker compose up -d --force-recreate       │
│  ├─ Health checks (local + HTTPS)               │
│  └─ Docker image prune                          │
└─────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│  Job 4: notify                                   │
│  └─ Display success/failure message             │
└─────────────────────────────────────────────────┘
```

---

## Gestion des Échecs

### Tests qui Bloquent le Build
- ❌ **Type Check** échoue → Build arrêté
- ❌ **Build API** échoue → Build arrêté
- ❌ **Build Web** échoue → Build arrêté

### Tests qui N'Empêchent PAS le Build
- ⚠️ **Lint** échoue → Continue (continue-on-error: true)
- ⚠️ **E2E Tests** échouent → Continue (continue-on-error: true)

**Raison**: Les tests E2E sont fragiles et en cours d'amélioration.

---

## Artéfacts Générés

### Playwright Test Reports
- **Nom**: `playwright-report`
- **Rétention**: 7 jours
- **Accès**: Actions tab > Run > Artifacts section
- **Contenu**: HTML report des tests E2E

---

## Environnements

### Staging
- **Branches**: `master`, `develop`
- **VPS**: 46.62.158.59
- **URLs**:
  - Frontend: https://staging-app.copronomie.fr
  - API: https://staging-api.copronomie.fr
- **Auto-deploy**: Oui (sur push master)

### Production
- **Configuration**: À créer
- **Recommandation**: Créer environment GitHub avec protection rules
- **Déploiement**: Manuel ou via branche `production`

---

## Ajouter un Nouveau Workflow

### 1. Créer le fichier

```yaml
# .github/workflows/my-workflow.yml
name: My Workflow

on:
  push:
    branches: [master]

jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run something
        run: echo "Hello"
```

### 2. Tester localement (optionnel)

Utilisez [act](https://github.com/nektos/act) pour tester localement:

```bash
# Installer act
# Windows: choco install act-cli
# Mac: brew install act

# Tester le workflow
act -W .github/workflows/my-workflow.yml
```

### 3. Commit et push

```bash
git add .github/workflows/my-workflow.yml
git commit -m "feat: Add my-workflow"
git push origin master
```

---

## Workflows Suggérés (TODO)

### Security Scanning
```yaml
name: Security Scan
on:
  schedule:
    - cron: '0 2 * * *'  # Tous les jours à 2h
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### Dependency Updates
```yaml
name: Update Dependencies
on:
  schedule:
    - cron: '0 0 * * 1'  # Tous les lundis
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm update --latest
      - uses: peter-evans/create-pull-request@v5
        with:
          title: "chore: Update dependencies"
```

### Lighthouse CI
```yaml
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://staging-app.copronomie.fr
          uploadArtifacts: true
```

---

## Debugging

### Visualiser les Logs
```bash
# Via GitHub CLI
gh run list --workflow=ci-cd.yml
gh run view --log <run-id>

# Ou dans l'UI GitHub: Actions tab > Select run > View logs
```

### Re-run un Workflow Échoué
```bash
# Via CLI
gh run rerun <run-id>

# Ou dans l'UI: Actions > Select run > Re-run jobs
```

### Activer Debug Logging
Ajoutez ces secrets (repository level):
- `ACTIONS_STEP_DEBUG`: `true`
- `ACTIONS_RUNNER_DEBUG`: `true`

Les logs seront plus verbeux.

---

## Best Practices

### ✅ DO
- Utiliser `continue-on-error` pour tests non-bloquants
- Cacher les dépendances (pnpm store, Docker layers)
- Upload artifacts pour debugger
- Utiliser environments pour secrets staging vs prod
- Versioning des actions: `@v4` pas `@latest`

### ❌ DON'T
- Hardcoder secrets dans le workflow
- Exécuter npm install sans lock file
- Lancer builds longs sur chaque PR (utiliser filters)
- Ignorer les échecs de build

---

## Ressources

- **Documentation Complète**: `docs/CICD_QUICKSTART.md`
- **Configuration Secrets**: `docs/GITHUB_SECRETS_SETUP.md`
- **Guide de Démarrage**: `NEXT_STEPS_CICD.md`
- **GitHub Actions Docs**: https://docs.github.com/en/actions

---

**Dernière mise à jour**: 28 octobre 2025
