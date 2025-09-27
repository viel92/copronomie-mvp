# Configuration VPS pour Copronomie MVP

## 📋 Prérequis VPS

**Spécifications minimales :**
- CPU : 2 vCPU minimum
- RAM : 4GB minimum
- Stockage : 50GB SSD
- OS : Ubuntu 24.04 LTS ou Debian 12
- Ports : 22 (SSH), 80 (HTTP), 443 (HTTPS)

**Providers recommandés :**
- DigitalOcean Droplet ($24/mois)
- Linode VPS ($12/mois)
- Vultr Cloud Compute ($12/mois)
- OVH VPS ($15/mois)

---

## 🚀 Installation initiale du serveur

### 1. Connexion et mise à jour
```bash
# Connexion SSH
ssh root@YOUR_VPS_IP

# Mise à jour du système
apt update && apt upgrade -y

# Installation des outils de base
apt install -y curl wget git vim htop unzip fail2ban ufw
```

### 2. Configuration de la sécurité
```bash
# Configuration du firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable

# Configuration fail2ban
systemctl enable fail2ban
systemctl start fail2ban

# Créer un utilisateur non-root
adduser copronomie
usermod -aG sudo copronomie

# Configuration SSH (optionnel mais recommandé)
# Désactiver login root et utiliser des clés SSH
```

### 3. Installation Docker
```bash
# Installation Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Ajouter l'utilisateur au groupe docker
usermod -aG docker copronomie

# Installation Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Vérification
docker --version
docker-compose --version
```

---

## 🏗️ Préparation de l'application

### 1. Structure des dossiers
```bash
# Se connecter avec l'utilisateur copronomie
sudo su - copronomie

# Créer la structure
mkdir -p /opt/copronomie/{nginx/ssl,logs}
cd /opt/copronomie

# Cloner le repository (ou copier les fichiers)
git clone https://github.com/YOUR_USERNAME/copronomie-v2.git .

# Copier les fichiers de configuration
cp docker-compose.yml docker-compose.prod.yml
```

### 2. Variables d'environnement
```bash
# Créer le fichier .env pour la production
cat > .env << 'EOF'
# Environment
NODE_ENV=production

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

# JWT
JWT_SECRET=your_super_secret_jwt_key

# API
API_URL=https://copronomie.com/api
NEXT_PUBLIC_API_URL=https://copronomie.com/api

# Docker Registry (pour CI/CD)
DOCKER_REGISTRY=ghcr.io
IMAGE_TAG=latest
EOF

# Sécuriser le fichier .env
chmod 600 .env
```

### 3. Configuration Docker Compose de production
```bash
# Créer docker-compose.prod.yml
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  web:
    image: ghcr.io/your-username/copronomie-v2-web:${IMAGE_TAG:-latest}
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://copronomie.com/api
    networks:
      - copronomie-network

  api:
    image: ghcr.io/your-username/copronomie-v2-api:${IMAGE_TAG:-latest}
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - JWT_SECRET=${JWT_SECRET}
    networks:
      - copronomie-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./logs:/var/log/nginx
    depends_on:
      - web
      - api
    restart: unless-stopped
    networks:
      - copronomie-network

networks:
  copronomie-network:
    driver: bridge
EOF
```

---

## 🔐 Configuration SSL avec Let's Encrypt

### 1. Installation Certbot
```bash
# Installation Certbot
apt install -y snapd
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot
```

### 2. Génération des certificats
```bash
# Arrêter nginx temporairement
docker-compose -f docker-compose.prod.yml down

# Générer les certificats
certbot certonly --standalone -d copronomie.com -d www.copronomie.com

# Copier les certificats
mkdir -p /opt/copronomie/nginx/ssl
cp /etc/letsencrypt/live/copronomie.com/fullchain.pem /opt/copronomie/nginx/ssl/
cp /etc/letsencrypt/live/copronomie.com/privkey.pem /opt/copronomie/nginx/ssl/

# Configurer le renouvellement automatique
crontab -e
# Ajouter : 0 3 * * * certbot renew --quiet && docker-compose -f /opt/copronomie/docker-compose.prod.yml restart nginx
```

---

## 🚀 Déploiement de l'application

### 1. Configuration GitHub Container Registry
```bash
# Login au registry GitHub (nécessaire pour pull les images)
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

### 2. Premier déploiement
```bash
cd /opt/copronomie

# Pull des images
docker pull ghcr.io/your-username/copronomie-v2-web:latest
docker pull ghcr.io/your-username/copronomie-v2-api:latest

# Lancement des services
docker-compose -f docker-compose.prod.yml up -d

# Vérification des logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. Configuration du système de logs
```bash
# Configuration de la rotation des logs
cat > /etc/logrotate.d/copronomie << 'EOF'
/opt/copronomie/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 644 root root
    postrotate
        docker-compose -f /opt/copronomie/docker-compose.prod.yml restart nginx
    endscript
}
EOF
```

---

## 📊 Monitoring basique

