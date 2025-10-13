# Guide d'Automatisation du Déploiement

## Vue d'ensemble

Le script `deploy-staging.sh` automatise le déploiement complet de l'application Copronomie sur le VPS staging avec des fonctionnalités de sécurité avancées :

- ✅ Tests de santé automatiques avec retry
- ✅ Rollback automatique en cas d'échec
- ✅ Logs détaillés timestampés
- ✅ Tracking Git des déploiements
- ✅ Nettoyage automatique des ressources

## Utilisation

### Déploiement Standard

```bash
ssh copronomie@46.62.158.59
cd ~/copronomie-mvp
./deploy-staging.sh
```

Le script effectuera automatiquement :
1. Pull des dernières modifications Git
2. Backup de la configuration actuelle
3. Build des images Docker (API + Web)
4. Redémarrage des conteneurs
5. Health checks avec 5 tentatives par service
6. Vérification HTTPS des endpoints publics
7. Nettoyage des anciennes images Docker

### Logs de Déploiement

Chaque déploiement crée un fichier de log timestampé :

```bash
# Consulter le dernier déploiement
ls -lt deploy-*.log | head -1
cat deploy-20251013-193917.log

# Voir tous les déploiements
ls deploy-*.log
```

### En cas d'Échec

Le script effectue automatiquement un **rollback** si une étape échoue :

1. Détection de l'erreur via `trap ERR`
2. Message d'erreur explicite affiché
3. Restauration des conteneurs précédents
4. Les services restent opérationnels avec la version précédente

```bash
# Vérifier l'état après un rollback
docker ps
docker logs copronomie-mvp-api-1
docker logs copronomie-mvp-web-1
```

## Fonctionnalités Détaillées

### 1. Configuration

Le script utilise les variables suivantes (modifiables en tête du fichier) :

```bash
LOG_FILE="deploy-$(date +%Y%m%d-%H%M%S).log"  # Nom du fichier log
BACKUP_DIR="backups"                           # Dossier des backups
MAX_WAIT_TIME=60                               # Timeout build/start (secondes)
HEALTH_CHECK_RETRIES=5                         # Nombre de tentatives health check
```

### 2. Health Checks

Les health checks vérifient **4 endpoints** :

| Service | Endpoint Local | Endpoint Public |
|---------|---------------|-----------------|
| **Web** | http://localhost:3000 | https://staging-app.copronomie.fr |
| **API** | http://localhost:4000/health | https://staging-api.copronomie.fr/health |

Chaque endpoint est testé **5 fois** avec un intervalle de **5 secondes**.

Le déploiement échoue si un endpoint ne répond pas HTTP 200.

### 3. Rollback Automatique

Le mécanisme de rollback restaure :

- Les conteneurs Docker à leur état précédent
- La configuration docker-compose sauvegardée
- Les services restent accessibles pendant le rollback

**Scénarios déclenchant un rollback :**

- Échec du build Docker
- Échec du démarrage des conteneurs
- Health checks échouant après 5 tentatives
- Toute erreur shell (exit code != 0)

### 4. Tracking Git

Chaque déploiement enregistre dans les logs :

```
📊 Résumé:
  - Commit: ac6e4752d3ab6240db863b1058c144e2dcba6781
  - Branch: master
  - Date: 2025-10-13 19:39:37
```

Permet de tracer quel code a été déployé et quand.

### 5. Nettoyage Ressources

À la fin de chaque déploiement réussi :

```bash
docker image prune -f
```

Supprime les images Docker inutilisées pour économiser l'espace disque.

## Monitoring avec Sentry

### Vérifier que Sentry Fonctionne

#### Backend (API)

```bash
# Logs de démarrage devraient afficher :
docker logs copronomie-mvp-api-1 | grep Sentry
# ✅ Sentry initialized for production
```

#### Frontend (Web)

Les erreurs client sont automatiquement envoyées à Sentry.

Console Sentry : https://sentry.io/organizations/sekou/projects/copronomie-web/

### Tester Sentry avec une Erreur Volontaire

#### Méthode 1 : API Endpoint de Test

Créer un endpoint temporaire :

```typescript
// apps/api/src/index.ts
app.get('/test-sentry', (c) => {
  throw new Error('Test Sentry - Erreur volontaire API')
})
```

Puis :

```bash
curl https://staging-api.copronomie.fr/test-sentry
```

#### Méthode 2 : Console Navigateur

```javascript
// Dans la console du navigateur sur staging-app.copronomie.fr
throw new Error('Test Sentry - Erreur volontaire Frontend')
```

Les erreurs apparaîtront dans Sentry sous quelques secondes.

## Troubleshooting

### Problème : Build Échoue

**Symptômes :**
```
❌ Erreur durant le build Docker
Lancement du rollback...
```

**Solutions :**

1. Vérifier les logs Docker :
```bash
docker compose logs api
docker compose logs web
```

2. Vérifier les variables d'environnement :
```bash
cat apps/api/.env
cat apps/web/.env
```

3. Tester le build localement sur le VPS :
```bash
docker compose build api
docker compose build web
```

### Problème : Health Checks Échouent

**Symptômes :**
```
⚠️  API non prête (HTTP 000), attente 5s...
❌ API n'a pas répondu après 5 tentatives
```

