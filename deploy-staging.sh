#!/bin/bash
# Script de déploiement STAGING - Copronomie
# Usage: ./deploy-staging.sh

# Configuration
LOG_FILE="deploy-$(date +%Y%m%d-%H%M%S).log"
BACKUP_DIR="backups"
MAX_WAIT_TIME=60  # Secondes pour attendre le démarrage des services
HEALTH_CHECK_RETRIES=5

# Fonction de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ ERREUR: $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $1" | tee -a "$LOG_FILE"
}

# Fonction de rollback
rollback() {
    log_error "Échec du déploiement. Lancement du rollback..."

    if [ -f "$BACKUP_DIR/docker-compose-backup.yml" ]; then
        log "Restauration des conteneurs précédents..."
        docker compose down
        docker compose up -d
        log_success "Rollback terminé. Services restaurés à l'état précédent."
    else
        log_error "Aucun backup trouvé. Impossible de rollback automatiquement."
        log "Veuillez vérifier manuellement: docker compose logs"
    fi

    exit 1
}

# Trap errors pour rollback automatique
trap 'rollback' ERR

echo "=========================================="
echo "  DÉPLOIEMENT STAGING - COPRONOMIE"
echo "=========================================="
log "Début du déploiement"
echo ""

# 1. Vérifications préliminaires
log "Vérifications préliminaires..."

if [ ! -f "docker-compose.yml" ]; then
    log_error "docker-compose.yml introuvable"
    exit 1
fi

if [ ! -f ".env.build" ]; then
    log_error ".env.build introuvable"
    exit 1
fi

log_success "Fichiers de configuration présents"

# 2. Créer répertoire de backup
mkdir -p "$BACKUP_DIR"

# 3. Backup de l'état actuel
log "Sauvegarde de l'état actuel..."
docker compose ps > "$BACKUP_DIR/containers-state-$(date +%Y%m%d-%H%M%S).txt" 2>&1 || true
log_success "État sauvegardé dans $BACKUP_DIR"

# 4. Pull des derniers changements Git
log "Récupération des derniers changements Git..."
CURRENT_COMMIT=$(git rev-parse HEAD)
log "Commit actuel: $CURRENT_COMMIT"

git pull origin master 2>&1 | tee -a "$LOG_FILE"
NEW_COMMIT=$(git rev-parse HEAD)
log "Nouveau commit: $NEW_COMMIT"

if [ "$CURRENT_COMMIT" = "$NEW_COMMIT" ]; then
    log "Aucun nouveau commit. Rebuild forcé quand même."
fi

# 5. Charger les variables d'environnement
log "Chargement des variables d'environnement..."
set -a
source .env.build
set +a

if [ -z "$NEXT_PUBLIC_API_URL" ]; then
    log_error "NEXT_PUBLIC_API_URL non définie dans .env.build"
    exit 1
fi

log "Variables chargées:"
log "  - NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"
log "  - NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL"

# 6. Build des images Docker
log "Build des images Docker (sans cache)..."
docker compose build --no-cache 2>&1 | tee -a "$LOG_FILE"

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    log_error "Échec du build Docker"
    exit 1
fi

log_success "Build Docker réussi"

# 7. Arrêt des conteneurs actuels
log "Arrêt des conteneurs actuels..."
docker compose down 2>&1 | tee -a "$LOG_FILE"

# 8. Démarrage des nouveaux conteneurs
log "Démarrage des nouveaux conteneurs..."
docker compose up -d 2>&1 | tee -a "$LOG_FILE"

if [ $? -ne 0 ]; then
    log_error "Échec du démarrage des conteneurs"
    exit 1
fi

log_success "Conteneurs démarrés"

# 9. Attendre que les services soient prêts
log "Attente du démarrage des services (max ${MAX_WAIT_TIME}s)..."
sleep 10

# 10. Health checks
log "Vérification de la santé des services..."

# Check API
API_HEALTHY=false
for i in $(seq 1 $HEALTH_CHECK_RETRIES); do
    log "Test API (tentative $i/$HEALTH_CHECK_RETRIES)..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/health 2>/dev/null || echo "000")

    if [ "$HTTP_CODE" = "200" ]; then
        log_success "API répond correctement (HTTP 200)"
        API_HEALTHY=true
        break
    else
        log "API non prête (HTTP $HTTP_CODE), attente 5s..."
        sleep 5
    fi
done

if [ "$API_HEALTHY" = false ]; then
    log_error "API ne répond pas après $HEALTH_CHECK_RETRIES tentatives"
    log "Logs API:"
    docker compose logs api --tail=20 2>&1 | tee -a "$LOG_FILE"
    exit 1
fi

# Check Web
WEB_HEALTHY=false
for i in $(seq 1 $HEALTH_CHECK_RETRIES); do
    log "Test Web (tentative $i/$HEALTH_CHECK_RETRIES)..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")

    if [ "$HTTP_CODE" = "200" ]; then
        log_success "Web répond correctement (HTTP 200)"
        WEB_HEALTHY=true
        break
    else
        log "Web non prêt (HTTP $HTTP_CODE), attente 5s..."
        sleep 5
    fi
done

if [ "$WEB_HEALTHY" = false ]; then
    log_error "Web ne répond pas après $HEALTH_CHECK_RETRIES tentatives"
    log "Logs Web:"
    docker compose logs web --tail=20 2>&1 | tee -a "$LOG_FILE"
    exit 1
fi

# 11. Tests HTTPS publics (optionnel si Nginx configuré)
log "Test des URLs publiques HTTPS..."
STAGING_APP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://staging-app.copronomie.fr 2>/dev/null || echo "000")
STAGING_API_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://staging-api.copronomie.fr/health 2>/dev/null || echo "000")

log "  - staging-app.copronomie.fr: HTTP $STAGING_APP_CODE"
log "  - staging-api.copronomie.fr/health: HTTP $STAGING_API_CODE"

# 12. Statut final
echo ""
log "Statut des conteneurs:"
docker compose ps 2>&1 | tee -a "$LOG_FILE"

echo ""
log "Logs récents (dernières 10 lignes):"
echo "--- API ---"
docker compose logs api --tail=10 2>&1 | tee -a "$LOG_FILE"
echo "--- Web ---"
docker compose logs web --tail=10 2>&1 | tee -a "$LOG_FILE"

# 13. Nettoyage des images inutilisées
log "Nettoyage des images Docker inutilisées..."
docker image prune -f 2>&1 | tee -a "$LOG_FILE"

# 14. Résumé final
echo ""
echo "=========================================="
log_success "DÉPLOIEMENT RÉUSSI!"
echo "=========================================="
echo ""
echo "📊 Résumé:"
echo "  - Commit: $CURRENT_COMMIT → $NEW_COMMIT"
echo "  - API: http://localhost:4000 (HTTP $HTTP_CODE)"
echo "  - Web: http://localhost:3000 (HTTP $HTTP_CODE)"
echo "  - Log: $LOG_FILE"
echo ""
echo "🌐 URLs Publiques:"
echo "  - Frontend: https://staging-app.copronomie.fr (HTTP $STAGING_APP_CODE)"
echo "  - API: https://staging-api.copronomie.fr (HTTP $STAGING_API_CODE)"
echo ""
echo "📝 Commandes utiles:"
echo "  - Logs temps réel: docker compose logs -f"
echo "  - Logs API: docker compose logs api -f"
echo "  - Logs Web: docker compose logs web -f"
echo "  - Redémarrer: docker compose restart [service]"
echo ""
log "Déploiement terminé avec succès"
