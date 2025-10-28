#!/bin/bash

# Script d'assistance pour configurer les secrets GitHub
# Usage: ./scripts/setup-github-secrets.sh

set -e

echo "=========================================="
echo " Configuration des GitHub Secrets"
echo "=========================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Ce script vous aide à configurer les secrets GitHub requis pour le CI/CD.${NC}"
echo ""
echo -e "${YELLOW}IMPORTANT:${NC} Ce script ne configure PAS automatiquement les secrets."
echo "Il génère les commandes GitHub CLI que vous devez exécuter."
echo ""

# Vérifier si gh CLI est installé
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) n'est pas installé.${NC}"
    echo "Installez-le depuis: https://cli.github.com/"
    echo ""
    echo "Ou installez manuellement les secrets via:"
    echo "GitHub Repository > Settings > Secrets and variables > Actions"
    exit 1
fi

# Vérifier l'authentification
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Vous n'êtes pas authentifié avec GitHub CLI.${NC}"
    echo "Exécutez: gh auth login"
    exit 1
fi

echo -e "${GREEN}✓ GitHub CLI installé et authentifié${NC}"
echo ""

# Récupérer le nom du repository
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
if [ -z "$REPO" ]; then
    echo -e "${RED}❌ Impossible de détecter le repository GitHub.${NC}"
    echo "Assurez-vous d'être dans le bon répertoire."
    exit 1
fi

echo -e "${GREEN}✓ Repository détecté: $REPO${NC}"
echo ""

# Fonction pour ajouter un secret
add_secret() {
    local SECRET_NAME=$1
    local SECRET_DESCRIPTION=$2
    local SECRET_VALUE=""

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${YELLOW}Secret: $SECRET_NAME${NC}"
    echo "Description: $SECRET_DESCRIPTION"
    echo ""

    # Lire la valeur
    read -sp "Entrez la valeur (sera masquée): " SECRET_VALUE
    echo ""

    if [ -z "$SECRET_VALUE" ]; then
        echo -e "${RED}❌ Valeur vide, secret ignoré.${NC}"
        echo ""
        return 1
    fi

    # Ajouter le secret via gh CLI
    echo "$SECRET_VALUE" | gh secret set "$SECRET_NAME" --repo="$REPO"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Secret $SECRET_NAME configuré avec succès${NC}"
    else
        echo -e "${RED}❌ Erreur lors de la configuration de $SECRET_NAME${NC}"
    fi
    echo ""
}

# Fonction pour ajouter un secret depuis un fichier
add_secret_from_file() {
    local SECRET_NAME=$1
    local SECRET_DESCRIPTION=$2
    local FILE_PATH=""

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${YELLOW}Secret: $SECRET_NAME${NC}"
    echo "Description: $SECRET_DESCRIPTION"
    echo ""

    read -p "Chemin du fichier: " FILE_PATH

    if [ ! -f "$FILE_PATH" ]; then
        echo -e "${RED}❌ Fichier introuvable: $FILE_PATH${NC}"
        echo ""
        return 1
    fi

    # Ajouter le secret depuis le fichier
    gh secret set "$SECRET_NAME" --repo="$REPO" < "$FILE_PATH"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Secret $SECRET_NAME configuré depuis $FILE_PATH${NC}"
    else
        echo -e "${RED}❌ Erreur lors de la configuration de $SECRET_NAME${NC}"
    fi
    echo ""
}

echo "=========================================="
echo " Configuration des Secrets"
echo "=========================================="
echo ""

# 1. Supabase URL
add_secret "NEXT_PUBLIC_SUPABASE_URL" \
    "URL de votre projet Supabase (ex: https://xxx.supabase.co)"

# 2. Supabase Anon Key
add_secret "NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    "Clé API anonyme Supabase (depuis Project Settings > API)"

# 3. VPS Host
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}Secret: STAGING_VPS_HOST${NC}"
echo "Description: IP ou hostname du VPS staging"
echo ""
echo "Valeur recommandée: 46.62.158.59"
read -p "Appuyez sur Entrée pour utiliser 46.62.158.59 ou entrez une autre valeur: " VPS_HOST
VPS_HOST=${VPS_HOST:-46.62.158.59}
echo "$VPS_HOST" | gh secret set "STAGING_VPS_HOST" --repo="$REPO"
echo -e "${GREEN}✓ STAGING_VPS_HOST = $VPS_HOST${NC}"
echo ""

