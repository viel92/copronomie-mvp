#!/bin/bash

# =================================
# SCRIPT DE VÉRIFICATION SÉCURITÉ
# =================================

echo "🔒 Vérification de sécurité Copronomie MVP"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        ((errors++))
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((warnings++))
}

echo ""
echo "1. Vérification des fichiers d'environnement..."

# Check for .env files in git (exclude .example files)
if git ls-files | grep -E '\.env$|\.env\.local$|\.env\.production$' >/dev/null 2>&1; then
    print_status 1 "Des fichiers .env sont trackés dans git"
    echo "   Fichiers trouvés:"
    git ls-files | grep -E '\.env$|\.env\..*$' | sed 's/^/   - /'
else
    print_status 0 "Aucun fichier .env tracké dans git"
fi

# Check for example files
if [ -f "apps/api/.env.example" ] && [ -f "apps/web/.env.example" ]; then
    print_status 0 "Fichiers .env.example présents"
else
    print_status 1 "Fichiers .env.example manquants"
fi

echo ""
echo "2. Vérification des secrets dans le code..."

# Check for hardcoded secrets
secret_patterns=("secret.*=.*['\"][^'\"]{20,}" "key.*=.*['\"][^'\"]{20,}" "password.*=.*['\"][^'\"]{8,}")

found_secrets=false
for pattern in "${secret_patterns[@]}"; do
    if grep -r -E "$pattern" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" apps/ packages/ 2>/dev/null; then
        found_secrets=true
    fi
done

if [ "$found_secrets" = true ]; then
    print_status 1 "Secrets potentiels trouvés dans le code"
else
    print_status 0 "Aucun secret hardcodé détecté"
fi

echo ""
echo "3. Vérification de la configuration de production..."

# Check devProcedure security
if grep -n "devProcedure.*process\.env\.NODE_ENV.*development" apps/api/src/trpc/trpc.ts >/dev/null 2>&1; then
    print_status 0 "devProcedure sécurisé pour la production"
else
    print_status 1 "devProcedure non sécurisé - risque de bypass d'auth en production"
fi

# Check Next.js config
if grep -n "poweredByHeader.*false" apps/web/next.config.js >/dev/null 2>&1; then
    print_status 0 "Headers de sécurité Next.js configurés"
else
    print_warning "Headers de sécurité Next.js manquants"
fi

echo ""
echo "4. Vérification des dépendances..."

# Check for security vulnerabilities (if npm audit is available)
if command -v npm >/dev/null 2>&1; then
    if npm audit --audit-level=high --json >/dev/null 2>&1; then
        print_status 0 "Aucune vulnérabilité critique détectée"
    else
        print_status 1 "Vulnérabilités de sécurité détectées - exécuter 'npm audit'"
    fi
else
    print_warning "npm non disponible - impossible de vérifier les vulnérabilités"
fi

echo ""
echo "5. Vérification de la configuration Docker..."

# Check Dockerfile security
if grep -n "USER.*node\|USER.*[0-9]" apps/*/Dockerfile >/dev/null 2>&1; then
    print_status 0 "Utilisateurs non-root configurés dans Docker"
else
    print_warning "Utilisateurs non-root manquants dans Docker"
fi

echo ""
echo "6. Vérification de la configuration Git..."

# Check .gitignore
if grep -E "\*\*/\.env\*|\*\*\/\*\.key" .gitignore >/dev/null 2>&1; then
    print_status 0 ".gitignore correctement configuré pour les secrets"
else
    print_status 1 ".gitignore insuffisant pour la sécurité des secrets"
fi

echo ""
echo "=========================================="
echo "📊 RÉSUMÉ DE LA VÉRIFICATION"
echo "=========================================="

if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✅ Aucune erreur critique détectée${NC}"
else
    echo -e "${RED}❌ $errors erreur(s) critique(s) détectée(s)${NC}"
fi

if [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✅ Aucun avertissement${NC}"
else
    echo -e "${YELLOW}⚠️  $warnings avertissement(s)${NC}"
fi

echo ""
if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}🎉 Application prête pour la production !${NC}"
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Application déployable avec des améliorations recommandées${NC}"
    exit 0
else
    echo -e "${RED}🚨 ATTENTION: Corriger les erreurs avant déploiement !${NC}"
    exit 1
fi