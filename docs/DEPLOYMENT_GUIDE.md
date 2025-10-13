# Guide de Déploiement - Copronomie

## Architecture

- **Frontend**: Next.js 15 (App Router)
- **Backend**: Hono.js API
- **Infrastructure**: Docker Compose + Nginx + SSL (Let's Encrypt)
- **Hébergement**: VPS (Hetzner/autre)

---

## Prérequis VPS

- Ubuntu 22.04+ ou Debian 11+
- Docker Engine + Docker Compose V2
- Nginx
- Certbot (Let's Encrypt)
- Accès root ou sudo

---

## Configuration DNS

Avant de commencer, configurer les enregistrements DNS (OVH, Cloudflare, etc.) :

```
Type A: staging-app.copronomie.fr  → IP_VPS
Type A: staging-api.copronomie.fr  → IP_VPS
```

---

## Installation Initiale (VPS neuf)

### 1. Mise à jour système

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Installation Docker

```bash
# Installation Docker Engine
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Ajouter user au groupe docker
sudo usermod -aG docker $USER

# Installation Docker Compose V2
sudo apt install docker-compose-plugin -y

# Vérifier
docker --version
docker compose version
```

### 3. Installation Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 4. Cloner le projet

```bash
cd ~
git clone https://github.com/viel92/copronomie-mvp.git
cd copronomie-mvp
```

---

## Configuration Environnement

### 1. Créer les fichiers .env

**Fichier `apps/api/.env` :**

```bash
nano ~/copronomie-mvp/apps/api/.env
```

Contenu :
```env
# Environment
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://staging-app.copronomie.fr

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# CORS
CORS_ORIGIN=https://staging-app.copronomie.fr

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200

# Logs
LOG_LEVEL=debug

# RESEND (emails)
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=bonjour@copronomie.fr
```

**Fichier `apps/web/.env` :**

```bash
nano ~/copronomie-mvp/apps/web/.env
```

Contenu :
```env
NEXT_PUBLIC_API_URL=https://staging-api.copronomie.fr
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_TELEMETRY_DISABLED=1
```

**Fichier `.env.build` (racine du projet) :**

```bash
nano ~/copronomie-mvp/.env.build
```

Contenu :
```env
NEXT_PUBLIC_API_URL=https://staging-api.copronomie.fr
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## Configuration Nginx

### 1. Créer la configuration

```bash
sudo nano /etc/nginx/sites-available/copronomie-staging
```

Contenu :
```nginx
# Frontend (Web)
server {
    listen 80;
    server_name staging-app.copronomie.fr;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        client_max_body_size 10M;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
}

# Backend (API)
server {
    listen 80;
    server_name staging-api.copronomie.fr;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        client_max_body_size 10M;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
}
```

### 2. Activer la configuration

```bash
sudo ln -s /etc/nginx/sites-available/copronomie-staging /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Configuration SSL (Certbot)

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtenir les certificats SSL
sudo certbot --nginx -d staging-app.copronomie.fr -d staging-api.copronomie.fr

# Suivre les instructions :
# - Entrer votre email
# - Accepter les CGU
# - Choisir de rediriger HTTP vers HTTPS (option 2)
```

Le renouvellement automatique est configuré via cron.

---

## Déploiement

### Premier déploiement

```bash
cd ~/copronomie-mvp

# Rendre le script exécutable
chmod +x deploy-staging.sh

# Lancer le déploiement
./deploy-staging.sh
```

### Déploiements suivants

Pour mettre à jour l'application après des changements de code :

```bash
cd ~/copronomie-mvp
./deploy-staging.sh
```

Le script va automatiquement :
1. Pull les derniers changements Git
2. Charger les variables d'environnement
3. Rebuild les images Docker
4. Redémarrer les conteneurs

---

## Vérification Post-Déploiement

### 1. Statut des conteneurs

```bash
docker compose ps
```

Les deux conteneurs doivent être "Up" avec status "healthy".

### 2. Logs

```bash
# Logs API
docker compose logs api --tail=50

# Logs Web
docker compose logs web --tail=50

# Logs en temps réel
docker compose logs -f
```

### 3. Tests HTTP

```bash
# Test local
curl -I http://localhost:3000
curl -I http://localhost:4000/health

# Test public HTTPS
curl -I https://staging-app.copronomie.fr
curl -I https://staging-api.copronomie.fr/health
```

### 4. Test workflow complet

1. Ouvrir https://staging-app.copronomie.fr dans le navigateur
2. S'inscrire avec un nouveau compte
3. Créer une copropriété
4. Créer et publier un projet
5. Vérifier que tout fonctionne sans erreur console

---

## Gestion des Services

### Commandes utiles

```bash
# Redémarrer un service
docker compose restart web
docker compose restart api

# Arrêter tous les services
docker compose down

# Démarrer tous les services
docker compose up -d

# Rebuild un service spécifique
set -a && source .env.build && set +a
docker compose build web --no-cache
docker compose up -d

# Voir les logs d'un service
docker compose logs api -f
```

### En cas de problème

1. **502 Bad Gateway** : Le conteneur web ne répond pas
   ```bash
   docker compose logs web
   docker compose restart web
   ```

2. **Erreur 500 API** : Problème côté serveur
   ```bash
   docker compose logs api
   # Vérifier les variables d'environnement
   docker exec copronomie-mvp-api-1 printenv | grep SUPABASE
   ```

3. **Variables d'environnement non définies**
   ```bash
   # Vérifier les fichiers .env
   cat apps/api/.env
   cat apps/web/.env
   cat .env.build

   # Rebuild avec les bonnes variables
   ./deploy-staging.sh
   ```

---

## Monitoring

### Health Checks

Les conteneurs ont des health checks automatiques :

```bash
# Vérifier le statut
docker compose ps

# API health endpoint
curl https://staging-api.copronomie.fr/health
```

### Logs système

```bash
# Logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs système
sudo journalctl -u docker -f
```

---

## Sécurité

### Firewall (UFW)

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
sudo ufw status
```

### Mises à jour

```bash
# Mises à jour système mensuelles
sudo apt update && sudo apt upgrade -y

# Rebuild images Docker après mise à jour de dépendances
cd ~/copronomie-mvp
git pull origin master
./deploy-staging.sh
```

---

## Backup

### Base de données Supabase

Supabase gère automatiquement les backups. Configurer des backups manuels si nécessaire dans le dashboard Supabase.

### Configuration VPS

```bash
# Backup des fichiers .env
cd ~/copronomie-mvp
tar -czf backup-env-$(date +%Y%m%d).tar.gz apps/api/.env apps/web/.env .env.build
```

---

## Troubleshooting

### Problème : Front affiche "localhost:4000"

**Cause** : Variables `NEXT_PUBLIC_*` pas compilées dans le bundle Next.js

**Solution** :
```bash
cd ~/copronomie-mvp
set -a && source .env.build && set +a
docker compose build web --no-cache
docker compose up -d
```

Vider le cache du navigateur (Ctrl+Shift+Suppr).

### Problème : Conteneur crash au démarrage

**Diagnostic** :
```bash
docker compose logs [service-name]
docker compose ps
```

**Solutions communes** :
- Vérifier les variables d'environnement dans `.env`
- Vérifier que les ports 3000 et 4000 ne sont pas déjà utilisés
- Rebuild l'image : `docker compose build --no-cache`

---

## Production (VPS 2)

Pour déployer en production, répéter les mêmes étapes avec :

1. **DNS** : `app.copronomie.fr` et `api.copronomie.fr`
2. **Variables d'environnement** : Créer `.env.production` avec les URLs de production
3. **Script de déploiement** : Créer `deploy-production.sh` similaire
4. **Monitoring** : Configurer Sentry pour les erreurs en production

---

## Support

- **Documentation** : `/docs` dans le repo
- **Issues** : GitHub Issues
- **Logs** : `docker compose logs -f`
