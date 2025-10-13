# Changelog - 12 Octobre 2025

## Preparation Deploiement 2 VPS - COMPLETE

### Travaux Realises Aujourd'hui

#### 1. Architecture 2 VPS Definie
- **VPS 1 - STAGING:** Environnement de test pour beta testers
  - Domaines: `staging-app.copronomie.fr` + `staging-api.copronomie.fr`
  - Usage: Tests features, validation avant production
  - Supabase: Projet separe `copronomie-staging`

- **VPS 2 - PRODUCTION:** Environnement stable pour clients payants
  - Domaines: `app.copronomie.fr` + `api.copronomie.fr`
  - Usage: Vrais utilisateurs, zero tolerance bugs
  - Supabase: Projet separe `copronomie-production`

#### 2. Guides de Deploiement Crees

**Nouveaux fichiers:**
- `DEPLOYMENT_2VPS_STRATEGY.md` (1500 lignes)
  - Strategie complete 2 environnements
  - Workflow developpement
  - Configuration DNS
  - Gestion secrets
  - FAQ complete

- `QUICK_START_DEPLOYMENT.md` (800 lignes)
  - Guide pas a pas demarrage rapide
  - Checklist complete
  - Timeline jour par jour
  - Troubleshooting

- `DEPLOIEMENT_README.md` (250 lignes)
  - Resume executif
  - Actions requises
  - Prochaines etapes

**Fichier existant ameliore:**
- `DEPLOYMENT_VPS.md` (deja existant - 710 lignes)
  - Guide technique detaille setup VPS

#### 3. Variables d'Environnement Preparees

**Fichiers crees (NON versionnes - .gitignore):**
- `apps/api/.env.staging`
  - Configuration API pour VPS 1
  - Rate limiting permissif (tests)
  - Log level: debug

- `apps/web/.env.staging`
  - Configuration Frontend pour VPS 1
  - API URL: staging-api.copronomie.fr

- `apps/api/.env.production`
  - Configuration API pour VPS 2
  - Rate limiting strict
  - Log level: info

- `apps/web/.env.production`
  - Configuration Frontend pour VPS 2
  - API URL: api.copronomie.fr

**Important:** Ces fichiers contiennent des placeholders. A completer avec:
- URLs Supabase reelles (2 projets)
- Cles API Supabase (anon + service role)
- Cle API Resend (optionnel pour MVP)

#### 4. Scripts de Deploiement Automatises

**Fichiers crees:**
- `scripts/deploy-staging.sh`
  - Deploiement automatique VPS 1
  - Pull code → Build → Restart
  - Logs et verification

- `scripts/deploy-production.sh`
  - Deploiement automatique VPS 2
  - Gestion versions Git (tags)
  - Confirmation obligatoire

**Usage apres premier deploiement:**
```bash
chmod +x scripts/deploy-*.sh

# Deployer sur staging
./scripts/deploy-staging.sh

# Deployer sur production (avec tag)
git tag v1.0.1
git push origin v1.0.1
./scripts/deploy-production.sh  # Entrer: v1.0.1
```

**Note:** Editer les scripts pour renseigner les IPs VPS (lignes 11 et 13).

---

## Etat Actuel du Projet

### Infrastructure Preparee
- Docker Compose configure (existant)
- Dockerfiles optimises multi-stage (api + web) (existant)
- Guides deploiement complets (nouveaux)
- Variables environnement preparees (nouveaux)
- Scripts automatisation (nouveaux)

### Reste a Faire (Actions Utilisateur)

#### Prerequis Deploiement (1h)
1. **Creer 2 Projets Supabase:**
   - `copronomie-staging`
   - `copronomie-production`
   - Appliquer schema SQL sur les 2

2. **Configurer DNS (4 sous-domaines):**
   - `staging-app.copronomie.fr` → IP_VPS_1
   - `staging-api.copronomie.fr` → IP_VPS_1
   - `app.copronomie.fr` → IP_VPS_2
   - `api.copronomie.fr` → IP_VPS_2

