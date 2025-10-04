# Guide de Déploiement VPS - Copronomie v2

Déploiement sur VPS Hetzner avec Ubuntu, Docker et Nginx.

## Architecture

- **VPS:** Hetzner Cloud (Ubuntu 22.04)
- **Frontend:** Next.js (Docker)
- **Backend:** Hono API (Docker)
- **Database:** Supabase (externe, déjà hébergé)
- **Reverse Proxy:** Nginx + Certbot (SSL)
- **Orchestration:** Docker Compose

---

## Prérequis

1. **VPS Hetzner** (min. CX11 - 2GB RAM)
2. **Domaine** configuré avec DNS pointant vers le VPS
3. **Accès SSH** au VPS
4. **Compte Supabase** (déjà configuré)
5. **Clé API Resend** (pour les emails)

---

## ÉTAPE 1: Configuration Initiale du VPS

### 1.1 Connexion SSH

```bash
ssh root@VOTRE_IP_VPS
```

### 1.2 Mise à Jour du Système

```bash
apt update && apt upgrade -y
```

### 1.3 Créer un Utilisateur Non-Root

```bash
adduser deploy
usermod -aG sudo deploy
```

### 1.4 Configurer SSH pour l'Utilisateur

```bash
# Copier les clés SSH
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy

# Se connecter avec le nouvel utilisateur
exit
ssh deploy@VOTRE_IP_VPS
```

---

## ÉTAPE 2: Installation Docker

### 2.1 Installer Docker

```bash
# Installer les dépendances
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Ajouter la clé GPG Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Ajouter le repo Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installer Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Vérifier l'installation
docker --version
docker compose version
```

### 2.2 Ajouter l'Utilisateur au Groupe Docker

```bash
sudo usermod -aG docker $USER
newgrp docker

# Tester sans sudo
docker ps
```

---

## ÉTAPE 3: Installation Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Vérifier
sudo systemctl status nginx
```

---

## ÉTAPE 4: Cloner le Projet

### 4.1 Installer Git

```bash
sudo apt install -y git
```

### 4.2 Cloner le Repo

```bash
cd /home/deploy
git clone https://github.com/VOTRE_USERNAME/copronomie-v2.git
cd copronomie-v2
```

---

## ÉTAPE 5: Configuration des Variables d'Environnement

### 5.1 Backend (.env.production)

```bash
nano apps/api/.env.production
```

Contenu:
```env
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://app.copronomie.fr

# Supabase
SUPABASE_URL=https://lslkfxvscecwoqrrrwie.supabase.co
SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key

# CORS
CORS_ORIGIN=https://app.copronomie.fr

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logs
LOG_LEVEL=info

# Resend
RESEND_API_KEY=re_votre_api_key
RESEND_FROM_EMAIL=bonjour@copronomie.fr
```

### 5.2 Frontend (.env.production)

```bash
nano apps/web/.env.production
```

Contenu:
```env
# API Backend
NEXT_PUBLIC_API_URL=https://api.copronomie.fr

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://lslkfxvscecwoqrrrwie.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key

# Next.js
NEXT_TELEMETRY_DISABLED=1
```

---

## ÉTAPE 6: Build des Images Docker

### 6.1 Build

```bash
cd /home/deploy/copronomie-v2

# Build toutes les images
docker compose build

# Vérifier les images
docker images | grep copronomie
```

---

## ÉTAPE 7: Configuration Nginx

### 7.1 Créer la Configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/copronomie
```

Contenu:
```nginx
# Backend API
server {
    listen 80;
    server_name api.copronomie.fr;

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
    }
}

# Frontend Web
server {
    listen 80;
    server_name app.copronomie.fr;

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
    }
}
```

### 7.2 Activer la Configuration

```bash
# Créer le symlink
sudo ln -s /etc/nginx/sites-available/copronomie /etc/nginx/sites-enabled/

# Supprimer la config par défaut
sudo rm /etc/nginx/sites-enabled/default

# Tester la config
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

---

## ÉTAPE 8: Installation SSL avec Certbot

### 8.1 Installer Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 8.2 Obtenir les Certificats SSL

```bash
# Pour l'API
sudo certbot --nginx -d api.copronomie.fr