### 1. Script de health check
```bash
# Créer un script de monitoring
cat > /opt/copronomie/health-check.sh << 'EOF'
#!/bin/bash

# Health check de l'API
if ! curl -f -s http://localhost/health > /dev/null; then
    echo "$(date): API Health check failed" >> /opt/copronomie/logs/health.log
    # Redémarrer les services si nécessaire
    docker-compose -f /opt/copronomie/docker-compose.prod.yml restart api
fi

# Health check du frontend
if ! curl -f -s http://localhost > /dev/null; then
    echo "$(date): Frontend Health check failed" >> /opt/copronomie/logs/health.log
    docker-compose -f /opt/copronomie/docker-compose.prod.yml restart web
fi
EOF

chmod +x /opt/copronomie/health-check.sh

# Configurer en cron job (toutes les 5 minutes)
crontab -e
# Ajouter : */5 * * * * /opt/copronomie/health-check.sh
```

### 2. Script de backup
```bash
# Script de sauvegarde des données critiques
cat > /opt/copronomie/backup.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/opt/copronomie/backups/$(date +%Y-%m-%d)"
mkdir -p $BACKUP_DIR

# Backup des logs
tar -czf $BACKUP_DIR/logs.tar.gz /opt/copronomie/logs/

# Backup de la configuration
cp /opt/copronomie/.env $BACKUP_DIR/
cp /opt/copronomie/docker-compose.prod.yml $BACKUP_DIR/

# Nettoyage des anciens backups (garder 7 jours)
find /opt/copronomie/backups/ -type d -mtime +7 -exec rm -rf {} \;
EOF

chmod +x /opt/copronomie/backup.sh

# Backup quotidien à 2h du matin
crontab -e
# Ajouter : 0 2 * * * /opt/copronomie/backup.sh
```

---

## 🔧 Scripts de déploiement

### 1. Script de mise à jour
```bash
cat > /opt/copronomie/deploy.sh << 'EOF'
#!/bin/bash

set -e

echo "🚀 Déploiement Copronomie MVP"

cd /opt/copronomie

# Pull des nouvelles images
echo "📦 Pull des nouvelles images..."
docker pull ghcr.io/your-username/copronomie-v2-web:latest
docker pull ghcr.io/your-username/copronomie-v2-api:latest

# Arrêt des anciens conteneurs
echo "⏹️ Arrêt des services..."
docker-compose -f docker-compose.prod.yml down

# Démarrage des nouveaux conteneurs
echo "▶️ Démarrage des nouveaux services..."
docker-compose -f docker-compose.prod.yml up -d

# Health check
echo "🏥 Health check..."
sleep 30
if curl -f -s http://localhost/health > /dev/null; then
    echo "✅ Déploiement réussi!"
else
    echo "❌ Health check échoué"
    exit 1
fi

# Nettoyage des anciennes images
echo "🧹 Nettoyage..."
docker image prune -f

echo "🎉 Déploiement terminé!"
EOF

chmod +x /opt/copronomie/deploy.sh
```

---

## 📚 Commandes utiles

### Gestion des services
```bash
# Voir les services en cours
docker-compose -f docker-compose.prod.yml ps

# Logs en temps réel
docker-compose -f docker-compose.prod.yml logs -f

# Redémarrer un service
docker-compose -f docker-compose.prod.yml restart api

# Mettre à jour et redéployer
./deploy.sh

# Backup manuel
./backup.sh
```

### Monitoring
```bash
# Usage des ressources
docker stats

# Espace disque
df -h

# Logs système
journalctl -u docker.service -f

# Health check manuel
curl -I http://localhost/health
```

---

## 🔐 Sécurité additionnelle

### Configuration avancée de sécurité
```bash
# Installation de monitoring additionnel
apt install -y nginx-extras

# Configuration rate limiting dans nginx
# (déjà inclus dans nginx.conf)

# Monitoring des tentatives d'intrusion
tail -f /var/log/fail2ban.log

# Mise à jour automatique des certificats SSL
systemctl status snap.certbot.renew.timer
```

---

## 🎯 Checklist de déploiement

### Pré-déploiement
- [ ] VPS configuré avec Ubuntu/Debian
- [ ] Docker et Docker Compose installés
- [ ] Firewall configuré (ports 22, 80, 443)
- [ ] SSL/TLS configuré avec Let's Encrypt
- [ ] Variables d'environnement configurées
- [ ] GitHub Container Registry configuré

### Déploiement
- [ ] Images Docker buildées et pushées
- [ ] Services déployés avec docker-compose
- [ ] Health checks fonctionnels
- [ ] Logs accessibles et rotation configurée
- [ ] Backup automatique configuré

### Post-déploiement
- [ ] Monitoring basique en place
- [ ] Domaine pointé vers le VPS
- [ ] DNS configuré correctement
- [ ] Performance acceptable (<3s)
- [ ] Tests manuels validés

---

## 📞 Troubleshooting

### Problèmes courants
```bash
# Services qui ne démarrent pas
docker-compose -f docker-compose.prod.yml logs

# Problèmes de permissions
sudo chown -R copronomie:copronomie /opt/copronomie

# Certificats SSL expirés
certbot renew --dry-run

# Problèmes de mémoire
free -h
docker system prune -a

# Redémarrage complet
docker-compose -f docker-compose.prod.yml down
docker system prune -a
./deploy.sh
```

**🎯 Infrastructure MVP robuste prête pour le lancement !**