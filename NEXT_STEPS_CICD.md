# Prochaines Étapes - Configuration CI/CD

## ✅ Ce qui a été fait

1. **Workflow GitHub Actions** configuré (`.github/workflows/ci-cd.yml`)
2. **Documentation complète** créée :
   - `docs/GITHUB_SECRETS_SETUP.md` - Guide de configuration des secrets
   - `docs/CICD_QUICKSTART.md` - Vue d'ensemble du pipeline
3. **Script d'assistance** pour configurer les secrets (`scripts/setup-github-secrets.sh`)
4. **Commit créé** mais PAS ENCORE PUSHÉ

---

## 🔧 Étapes Restantes (IMPORTANT)

### Étape 1: Configurer les Secrets GitHub

**Avant de pusher**, vous devez configurer 5 secrets sur GitHub:

#### Option A: Via Interface GitHub (Recommandé pour débutants)

1. Allez sur https://github.com/VOTRE_USERNAME/copronomie-v2
2. Cliquez sur **Settings** > **Secrets and variables** > **Actions**
3. Cliquez sur **New repository secret** pour chaque secret:

| Nom du Secret | Où le trouver | Exemple |
|---------------|---------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard > Settings > API | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard > Settings > API | `eyJhbGci...` (très long) |
| `STAGING_VPS_HOST` | Votre VPS actuel | `46.62.158.59` |
| `STAGING_VPS_USER` | Nom utilisateur SSH | `copronomie` ou `root` |
| `STAGING_VPS_SSH_KEY` | Clé SSH privée | Contenu de `~/.ssh/id_rsa` |

#### Option B: Via GitHub CLI (Plus rapide)

```bash
# 1. Installer gh CLI si pas déjà fait
# Windows: winget install GitHub.cli
# Mac: brew install gh
# Linux: voir https://cli.github.com/

# 2. Se connecter
gh auth login

# 3. Exécuter le script d'assistance
bash scripts/setup-github-secrets.sh
```

Le script vous guidera interactivement pour configurer tous les secrets.

---

### Étape 2: Configurer la Clé SSH sur le VPS

**Important**: GitHub Actions doit pouvoir se connecter au VPS via SSH.

#### Si vous utilisez une clé SSH existante:

```bash
# Sur votre machine locale
ssh-copy-id copronomie@46.62.158.59

# Ou manuellement
cat ~/.ssh/id_rsa.pub | ssh copronomie@46.62.158.59 'cat >> ~/.ssh/authorized_keys'
```

#### Si vous générez une nouvelle clé (recommandé):

```bash
# 1. Générer une clé dédiée
ssh-keygen -t ed25519 -C "github-actions@copronomie.fr" -f ~/.ssh/github_actions_deploy

# 2. Copier la clé publique sur le VPS
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub copronomie@46.62.158.59

# 3. Copier le contenu de la clé PRIVÉE comme secret GitHub
cat ~/.ssh/github_actions_deploy
# Copier TOUT le contenu (-----BEGIN jusqu'à -----END)
# Et le coller dans le secret STAGING_VPS_SSH_KEY
```

#### Tester la connexion SSH:

```bash
# Avec la clé existante
ssh copronomie@46.62.158.59

# Avec la nouvelle clé
ssh -i ~/.ssh/github_actions_deploy copronomie@46.62.158.59
```

Doit fonctionner **sans demander de mot de passe**.

---

### Étape 3: Vérifier la Configuration du VPS

Le workflow s'attend à trouver le projet dans `/home/copronomie/copronomie-mvp`.

```bash
# SSH vers le VPS
ssh copronomie@46.62.158.59

# Vérifier le chemin
ls -la /home/copronomie/copronomie-mvp

# Si le projet n'est pas là, ajuster le chemin dans le workflow
# Ou créer un lien symbolique:
ln -s /chemin/actuel /home/copronomie/copronomie-mvp
```

---

### Étape 4: Push et Déclenchement du Pipeline

Une fois **tous les secrets configurés**:

```bash
# 1. Vérifier le commit
git log -1

# 2. Push vers GitHub (DÉCLENCHE LE PIPELINE)
git push origin master

# 3. Suivre l'exécution
# Allez sur GitHub > Actions tab
# Ou via CLI:
gh run watch
```

**Temps estimé**: 15-20 minutes pour la première exécution.

---

### Étape 5: Monitoring du Premier Déploiement

#### Sur GitHub:
- Tab **Actions**: Voir le workflow en cours
- Logs détaillés pour chaque étape
- Artifacts: Playwright test reports