# Pour le Frontend
sudo certbot --nginx -d app.copronomie.fr

# Suivre les instructions (email, accepter ToS)
```

### 8.3 Vérifier le Renouvellement Automatique

```bash
sudo certbot renew --dry-run
```

---

## ÉTAPE 9: Démarrage de l'Application

### 9.1 Lancer les Conteneurs

```bash
cd /home/deploy/copronomie-v2

# Démarrer en mode détaché
docker compose up -d

# Vérifier les logs
docker compose logs -f

# Vérifier le statut
docker compose ps
```

### 9.2 Vérifier la Santé

```bash
# API Health Check
curl https://api.copronomie.fr/health

# Frontend
curl -I https://app.copronomie.fr
```

---

## ÉTAPE 10: Configuration Firewall (UFW)

```bash
# Installer UFW
sudo apt install -y ufw

# Configurer les règles
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Activer le firewall
sudo ufw enable

# Vérifier
sudo ufw status
```

---

## ÉTAPE 11: Tests Post-Déploiement

### 11.1 Test API

```bash
curl https://api.copronomie.fr/health
# Devrait retourner: {"status":"ok"}
```

### 11.2 Test Frontend

1. Ouvrir `https://app.copronomie.fr`
2. Créer un compte syndic
3. Créer une copropriété
4. Créer un projet
5. Publier le projet

### 11.3 Test Workflow Complet

1. Ouvrir mode incognito
2. Créer un compte entreprise
3. Voir le projet publié
4. Soumettre un devis
5. Vérifier email de notification

---

## ÉTAPE 12: Monitoring et Logs

### 12.1 Voir les Logs en Temps Réel

```bash
cd /home/deploy/copronomie-v2

# Tous les services
docker compose logs -f

# Service spécifique
docker compose logs -f api
docker compose logs -f web
```

### 12.2 Redémarrer les Services

```bash
# Redémarrer tout
docker compose restart

# Redémarrer un service spécifique
docker compose restart api
docker compose restart web
```

### 12.3 Mettre à Jour le Code

```bash
cd /home/deploy/copronomie-v2

# Pull les dernières modifications
git pull origin master

# Rebuild et redémarrer
docker compose down
docker compose build
docker compose up -d
```

---

## ÉTAPE 13: Automatisation des Déploiements

### 13.1 Script de Déploiement

Créer `deploy.sh`:

```bash
nano /home/deploy/deploy.sh
```

Contenu:
```bash
#!/bin/bash

set -e

echo "🚀 Déploiement Copronomie v2..."

cd /home/deploy/copronomie-v2

echo "📥 Pull du code..."
git pull origin master

echo "🔨 Build des images..."
docker compose build

echo "🛑 Arrêt des anciens conteneurs..."
docker compose down

echo "▶️  Démarrage des nouveaux conteneurs..."
docker compose up -d

echo "🧹 Nettoyage des images inutilisées..."
docker image prune -f

echo "✅ Déploiement terminé!"
docker compose ps
```

Rendre exécutable:
```bash
chmod +x /home/deploy/deploy.sh
```

Utilisation:
```bash
/home/deploy/deploy.sh
```

---

## ÉTAPE 14: Backup et Sécurité

### 14.1 Backup Automatique

```bash
# Créer un script de backup
sudo nano /home/deploy/backup.sh
```

Contenu:
```bash
#!/bin/bash

BACKUP_DIR="/home/deploy/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup des fichiers .env
cp /home/deploy/copronomie-v2/apps/api/.env.production $BACKUP_DIR/api_env_$DATE.bak
cp /home/deploy/copronomie-v2/apps/web/.env.production $BACKUP_DIR/web_env_$DATE.bak

# Garder seulement les 7 derniers backups
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup créé: $DATE"
```

Ajouter à crontab:
```bash
chmod +x /home/deploy/backup.sh
crontab -e

# Ajouter cette ligne (backup quotidien à 2h du matin)
0 2 * * * /home/deploy/backup.sh
```

### 14.2 Sécurité Supplémentaire

```bash
# Désactiver le login root SSH
sudo nano /etc/ssh/sshd_config

# Modifier:
PermitRootLogin no

# Redémarrer SSH
sudo systemctl restart ssh
```

