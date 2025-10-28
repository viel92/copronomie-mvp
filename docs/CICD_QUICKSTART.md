# CI/CD Pipeline - Guide de Démarrage Rapide

## Vue d'ensemble

Le pipeline CI/CD automatise les tests, builds, et déploiements sur le VPS staging à chaque push sur `master`.

### Workflow Complet

```
Push vers master
    │
    ├── 1. Tests & Build (Ubuntu)
    │   ├── Install dependencies
    │   ├── Lint code (continue-on-error)
    │   ├── Type check
    │   ├── Build API
    │   ├── Build Web
    │   ├── Run E2E Tests (continue-on-error)
    │   └── Upload Playwright Report
    │
    ├── 2. Build & Push Docker Images
    │   ├── Login to GitHub Container Registry
    │   ├── Build Web image
    │   ├── Build API image
    │   └── Push to ghcr.io
    │
    ├── 3. Deploy to Staging VPS
    │   ├── SSH to VPS (46.62.158.59)
    │   ├── Pull latest code
    │   ├── Pull Docker images
    │   ├── Update docker-compose.yml
    │   ├── Restart containers
    │   └── Health checks
    │
    └── 4. Notify Results
        └── Success/Failure message
```

---

## Déclenchement du Pipeline

### Automatique
- **Push sur `master`**: Déclenche tout le pipeline
- **Pull Request vers `master`**: Tests & Build uniquement (pas de déploiement)

### Manuel
Via l'interface GitHub Actions:
1. Allez dans **Actions** tab
2. Sélectionnez **CI/CD Pipeline**
3. Cliquez sur **Run workflow**

---

## Temps d'Exécution Estimé

| Étape | Durée estimée |
|-------|---------------|
| Tests & Build | ~5-7 minutes |
| Build & Push Docker | ~8-10 minutes |
| Deploy to Staging | ~2-3 minutes |
| **TOTAL** | **~15-20 minutes** |

---

## Visualisation des Résultats

### 1. Dans l'onglet Actions
```
✅ CI/CD Pipeline #42
   ├── ✅ Tests & Build (5m 23s)
   ├── ✅ Build & Push Docker Images (9m 12s)
   ├── ✅ Deploy to Staging VPS (2m 45s)
   └── ✅ Notify Deployment (5s)
```

### 2. Playwright Reports
- Automatiquement uploadés comme artifacts
- Rétention: 7 jours
- Téléchargeables depuis l'onglet **Actions** > **Run** > **Artifacts**

### 3. Logs Détaillés
Chaque step affiche des logs détaillés:
- Output de pnpm install
- Résultats des tests
- Build output
- Logs Docker
- Health check results

---

## Que se Passe-t-il sur le VPS ?

### Lors d'un Déploiement

```bash
# 1. Navigation vers le répertoire app
cd /home/copronomie/copronomie-mvp

# 2. Pull du code
git pull origin master

# 3. Login Docker + Pull images
docker pull ghcr.io/OWNER/REPO-web:latest
docker pull ghcr.io/OWNER/REPO-api:latest

# 4. Mise à jour docker-compose.yml
# Remplace les images locales par celles de GitHub Registry

# 5. Restart des conteneurs
docker compose down
docker compose up -d --force-recreate

# 6. Attente + Health Checks
sleep 30
curl -f http://localhost:3000
curl -f http://localhost:4000/health

# 7. Nettoyage
docker image prune -f
```

### Logs VPS
Vous pouvez suivre en temps réel:
```bash
# Sur le VPS
tail -f /var/log/syslog | grep docker
docker logs -f copronomie-mvp-web-1
docker logs -f copronomie-mvp-api-1
```

---

## Gestion des Échecs

### Si Tests Échouent
- **Lint**: Continue (continue-on-error: true)
- **E2E Tests**: Continue (continue-on-error: true)
- **Type Check**: Bloque le build ❌
- **Build API/Web**: Bloque le build ❌

### Si Build Docker Échoue
- Le déploiement ne se fait PAS
- Les images précédentes restent en place
- Notification d'échec envoyée