#### Sur le VPS:
```bash
# SSH vers le VPS
ssh copronomie@46.62.158.59

# Suivre les logs Docker
cd /home/copronomie/copronomie-mvp
docker compose logs -f

# Vérifier les conteneurs
docker ps
```

#### Vérification Endpoints:
- Frontend: https://staging-app.copronomie.fr
- API: https://staging-api.copronomie.fr/health

---

## 🚨 Troubleshooting

### Erreur: "Permission denied (publickey)"
**Cause**: La clé SSH n'est pas correctement configurée sur le VPS.

**Solution**:
```bash
# Vérifier les permissions sur le VPS
ssh copronomie@46.62.158.59
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Vérifier que la clé publique est dans authorized_keys
cat ~/.ssh/authorized_keys | grep "github-actions"
```

### Erreur: "docker: command not found"
**Cause**: L'utilisateur SSH n'a pas Docker dans son PATH.

**Solution**:
```bash
# Sur le VPS, ajouter au PATH
echo 'export PATH=$PATH:/usr/bin' >> ~/.bashrc
source ~/.bashrc

# Ou utiliser le chemin complet dans le workflow
# Modifier le workflow: docker compose → /usr/bin/docker compose
```

### Erreur: "Health check failed"
**Cause**: Les conteneurs ne démarrent pas correctement.

**Solution**:
```bash
# Sur le VPS, vérifier les logs
docker compose logs api
docker compose logs web

# Vérifier les variables d'environnement
docker compose config

# Redémarrer manuellement
docker compose down
docker compose up -d
```

### Tests E2E échouent
**Attendu**: Les tests E2E peuvent échouer (continue-on-error: true).
**Impact**: Le déploiement continue quand même.
**Action**: Corriger les tests dans un PR séparé plus tard.

---

## 📊 Vérifications Post-Déploiement

### Checklist Manuelle:

1. [ ] Frontend accessible: https://staging-app.copronomie.fr
2. [ ] API health check: https://staging-api.copronomie.fr/health
3. [ ] Inscription utilisateur fonctionne
4. [ ] Création copropriété fonctionne
5. [ ] Création projet fonctionne
6. [ ] Logs Sentry: Aucune erreur critique
7. [ ] Docker containers healthy: `docker ps` sur VPS

### Métriques à Surveiller:

- **Build Time**: Doit être < 20 minutes
- **Container Health**: Tous "healthy" ou "running"
- **HTTP Status**: 200 pour tous les endpoints
- **Sentry Errors**: 0 erreurs dans les 5 minutes post-déploiement

---

## 📝 Prochains Déploiements

Une fois le premier déploiement réussi, les suivants seront **automatiques**:

1. Faites vos modifications de code
2. Committez: `git add . && git commit -m "feat: ..."`
3. Pushez: `git push origin master`
4. Le pipeline se déclenche automatiquement
5. Surveillez dans l'onglet Actions
6. Le déploiement se fait automatiquement après les tests

**Pas besoin de toucher au VPS manuellement !**

---

## 🎯 Résumé des Actions Requises

### MAINTENANT (avant de push):
1. ✅ Configurer les 5 secrets GitHub
2. ✅ Configurer la clé SSH sur le VPS
3. ✅ Vérifier le chemin du projet sur VPS
4. ✅ Tester la connexion SSH manuellement

### ENSUITE (après push):
1. ✅ Surveiller le workflow dans Actions tab
2. ✅ Vérifier les endpoints HTTPS
3. ✅ Tester le workflow complet manuellement
4. ✅ Vérifier Sentry pour erreurs

### PLUS TARD (optimisations):
- [ ] Ajouter Slack/Discord notifications
- [ ] Améliorer les tests E2E
- [ ] Ajouter environment "production"
- [ ] Configurer auto-rollback avancé

---

## 📚 Ressources

- **Documentation CI/CD**: `docs/CICD_QUICKSTART.md`
- **Configuration Secrets**: `docs/GITHUB_SECRETS_SETUP.md`
- **Script Setup**: `scripts/setup-github-secrets.sh`
- **Workflow File**: `.github/workflows/ci-cd.yml`

---

## ❓ Questions ?

Si vous rencontrez des problèmes:

1. Vérifiez les logs dans Actions tab
2. SSH vers le VPS et vérifiez les logs Docker
3. Consultez la section Troubleshooting ci-dessus
4. Vérifiez que tous les secrets sont configurés

**Bon déploiement ! 🚀**