3. **Completer fichiers .env:**
   - `apps/api/.env.staging`
   - `apps/web/.env.staging`
   - `apps/api/.env.production`
   - `apps/web/.env.production`
   - Remplacer placeholders par vraies valeurs

#### Deploiement VPS 1 - STAGING (2-3h)
1. Suivre `DEPLOYMENT_VPS.md` ou `QUICK_START_DEPLOYMENT.md`
2. Setup VPS (Docker, Nginx, SSL)
3. Build et demarrage conteneurs
4. Tests workflow complet

#### Deploiement VPS 2 - PRODUCTION (1-2h)
1. Repeter memes etapes que VPS 1
2. Utiliser fichiers `.env.production`
3. Tests plus stricts
4. Setup monitoring Sentry

#### Post-Deploiement (1h)
1. Configurer Sentry (monitoring erreurs)
2. UptimeRobot (alertes downtime)
3. Backup automatiques
4. Documentation utilisateur

---

## Timeline Deploiement

| Date | Tache | Duree | Status |
|------|-------|-------|--------|
| **12 Oct** | Preparation .env + guides | 2h | ✅ FAIT |
| **13 Oct** | Prerequis (Supabase + DNS) | 1h | ⏳ A faire |
| **13 Oct** | Setup VPS 1 (STAGING) | 2-3h | ⏳ A faire |
| **14 Oct** | Setup VPS 2 (PRODUCTION) | 1-2h | ⏳ A faire |
| **14 Oct** | Monitoring + Scripts | 1h | ⏳ A faire |
| **15-21 Oct** | Beta testers sur STAGING | - | ⏳ A faire |
| **22 Oct** | Lancement PRODUCTION v1.0 | - | ⏳ A faire |

**Total estime:** 4-6 heures de deploiement (hors beta testing)

---

## Fichiers du Projet

### Structure Deploiement
```
copronomie-v2/
├── DEPLOYMENT_VPS.md              (Existant - Guide technique)
├── DEPLOYMENT_2VPS_STRATEGY.md    (Nouveau - Strategie 2 VPS)
├── QUICK_START_DEPLOYMENT.md      (Nouveau - Guide rapide)
├── DEPLOIEMENT_README.md          (Nouveau - Resume executif)
├── CHANGELOG_12_OCT.md            (Nouveau - Ce fichier)
├── docker-compose.yml             (Existant)
├── apps/
│   ├── api/
│   │   ├── Dockerfile             (Existant)
│   │   ├── .env.staging           (Nouveau - NON versionne)
│   │   ├── .env.production        (Nouveau - NON versionne)
│   │   └── .env.example           (Existant)
│   └── web/
│       ├── Dockerfile             (Existant)
│       ├── .env.staging           (Nouveau - NON versionne)
│       ├── .env.production        (Nouveau - NON versionne)
│       └── .env.example           (Existant)
└── scripts/
    ├── deploy-staging.sh          (Nouveau)
    └── deploy-production.sh       (Nouveau)
```

### Fichiers .env (NON versionnes)
Ces fichiers sont proteges par `.gitignore` (ligne 12: `**/.env*`).
Ils doivent etre copies manuellement sur les VPS lors du setup initial.

---

## Avantages de cette Architecture

### Separation des Environnements
- **Isolation:** Bugs staging n'impactent pas production
- **Tests:** Validation avec beta testers avant release
- **Seed data:** Projets demo sur staging uniquement
- **Deployments:** 5-10x/jour staging, 1-2x/semaine prod

### Securite
- 2 projets Supabase separes (isolation DB totale)
- Variables env differentes (staging vs prod)
- Rate limiting adapte (permissif staging, strict prod)
- Logs detailles staging (debug) vs info production

### Economie
- **Cout total:** 10 EUR/mois (VPS 1: 4 EUR + VPS 2: 6 EUR)
- **vs Vercel + Railway:** 20-30 EUR/mois
- **Economies:** 50-60%

