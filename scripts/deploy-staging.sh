#!/bin/bash
set -e

echo "========================================"
echo " DEPLOIEMENT STAGING (VPS 1)"
echo "========================================"

# Configuration
VPS_USER="deploy"
VPS_IP="REMPLACER_PAR_IP_VPS_1"
PROJECT_DIR="/home/deploy/copronomie-v2"

echo ""
read -p "IP du VPS 1 (STAGING): " VPS_IP_INPUT
VPS_IP=${VPS_IP_INPUT:-$VPS_IP}

echo ""
echo "Connexion a $VPS_USER@$VPS_IP..."

ssh $VPS_USER@$VPS_IP << 'ENDSSH'
  set -e

  echo ""
  echo "1/6 - Navigation vers le projet..."
  cd /home/deploy/copronomie-v2

  echo ""
  echo "2/6 - Pull des derniers changements..."
  git pull origin master

  echo ""
  echo "3/6 - Copie des variables d'environnement staging..."
  cp apps/api/.env.staging apps/api/.env.production
  cp apps/web/.env.staging apps/web/.env.production

  echo ""
  echo "4/6 - Arret des conteneurs..."
  docker compose down

  echo ""
  echo "5/6 - Build des images Docker..."
  docker compose build

  echo ""
  echo "6/6 - Demarrage des conteneurs..."
  docker compose up -d

  echo ""
  echo "Nettoyage des images inutilisees..."
  docker image prune -f

  echo ""
  echo "Status des conteneurs:"
  docker compose ps
ENDSSH

echo ""
echo "========================================"
echo " DEPLOIEMENT TERMINE AVEC SUCCES!"
echo "========================================"
echo ""
echo "URLs de verification:"
echo "  - Frontend: https://staging-app.copronomie.fr"
echo "  - API:      https://staging-api.copronomie.fr/health"
echo ""
echo "Commande de verification:"
echo "  curl https://staging-api.copronomie.fr/health"
echo ""