**Solutions :**

1. Vérifier que les conteneurs sont démarrés :
```bash
docker ps
```

2. Vérifier les logs d'erreur :
```bash
docker logs copronomie-mvp-api-1 --tail 50
docker logs copronomie-mvp-web-1 --tail 50
```

3. Tester manuellement l'endpoint :
```bash
curl -I http://localhost:4000/health
curl -I http://localhost:3000
```

4. Vérifier que Nginx redirige correctement :
```bash
curl -I https://staging-api.copronomie.fr/health
sudo nginx -t
sudo systemctl status nginx
```

### Problème : Rollback Échoue

**Symptômes :**
```
❌ Échec du déploiement. Lancement du rollback...
Erreur durant le rollback
```

**Solutions :**

1. Redémarrer manuellement les conteneurs :
```bash
docker compose down
docker compose up -d
```

2. Vérifier l'état complet :
```bash
docker ps -a
docker compose ps
```

3. En dernier recours, rebuild complet :
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Problème : Sentry Ne Capture Pas les Erreurs

**Solutions :**

1. Vérifier les variables DSN :
```bash
# API
grep SENTRY_DSN apps/api/.env

# Web
grep NEXT_PUBLIC_SENTRY_DSN apps/web/.env
```

2. Vérifier les logs de démarrage :
```bash
docker logs copronomie-mvp-api-1 | grep -i sentry
docker logs copronomie-mvp-web-1 | grep -i sentry
```

3. Tester avec une erreur volontaire (voir section Monitoring)

4. Vérifier la console Sentry (peut prendre 1-2 minutes pour apparaître)

## Améliorer le Script

### Ajouter des Notifications

**Exemple : Notification Discord/Slack après déploiement**

```bash
# Ajouter à la fin du script (avant cleanup)
send_notification() {
    local WEBHOOK_URL="votre_webhook_url"
    local MESSAGE="✅ Déploiement staging réussi - Commit: $(git rev-parse --short HEAD)"

    curl -X POST "$WEBHOOK_URL" \
      -H "Content-Type: application/json" \
      -d "{\"content\": \"$MESSAGE\"}"
}

# Appeler dans la section succès
send_notification
```

### Ajouter des Métriques de Performance

```bash
# Mesurer le temps total
START_TIME=$(date +%s)

# ... script de déploiement ...

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
log_success "⏱️  Durée totale: ${DURATION}s"
```

### Backup Base de Données

```bash
backup_database() {
    log "Backup de la base de données..."

    # Exemple avec Supabase CLI ou pg_dump
    BACKUP_FILE="db-backup-$(date +%Y%m%d-%H%M%S).sql"

    # À adapter selon votre configuration Supabase
    # supabase db dump > "$BACKUP_DIR/$BACKUP_FILE"

    log_success "Base de données sauvegardée: $BACKUP_FILE"
}

# Appeler avant le déploiement
backup_database
```

## Script de Déploiement Production

Pour créer un script de déploiement production :

```bash
# Copier le script staging
cp deploy-staging.sh deploy-production.sh

# Modifier les URLs de health check
sed -i 's/staging-app/app/g' deploy-production.sh
sed -i 's/staging-api/api/g' deploy-production.sh
```

**Différences staging vs production :**

| Aspect | Staging | Production |
|--------|---------|------------|
| **URLs** | staging-app.copronomie.fr | app.copronomie.fr |
| **Health checks** | 5 tentatives | 10 tentatives |
| **Backup BDD** | Non (optionnel) | Oui (obligatoire) |
| **Notifications** | Non | Oui (Discord/Slack) |
| **Tests post-deploy** | Basiques | Complets (E2E) |

## Checklist Pré-Déploiement

Avant chaque déploiement, vérifier :

- [ ] Tous les tests passent localement (`pnpm test`)
- [ ] Build production fonctionne (`pnpm build`)
- [ ] Variables d'environnement à jour sur le VPS
- [ ] Commit poussé sur GitHub (`git push origin master`)
- [ ] Backup manuel de la BDD si changements critiques
- [ ] Monitoring Sentry opérationnel
- [ ] Espace disque suffisant sur le VPS (`df -h`)

## Commandes Utiles

```bash
# Voir l'état des conteneurs
docker ps

# Logs en temps réel
docker logs -f copronomie-mvp-api-1
docker logs -f copronomie-mvp-web-1

# Redémarrer un service spécifique
docker compose restart api
docker compose restart web

# Reconstruire sans cache
docker compose build --no-cache

# Nettoyer toutes les ressources Docker
docker system prune -a --volumes

# Vérifier l'utilisation disque
docker system df
df -h

# Vérifier les processus
ps aux | grep node
ps aux | grep docker

# Voir les logs Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Support

En cas de problème durant le déploiement :

1. **Consulter les logs** : `cat deploy-*.log`
2. **Vérifier l'état Docker** : `docker ps` et `docker logs`
3. **Tester manuellement** : `curl` des endpoints
4. **Rollback manuel** : `docker compose down && docker compose up -d`
5. **Contacter le support** : Partager le fichier de log complet

---

**Dernière mise à jour :** 13 Octobre 2025
**Version du script :** 1.0
**Auteur :** Copronomie DevOps Team