---

## Commandes Utiles

### Docker

```bash
# Voir les conteneurs actifs
docker compose ps

# Logs en temps réel
docker compose logs -f

# Redémarrer un service
docker compose restart api

# Arrêter tout
docker compose down

# Démarrer tout
docker compose up -d

# Rebuild une image
docker compose build api

# Voir l'utilisation ressources
docker stats
```

### Nginx

```bash
# Tester la config
sudo nginx -t

# Recharger la config
sudo systemctl reload nginx

# Redémarrer Nginx
sudo systemctl restart nginx

# Voir les logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Système

```bash
# Espace disque
df -h

# Utilisation mémoire
free -m

# Processus
htop

# Logs système
sudo journalctl -f
```

---

## Troubleshooting

### Problème: Conteneur ne démarre pas

```bash
# Voir les logs détaillés
docker compose logs api

# Vérifier les variables d'environnement
docker compose exec api env | grep SUPABASE
```

### Problème: Erreur 502 Bad Gateway

```bash
# Vérifier que les conteneurs tournent
docker compose ps

# Vérifier les logs Nginx
sudo tail -f /var/log/nginx/error.log

# Redémarrer Nginx
sudo systemctl restart nginx
```

### Problème: "Cannot connect to database"

```bash
# Vérifier les variables Supabase
cat apps/api/.env.production | grep SUPABASE

# Tester la connexion depuis le conteneur
docker compose exec api wget -O- https://lslkfxvscecwoqrrrwie.supabase.co
```

### Problème: Erreur CORS

```bash
# Vérifier CORS_ORIGIN dans .env.production
cat apps/api/.env.production | grep CORS

# Doit correspondre exactement au domaine frontend
# CORS_ORIGIN=https://app.copronomie.fr
```

### Problème: SSL ne fonctionne pas

```bash
# Renouveler les certificats
sudo certbot renew

# Vérifier les certificats
sudo certbot certificates
```

---

## Configuration Recommandée VPS

### Hetzner CX11 (Minimum)
- **CPU:** 1 vCPU
- **RAM:** 2 GB
- **Disque:** 20 GB SSD
- **Prix:** ~4€/mois

### Hetzner CX21 (Recommandé)
- **CPU:** 2 vCPU
- **RAM:** 4 GB
- **Disque:** 40 GB SSD
- **Prix:** ~6€/mois

---

## Coûts Mensuels

- **VPS Hetzner CX21:** 6€
- **Supabase:** Gratuit (jusqu'à 500MB)
- **Resend:** Gratuit (jusqu'à 100 emails/jour)
- **Domaine:** ~10€/an

**Total:** ~6€/mois + domaine

---

## Checklist Finale

Avant de marquer le déploiement comme complet:

- [ ] VPS Hetzner configuré et accessible via SSH
- [ ] Docker et Docker Compose installés
- [ ] Nginx installé et configuré
- [ ] Domaines (api.copronomie.fr, app.copronomie.fr) configurés dans DNS
- [ ] SSL/HTTPS configuré avec Certbot
- [ ] Variables d'environnement configurées (.env.production)
- [ ] Images Docker buildées avec succès
- [ ] Conteneurs démarrés et healthy
- [ ] API accessible via https://api.copronomie.fr/health
- [ ] Frontend accessible via https://app.copronomie.fr
- [ ] Inscription syndic fonctionne
- [ ] Inscription company fonctionne
- [ ] Création copropriété fonctionne
- [ ] Création projet fonctionne
- [ ] Soumission devis fonctionne
- [ ] Emails de notification fonctionnent
- [ ] Firewall UFW activé
- [ ] Backups automatiques configurés
- [ ] Script de déploiement créé

---

## Support

En cas de problème:

1. **Vérifier les logs:**
   ```bash
   docker compose logs -f
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Vérifier la santé des services:**
   ```bash
   docker compose ps
   curl https://api.copronomie.fr/health
   ```

3. **Redémarrer les services:**
   ```bash
   docker compose restart
   sudo systemctl restart nginx
   ```

---

**Dernière mise à jour:** 4 Octobre 2025
**Temps estimé déploiement:** 1-2 heures