# 4. VPS User
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}Secret: STAGING_VPS_USER${NC}"
echo "Description: Nom d'utilisateur SSH pour le VPS"
echo ""
echo "Valeur recommandée: copronomie"
read -p "Appuyez sur Entrée pour utiliser 'copronomie' ou entrez un autre nom: " VPS_USER
VPS_USER=${VPS_USER:-copronomie}
echo "$VPS_USER" | gh secret set "STAGING_VPS_USER" --repo="$REPO"
echo -e "${GREEN}✓ STAGING_VPS_USER = $VPS_USER${NC}"
echo ""

# 5. SSH Key
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}Secret: STAGING_VPS_SSH_KEY${NC}"
echo "Description: Clé SSH privée pour accéder au VPS"
echo ""
echo "Options:"
echo "  1) Utiliser une clé existante (chemin vers fichier)"
echo "  2) Générer une nouvelle clé"
echo "  3) Entrer manuellement"
echo ""
read -p "Votre choix [1/2/3]: " SSH_CHOICE

case $SSH_CHOICE in
    1)
        read -p "Chemin vers la clé privée (ex: ~/.ssh/id_rsa): " SSH_KEY_PATH
        SSH_KEY_PATH="${SSH_KEY_PATH/#\~/$HOME}"

        if [ -f "$SSH_KEY_PATH" ]; then
            gh secret set "STAGING_VPS_SSH_KEY" --repo="$REPO" < "$SSH_KEY_PATH"
            echo -e "${GREEN}✓ STAGING_VPS_SSH_KEY configuré depuis $SSH_KEY_PATH${NC}"

            # Afficher la clé publique correspondante
            PUB_KEY_PATH="${SSH_KEY_PATH}.pub"
            if [ -f "$PUB_KEY_PATH" ]; then
                echo ""
                echo -e "${YELLOW}N'oubliez pas d'ajouter cette clé publique sur le VPS:${NC}"
                echo ""
                cat "$PUB_KEY_PATH"
                echo ""
                echo "Commande à exécuter sur le VPS:"
                echo -e "${GREEN}echo '$(cat $PUB_KEY_PATH)' >> ~/.ssh/authorized_keys${NC}"
            fi
        else
            echo -e "${RED}❌ Fichier introuvable: $SSH_KEY_PATH${NC}"
        fi
        ;;

    2)
        echo ""
        echo "Génération d'une nouvelle clé SSH..."
        NEW_KEY_PATH="$HOME/.ssh/github_actions_copronomie"
        ssh-keygen -t ed25519 -C "github-actions@copronomie.fr" -f "$NEW_KEY_PATH" -N ""

        echo -e "${GREEN}✓ Nouvelle clé générée: $NEW_KEY_PATH${NC}"

        # Configurer le secret
        gh secret set "STAGING_VPS_SSH_KEY" --repo="$REPO" < "$NEW_KEY_PATH"
        echo -e "${GREEN}✓ STAGING_VPS_SSH_KEY configuré${NC}"

        echo ""
        echo -e "${YELLOW}IMPORTANT: Ajoutez cette clé publique sur le VPS:${NC}"
        echo ""
        cat "${NEW_KEY_PATH}.pub"
        echo ""
        echo "Commande à exécuter:"
        echo -e "${GREEN}ssh-copy-id -i ${NEW_KEY_PATH}.pub $VPS_USER@$VPS_HOST${NC}"
        echo "Ou manuellement:"
        echo -e "${GREEN}cat ${NEW_KEY_PATH}.pub | ssh $VPS_USER@$VPS_HOST 'cat >> ~/.ssh/authorized_keys'${NC}"
        ;;

    3)
        add_secret "STAGING_VPS_SSH_KEY" \
            "Collez le contenu complet de la clé privée (-----BEGIN ... -----END)"
        ;;

    *)
        echo -e "${RED}❌ Choix invalide${NC}"
        ;;
esac
echo ""

# Résumé
echo "=========================================="
echo " Résumé de la Configuration"
echo "=========================================="
echo ""

# Lister les secrets configurés
echo "Secrets configurés:"
gh secret list --repo="$REPO"
echo ""

echo -e "${GREEN}✓ Configuration terminée!${NC}"
echo ""
echo "Prochaines étapes:"
echo "  1. Vérifiez que la clé SSH publique est sur le VPS"
echo "  2. Testez la connexion SSH: ssh -i ~/.ssh/key $VPS_USER@$VPS_HOST"
echo "  3. Committez vos changements: git add . && git commit -m 'feat: Add CI/CD pipeline'"
echo "  4. Pushez sur master: git push origin master"
echo "  5. Vérifiez le workflow dans l'onglet Actions"
echo ""
echo "Documentation complète: docs/GITHUB_SECRETS_SETUP.md"