---

## Prochaines Actions (Par Ordre)

### Action 1: Creer Projets Supabase (15min)
```
1. Aller sur https://supabase.com
2. Creer projet: copronomie-staging
3. Creer projet: copronomie-production
4. Noter URLs + cles API (anon + service role)
5. Appliquer schema SQL sur les 2 projets
```

### Action 2: Configurer DNS (10min)
```
Chez votre registrar (OVH, Gandi, Cloudflare):
- staging-app.copronomie.fr  →  IP_VPS_1 (Type A)
- staging-api.copronomie.fr  →  IP_VPS_1 (Type A)
- app.copronomie.fr          →  IP_VPS_2 (Type A)
- api.copronomie.fr          →  IP_VPS_2 (Type A)

Attendre 5-10min pour propagation DNS.
```

### Action 3: Completer fichiers .env (10min)
```bash
# Editer chaque fichier
nano apps/api/.env.staging
nano apps/web/.env.staging
nano apps/api/.env.production
nano apps/web/.env.production

# Remplacer:
- your-staging-project.supabase.co → URL reelle
- your-staging-anon-key → Cle anon reelle
- your-staging-service-role-key → Service role key reelle
- re_your_resend_api_key → Cle Resend (ou laisser placeholder)
```

### Action 4: Deployer VPS 1 (2-3h)
```
Ouvrir: QUICK_START_DEPLOYMENT.md
Suivre: Section "Etape 2: Deploiement VPS 1"
Reference complete: DEPLOYMENT_VPS.md
```

### Action 5: Deployer VPS 2 (1-2h)
```
Repeter etapes VPS 1 avec .env.production
```

### Action 6: Monitoring (30min)
```
1. Creer compte Sentry (sentry.io)
2. Ajouter DSN dans .env.production
3. Rebuild production
```

---

## Support et Documentation

### Si vous etes bloque:

**Lire dans cet ordre:**
1. `DEPLOIEMENT_README.md` (resume)
2. `QUICK_START_DEPLOYMENT.md` (pas a pas)
3. `DEPLOYMENT_2VPS_STRATEGY.md` (strategie complete)
4. `DEPLOYMENT_VPS.md` (technique detaille)

**Problemes frequents:**
- Voir section Troubleshooting dans `QUICK_START_DEPLOYMENT.md`
- Voir FAQ dans `DEPLOYMENT_2VPS_STRATEGY.md`

**Commandes utiles:**
```bash
# Logs
docker compose logs -f

# Restart
docker compose restart

# Status
docker compose ps
```

---

## Metriques de Succes

### Deploiement reussi si:
- [ ] `curl https://staging-api.copronomie.fr/health` retourne 200
- [ ] `https://staging-app.copronomie.fr` charge sans erreurs
- [ ] Workflow complet fonctionne (syndic → company → devis)
- [ ] Emails notifications recus (si Resend configure)
- [ ] Meme chose sur production (app.copronomie.fr)

### Beta MVP reussi si (Semaine 3):
- [ ] 3-5 beta testers actifs sur staging
- [ ] 10+ projets crees par testeurs
- [ ] 15+ devis soumis
- [ ] Feedback collecte (interviews 30min)
- [ ] 0 bugs critiques identifies

---

## Conclusion

**Preparation deploiement:** ✅ COMPLETE

**Prochaine etape:** Creer projets Supabase + Configurer DNS

**Estimation temps total:** 4-6 heures (staging + production + monitoring)

**Objectif:** MVP beta accessible fin Semaine 3 (19 Octobre 2025)

Tous les outils et guides sont prets. Il ne reste plus qu'a executer!

---

**Date:** 12 Octobre 2025
**Temps investi aujourd'hui:** ~2h (preparation guides + .env + scripts)
**Temps restant estime:** 4-6h (deploiement effectif)