### Si Déploiement Échoue
- **Rollback automatique**: Non (à implémenter avec le script existant)
- Les conteneurs précédents peuvent être down
- **Action manuelle requise**:
  ```bash
  # SSH vers le VPS
  ssh copronomie@46.62.158.59
  cd /home/copronomie/copronomie-mvp
  ./deploy-staging.sh  # Utilise le script avec rollback
  ```

---

## Améliorer le Pipeline (TODO)

### Court Terme
- [ ] Ajouter rollback automatique dans GitHub Actions
- [ ] Slack/Discord notifications (via webhooks)
- [ ] Badge de build dans README.md
- [ ] Cache pour tests E2E (navigateurs Playwright)

### Moyen Terme
- [ ] Environment `production` avec protection rules
- [ ] Tests de charge (k6 ou Artillery)
- [ ] Analyse de sécurité (Snyk, Trivy)
- [ ] Lighthouse CI pour performance

### Long Terme
- [ ] Multi-stage deployments (canary, blue-green)
- [ ] Monitoring intégré (Prometheus + Grafana)
- [ ] Auto-scaling basé sur métriques
- [ ] Disaster recovery automatique

---

## Commandes Utiles

### Localement

```bash
# Tester les scripts du workflow localement
pnpm install
pnpm run lint
pnpm run type-check
pnpm --filter @copronomie/api build
pnpm --filter @copronomie/web build
pnpm run test:e2e

# Build Docker images localement
docker build -f apps/web/Dockerfile -t copronomie-web .
docker build -f apps/api/Dockerfile -t copronomie-api .
```

### Sur GitHub

```bash
# Voir les runs récents
gh run list --workflow=ci-cd.yml

# Voir les logs du dernier run
gh run view --log

# Re-run un workflow échoué
gh run rerun <run-id>

# Télécharger artifacts
gh run download <run-id>
```

### Sur le VPS

```bash
# Status des conteneurs
docker ps
docker compose ps

# Logs en temps réel
docker compose logs -f

# Restart manuel
docker compose restart

# Full rebuild
docker compose down
docker compose up -d --build
```

---

## FAQ

### Q: Puis-je désactiver les tests E2E ?
**R**: Oui, commentez les lignes 66-83 dans `.github/workflows/ci-cd.yml`

### Q: Comment déployer sur production ?
**R**: Créez une branche `production` et un environnement GitHub `production` avec les secrets appropriés.

### Q: Le déploiement prend trop de temps
**R**:
- Activez Docker layer caching (déjà fait)
- Utilisez `pnpm store` cache (déjà fait)
- Réduisez les dependencies si possible

### Q: Comment tester le workflow sans déployer ?
**R**: Créez une branche `develop` et poussez dessus. Le workflow testera mais ne déploiera pas.

---

## Monitoring Post-Déploiement

### Vérifications Automatiques
- ✅ Health check API: `https://staging-api.copronomie.fr/health`
- ✅ Health check Web: `https://staging-app.copronomie.fr`

### Vérifications Manuelles (recommandées)
1. **Tester le workflow complet**:
   - Inscription utilisateur
   - Création copropriété
   - Création projet
   - Soumission devis

2. **Vérifier Sentry**:
   - Dashboard Sentry pour erreurs récentes
   - Session replays si erreurs critiques

3. **Vérifier Logs**:
   ```bash
   # Sur le VPS
   docker logs copronomie-mvp-api-1 --tail 100
   docker logs copronomie-mvp-web-1 --tail 100
   ```

---

## Support

**Problème avec le CI/CD ?**
1. Vérifiez les logs dans l'onglet Actions
2. Vérifiez les secrets GitHub (Settings > Secrets)
3. Testez la connexion SSH manuellement
4. Consultez les logs Docker sur le VPS

**Besoin d'aide ?**
- Documentation: `/docs/GITHUB_SECRETS_SETUP.md`
- Logs: Tab **Actions** sur GitHub
- VPS: SSH vers `46.62.158.59`

---

**Dernière mise à jour**: 28 octobre 2025
