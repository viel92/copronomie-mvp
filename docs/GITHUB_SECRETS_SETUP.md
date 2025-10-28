# GitHub Secrets Configuration

## Secrets Required for CI/CD Pipeline

Pour que le workflow GitHub Actions fonctionne, vous devez configurer les secrets suivants dans votre repository GitHub.

### Navigation vers les Secrets

1. Allez sur votre repository GitHub
2. Cliquez sur **Settings** > **Secrets and variables** > **Actions**
3. Cliquez sur **New repository secret**

---

## Secrets Required

### 1. Supabase Configuration

#### `NEXT_PUBLIC_SUPABASE_URL`
- **Description**: URL de votre projet Supabase
- **Exemple**: `https://xxxxxxxxxxxx.supabase.co`
- **Où le trouver**: Supabase Dashboard > Project Settings > API

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Description**: Clé API anonyme Supabase
- **Exemple**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Où le trouver**: Supabase Dashboard > Project Settings > API > anon public

---

### 2. VPS Staging Configuration

#### `STAGING_VPS_HOST`
- **Description**: Adresse IP ou hostname du VPS staging
- **Valeur actuelle**: `46.62.158.59`
- **Type**: Repository secret

#### `STAGING_VPS_USER`
- **Description**: Nom d'utilisateur SSH pour le VPS
- **Valeur recommandée**: `copronomie` (ou `root`)
- **Type**: Repository secret

#### `STAGING_VPS_SSH_KEY`
- **Description**: Clé SSH privée pour accéder au VPS
- **Type**: Repository secret
- **Format**: Copier tout le contenu de votre fichier `~/.ssh/id_rsa` ou clé spécifique
- **Génération si nécessaire**:
  ```bash
  # Sur votre machine locale
  ssh-keygen -t ed25519 -C "github-actions@copronomie.fr" -f ~/.ssh/github_actions_deploy

  # Copier la clé publique sur le VPS
  ssh-copy-id -i ~/.ssh/github_actions_deploy.pub copronomie@46.62.158.59

  # Copier la clé privée comme secret GitHub
  cat ~/.ssh/github_actions_deploy
  # Copier TOUT le contenu (inclus -----BEGIN ... et -----END ...)
  ```

---

### 3. Environment Configuration (Optionnel)

Pour une sécurité renforcée, vous pouvez créer un **Environment** nommé `staging` dans GitHub:

1. **Settings** > **Environments** > **New environment**
2. Nom: `staging`
3. Ajoutez des **Environment secrets** (overrident repository secrets)
4. Configurez des **Protection rules** (optionnel):
   - Required reviewers (si vous voulez review avant deploy)
   - Wait timer (attendre X minutes avant deploy)

---

## Vérification des Secrets

Une fois configurés, vérifiez que tous les secrets sont présents:

```bash
# Dans GitHub UI: Settings > Secrets and variables > Actions
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ STAGING_VPS_HOST
✅ STAGING_VPS_USER
✅ STAGING_VPS_SSH_KEY
```

---

## Testing SSH Connection

Pour tester la connexion SSH depuis GitHub Actions:

1. Créez un workflow de test temporaire:

```yaml
name: Test SSH
on: workflow_dispatch

jobs:
  test-ssh:
    runs-on: ubuntu-latest
    steps:
      - uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.STAGING_VPS_HOST }}
          username: ${{ secrets.STAGING_VPS_USER }}
          key: ${{ secrets.STAGING_VPS_SSH_KEY }}
          script: |
            echo "SSH connection successful!"
            whoami
            pwd
            docker --version
```

2. Exécutez manuellement depuis l'onglet **Actions** > **Test SSH** > **Run workflow**

---

## Troubleshooting

### Erreur: "Permission denied (publickey)"
- Vérifiez que la clé publique est bien dans `~/.ssh/authorized_keys` sur le VPS
- Permissions correctes: `chmod 600 ~/.ssh/authorized_keys`

### Erreur: "Host key verification failed"
- Ajoutez `StrictHostKeyChecking=no` dans ssh-action (non recommandé en prod)
- Ou ajoutez le host key dans known_hosts

### Erreur: "docker: command not found"
- L'utilisateur SSH doit avoir docker dans son PATH
- Ou utilisez sudo: `sudo docker compose up -d`

---

## Prochaines Étapes

Une fois les secrets configurés:

1. ✅ Commit le workflow: `git add .github/workflows/ci-cd.yml`
2. ✅ Push sur master: `git push origin master`
3. ✅ Vérifier l'exécution dans l'onglet **Actions**
4. ✅ Corriger les erreurs éventuelles
5. ✅ Célébrer le déploiement automatique!

---

**Dernière mise à jour**: 28 octobre 2025
