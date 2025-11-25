# Guide de Déploiement Production - UniConvert AI

## Vue d'ensemble
Ce document détaille toutes les étapes nécessaires pour déployer UniConvert AI sur un VPS Ubuntu en production.

## Prérequis Système
- Ubuntu 20.04 LTS ou 22.04 LTS
- 4GB RAM minimum (8GB recommandé)
- 2 CPU minimum (4 CPU recommandé)
- 50GB espace disque minimum
- Accès root ou sudo

## 1. Configuration Initiale du Serveur

### Mise à jour du système
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl wget git nano ufw software-properties-common -y
```

### Configuration du firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Installation Node.js 22.x
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Installation PM2 pour la gestion des processus
```bash
sudo npm install -g pm2
```

## 2. Installation des Dépendances Système

### Outils de compilation et bibliothèques
```bash
sudo apt install build-essential gcc g++ make python3 python3-pip -y
sudo apt install libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y
```

### FFmpeg pour la conversion vidéo/audio
```bash
sudo apt update
sudo apt install ffmpeg -y
```

### LibreOffice pour la conversion de documents
```bash
sudo apt install libreoffice libreoffice-common -y
```

### ImageMagick pour la conversion d'images
```bash
sudo apt install imagemagick -y
```

### Outils supplémentaires
```bash
sudo apt install pandoc unoconv ghostscript -y
```

## 3. Configuration Nginx

### Installation Nginx
```bash
sudo apt install nginx -y
```

### Configuration du site
Créer le fichier `/etc/nginx/sites-available/uniconvert`:
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Activation du site
```bash
sudo ln -s /etc/nginx/sites-available/uniconvert /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 4. Configuration SSL avec Let's Encrypt

### Installation Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Obtention du certificat
```bash
sudo certbot --nginx -d uniconvert.app
```

## 5. Installation et Configuration de la Base de Données

### PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Configuration de la base de données
```bash
sudo -u postgres psql
CREATE DATABASE uniconvert;
CREATE USER uniconvert WITH PASSWORD 'votre_mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE uniconvert TO uniconvert;
\q
```

### Redis pour le cache et les sessions
```bash
sudo apt install redis-server -y
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

## 6. Configuration du Projet

### Création de l'utilisateur dédié
```bash
sudo adduser uniconvert
sudo usermod -aG sudo uniconvert
```

### Installation du projet
```bash
cd /home/uniconvert
git clone https://github.com/votre-repo/uniconvert.git
cd uniconvert
```

### Installation des dépendances
```bash
npm install
npm run build
```

### Configuration des variables d'environnement
Créer le fichier `.env.production`:
```env
NODE_ENV=production
PORT=5000
CLIENT_PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=uniconvert
DB_USER=uniconvert
DB_PASSWORD=votre_mot_de_passe_securise

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=votre_secret_jwt_tres_long_et_securise

# Stripe
STRIPE_SECRET_KEY=sk_live_votre_cle_stripe
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret

# File Storage
UPLOAD_DIR=/home/uniconvert/uploads
MAX_FILE_SIZE=104857600
FILE_RETENTION_HOURS=24

# Email (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 7. Configuration des Services PM2

### Création des fichiers de configuration PM2

#### Frontend PM2 config (`ecosystem-frontend.config.js`):
```javascript
module.exports = {
  apps: [{
    name: 'uniconvert-frontend',
    script: 'npm',
    args: 'run preview',
    cwd: '/home/uniconvert/uniconvert',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

#### Backend PM2 config (`ecosystem-backend.config.js`):
```javascript
module.exports = {
  apps: [{
    name: 'uniconvert-backend',
    script: 'npm',
    args: 'run server:dev',
    cwd: '/home/uniconvert/uniconvert',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    instances: 2,
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '2G',
    env_file: '/home/uniconvert/uniconvert/.env.production'
  }]
};
```

### Démarrage des services
```bash
pm2 start ecosystem-frontend.config.js
pm2 start ecosystem-backend.config.js
pm2 save
pm2 startup
```

## 8. Configuration du Nettoyage Automatique

### Script de nettoyage des fichiers temporaires
Créer `/home/uniconvert/cleanup.sh`:
```bash
#!/bin/bash
# Nettoyage des fichiers temporaires de plus de 24h
find /home/uniconvert/uploads -type f -mtime +1 -delete
find /tmp/uniconvert -type f -mtime +1 -delete 2>/dev/null
```

### Configuration du cron job
```bash
chmod +x /home/uniconvert/cleanup.sh
(crontab -l 2>/dev/null; echo "0 2 * * * /home/uniconvert/cleanup.sh") | crontab -
```

## 9. Monitoring et Logs

### Installation de monitoring
```bash
sudo apt install htop iotop nethogs -y
```

### Configuration des logs PM2
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## 10. Sécurité Additionnelle

### Configuration Fail2ban
```bash
sudo apt install fail2ban -y
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### Mise à jour automatique des paquets
```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 11. Vérification du Déploiement

### Vérifier les services
```bash
sudo systemctl status nginx
sudo systemctl status postgresql
sudo systemctl status redis-server
pm2 status
```

### Tester les conversions
- Upload d'un fichier test
- Vérification de la conversion
- Test du téléchargement

## 12. Maintenance

### Mises à jour régulières
```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Mise à jour de l'application
cd /home/uniconvert/uniconvert
git pull origin main
npm install
npm run build
pm2 restart all
```

### Backup de la base de données
```bash
# Backup quotidien
pg_dump uniconvert > /home/uniconvert/backups/uniconvert_$(date +%Y%m%d).sql
```

## Points de Vigilance

1. **Sécurité** : Toujours utiliser HTTPS en production
2. **Performance** : Monitorer l'utilisation CPU/RAM lors des conversions
3. **Stockage** : S'assurer d'avoir assez d'espace pour les fichiers temporaires
4. **Limite de fichiers** : Configurer Nginx et l'application pour gérer les gros fichiers
5. **Nettoyage** : Le script de nettoyage automatique est crucial pour éviter le remplissage du disque

## Support et Dépannage

### Logs importants
- Application : `~/.pm2/logs/`
- Nginx : `/var/log/nginx/`
- Système : `/var/log/syslog`

### Commandes utiles
```bash
# Redémarrer les services
pm2 restart all
sudo systemctl restart nginx

# Voir les logs en temps réel
pm2 logs
sudo tail -f /var/log/nginx/error.log
```

Ce guide couvre l'ensemble des installations nécessaires pour un déploiement production robuste et sécurisé d'UniConvert AI sur Ubuntu.