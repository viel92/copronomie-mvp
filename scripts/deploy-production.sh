#!/bin/bash
set -e

echo "========================================"
echo " DEPLOIEMENT PRODUCTION (VPS 2)"
echo "========================================"
echo ""
echo "ATTENTION: Deploiement en environnement PRODUCTION"
echo ""

# Configuration
VPS_USER="deploy"
VPS_IP="REMPLACER_PAR_IP_VPS_2"
PROJECT_DIR="/home/deploy/copronomie-v2"

read -p "IP du VPS 2 (PRODUCTION): " VPS_IP_INPUT
VPS_IP=${VPS_IP_INPUT:-$VPS_IP}

read -p "Version a deployer (ex: v1.0.3) ou 'master': " VERSION
VERSION=${VERSION:-master}

echo ""
read -p "Confirmer le deploiement de '$VERSION' sur PRODUCTION? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "Deploiement annule."
  exit 1
fi

echo ""
echo "Connexion a $VPS_USER@$VPS_IP..."

ssh $VPS_USER@$VPS_IP << ENDSSH
  set -e

  echo ""
  echo "1/7 - Navigation vers le projet..."
  cd /home/deploy/copronomie-v2

  echo ""
  echo "2/7 - Fetch des dernieres modifications..."
  git fetch --all --tags

  echo ""
  echo "3/7 - Checkout de la version $VERSION..."
  git checkout $VERSION

  echo ""
  echo "4/7 - Arret des conteneurs..."
  docker compose down

  echo ""
  echo "5/7 - Build des images Docker..."
  docker compose build

  echo ""
  echo "6/7 - Demarrage des conteneurs..."
  docker compose up -d

  echo ""
  echo "7/7 - Nettoyage des images inutilisees..."
  docker image prune -f

  echo ""
  echo "Status des conteneurs:"
  docker compose ps
ENDSSH

echo ""
echo "========================================"
echo " DEPLOIEMENT PRODUCTION TERMINE!"
echo "========================================"
echo ""
echo "Version deployee: $VERSION"
echo ""
echo "URLs de verification:"
echo "  - Frontend: https://app.copronomie.fr"
echo "  - API:      https://api.copronomie.fr/health"
echo ""
echo "Commandes de verification:"
echo "  curl https://api.copronomie.fr/health"
echo "  ssh $VPS_USER@$VPS_IP 'cd /home/deploy/copronomie-v2 && docker compose logs -f'"
echo ""
echo "IMPORTANT: Verifier les logs et Sentry dans les 10 prochaines minutes!"
echo ""
