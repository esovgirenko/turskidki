# Руководство по развертыванию на VPS

Подробная инструкция по установке и настройке приложения на продуктивном VPS сервере.

## Содержание

1. [Требования](#требования)
2. [Подготовка сервера](#подготовка-сервера)
3. [Установка приложения](#установка-приложения)
4. [Настройка systemd](#настройка-systemd)
5. [Настройка Nginx](#настройка-nginx)
6. [Настройка SSL](#настройка-ssl)
7. [Мониторинг](#мониторинг)
8. [Обновление](#обновление)
9. [Резервное копирование](#резервное-копирование)
10. [Безопасность](#безопасность)

---

## Требования

### Минимальные требования

- **ОС**: Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- **RAM**: 512 MB
- **CPU**: 1 ядро
- **Диск**: 2 GB свободного места
- **Сеть**: Статический IP адрес

### Рекомендуемые требования

- **ОС**: Ubuntu 22.04 LTS
- **RAM**: 1 GB+
- **CPU**: 2+ ядра
- **Диск**: 10 GB+ SSD
- **Сеть**: Статический IP + доменное имя

---

## Подготовка сервера

### 1. Подключение к серверу

```bash
ssh root@your-server-ip
# или
ssh your-username@your-server-ip
```

### 2. Обновление системы

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl wget git build-essential
```

**CentOS/RHEL:**
```bash
sudo yum update -y
sudo yum groupinstall -y "Development Tools"
sudo yum install -y curl wget git
```

### 3. Установка Node.js

#### Вариант A: Через NodeSource (рекомендуется)

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**CentOS/RHEL:**
```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

#### Вариант B: Через nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
nvm alias default 18
```

#### Проверка установки

```bash
node --version  # Должно быть >= 18.0.0
npm --version   # Должно быть >= 9.0.0
```

### 4. Создание пользователя для приложения

```bash
# Создать пользователя
sudo adduser --disabled-password --gecos "" toursearch

# Добавить в группу sudo (если нужно)
sudo usermod -aG sudo toursearch

# Переключиться на пользователя
sudo su - toursearch
```

---

## Установка приложения

### 1. Клонирование репозитория

```bash
# Перейти в домашнюю директорию
cd ~

# Клонировать репозиторий
git clone https://github.com/your-username/tour-package-search.git
cd tour-package-search

# Или загрузить файлы через SCP/SFTP
```

### 2. Установка зависимостей

```bash
# Установить только production зависимости
npm install --production

# Или все зависимости (если нужны dev зависимости для сборки)
npm install
```

### 3. Сборка проекта

```bash
npm run build
```

Проверьте, что папка `dist/` создана:
```bash
ls -la dist/
```

### 4. Настройка переменных окружения

```bash
# Скопировать пример
cp .env.example .env

# Отредактировать
nano .env
```

**Минимальная конфигурация для продакшена:**

```env
PORT=3000
NODE_ENV=production

# API туроператора
TOUR_API_BASE_URL=https://api.your-tour-operator.com/v1
TOUR_API_KEY=your-api-key-here
TOUR_API_SECRET=your-api-secret-here
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3

# Приложение
MAX_RESULTS_LIMIT=100
DEFAULT_RESULTS_LIMIT=20
```

**Защита файла .env:**
```bash
chmod 600 .env
```

### 5. Тестовый запуск

```bash
# Запустить вручную для проверки
node dist/index.js
```

Если все работает, остановите процесс (Ctrl+C) и переходите к настройке systemd.

---

## Настройка systemd

### 1. Создание service файла

```bash
sudo nano /etc/systemd/system/toursearch.service
```

### 2. Содержимое service файла

```ini
[Unit]
Description=Tour Package Search Application
Documentation=https://github.com/your-username/tour-package-search
After=network.target

[Service]
Type=simple
User=toursearch
Group=toursearch
WorkingDirectory=/home/toursearch/tour-package-search
Environment="NODE_ENV=production"
Environment="PATH=/usr/bin:/usr/local/bin"
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=toursearch

# Ограничения ресурсов (опционально)
LimitNOFILE=65536
MemoryMax=512M

[Install]
WantedBy=multi-user.target
```

**Важно**: Замените `/home/toursearch/tour-package-search` на реальный путь к вашему приложению.

### 3. Активация сервиса

```bash
# Перезагрузить systemd
sudo systemctl daemon-reload

# Включить автозапуск
sudo systemctl enable toursearch

# Запустить сервис
sudo systemctl start toursearch

# Проверить статус
sudo systemctl status toursearch
```

### 4. Полезные команды

```bash
# Перезапуск
sudo systemctl restart toursearch

# Остановка
sudo systemctl stop toursearch

# Запуск
sudo systemctl start toursearch

# Просмотр логов
sudo journalctl -u toursearch -f
sudo journalctl -u toursearch -n 100
```

---

## Настройка Nginx

### 1. Установка Nginx

**Ubuntu/Debian:**
```bash
sudo apt install -y nginx
```

**CentOS/RHEL:**
```bash
sudo yum install -y nginx
```

### 2. Создание конфигурации

**Ubuntu/Debian:**
```bash
sudo nano /etc/nginx/sites-available/toursearch
```

**CentOS/RHEL:**
```bash
sudo nano /etc/nginx/conf.d/toursearch.conf
```

### 3. Конфигурация Nginx

```nginx
# HTTP -> HTTPS редирект
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS сервер
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL сертификаты (настроятся автоматически через Certbot)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL настройки
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Логи
    access_log /var/log/nginx/toursearch-access.log;
    error_log /var/log/nginx/toursearch-error.log;

    # Увеличение размера тела запроса
    client_max_body_size 10M;

    # Безопасность
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Проксирование на Node.js
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
        
        # Таймауты
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Кэширование статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Health check endpoint (без кэширования)
    location /api/health {
        proxy_pass http://localhost:3000;
        access_log off;
    }
}
```

### 4. Активация конфигурации (Ubuntu/Debian)

```bash
# Создать симлинк
sudo ln -s /etc/nginx/sites-available/toursearch /etc/nginx/sites-enabled/

# Удалить дефолтную конфигурацию (опционально)
sudo rm /etc/nginx/sites-enabled/default
```

### 5. Проверка и перезапуск

```bash
# Проверить конфигурацию
sudo nginx -t

# Перезапустить Nginx
sudo systemctl restart nginx

# Включить автозапуск
sudo systemctl enable nginx

# Проверить статус
sudo systemctl status nginx
```

---

## Настройка SSL

### 1. Установка Certbot

**Ubuntu/Debian:**
```bash
sudo apt install -y certbot python3-certbot-nginx
```

**CentOS/RHEL:**
```bash
sudo yum install -y certbot python3-certbot-nginx
```

### 2. Получение SSL сертификата

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Certbot автоматически:
- Получит сертификат от Let's Encrypt
- Настроит Nginx для HTTPS
- Настроит автоматическое обновление

### 3. Проверка автообновления

```bash
# Тестовый запуск обновления
sudo certbot renew --dry-run

# Проверка cron задачи
sudo systemctl status certbot.timer
```

### 4. Ручное обновление (если нужно)

```bash
sudo certbot renew
sudo systemctl reload nginx
```

---

## Мониторинг

### 1. Просмотр логов приложения

```bash
# В реальном времени
sudo journalctl -u toursearch -f

# Последние 100 строк
sudo journalctl -u toursearch -n 100

# За сегодня
sudo journalctl -u toursearch --since today

# За последний час
sudo journalctl -u toursearch --since "1 hour ago"
```

### 2. Просмотр логов Nginx

```bash
# Access лог
sudo tail -f /var/log/nginx/toursearch-access.log

# Error лог
sudo tail -f /var/log/nginx/toursearch-error.log

# Все логи Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 3. Мониторинг ресурсов

```bash
# Использование CPU и памяти
top -p $(pgrep -f "node dist/index.js")

# Или с htop (если установлен)
htop -p $(pgrep -f "node dist/index.js")

# Использование диска
df -h

# Использование памяти
free -h
```

### 4. Проверка доступности

```bash
# Локально
curl http://localhost:3000/api/health

# Через домен
curl https://your-domain.com/api/health

# С подробным выводом
curl -v https://your-domain.com/api/health
```

### 5. Настройка внешнего мониторинга

Используйте сервисы типа:
- **UptimeRobot**: https://uptimerobot.com
- **Pingdom**: https://www.pingdom.com
- **StatusCake**: https://www.statuscake.com

Настройте мониторинг endpoint: `https://your-domain.com/api/health`

---

## Обновление

### Процесс обновления

```bash
# 1. Перейти в директорию приложения
cd /home/toursearch/tour-package-search

# 2. Остановить сервис
sudo systemctl stop toursearch

# 3. Создать бэкап (рекомендуется)
cp -r . ../toursearch-backup-$(date +%Y%m%d)

# 4. Обновить код
git pull origin main
# или загрузить новые файлы через SCP/SFTP

# 5. Установить зависимости
npm install --production

# 6. Пересобрать проект
npm run build

# 7. Проверить .env (если нужно обновить)
nano .env

# 8. Запустить сервис
sudo systemctl start toursearch

# 9. Проверить статус
sudo systemctl status toursearch

# 10. Проверить логи
sudo journalctl -u toursearch -f
```

### Автоматический скрипт обновления

Создайте файл `/usr/local/bin/update-toursearch.sh`:

```bash
#!/bin/bash
set -e

APP_DIR="/home/toursearch/tour-package-search"
cd $APP_DIR

echo "Stopping service..."
sudo systemctl stop toursearch

echo "Creating backup..."
BACKUP_DIR="../toursearch-backup-$(date +%Y%m%d_%H%M%S)"
cp -r . $BACKUP_DIR

echo "Updating code..."
git pull origin main

echo "Installing dependencies..."
npm install --production

echo "Building..."
npm run build

echo "Starting service..."
sudo systemctl start toursearch

echo "Checking status..."
sleep 2
sudo systemctl status toursearch

echo "Update completed!"
```

Сделайте исполняемым:
```bash
sudo chmod +x /usr/local/bin/update-toursearch.sh
```

Использование:
```bash
sudo /usr/local/bin/update-toursearch.sh
```

---

## Резервное копирование

### 1. Создание скрипта бэкапа

```bash
sudo nano /usr/local/bin/backup-toursearch.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backup/toursearch"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/home/toursearch/tour-package-search"

# Создать директорию для бэкапов
mkdir -p $BACKUP_DIR

# Бэкап кода
echo "Backing up code..."
tar -czf $BACKUP_DIR/code_$DATE.tar.gz -C $APP_DIR .

# Бэкап .env (без коммита в Git)
echo "Backing up .env..."
cp $APP_DIR/.env $BACKUP_DIR/env_$DATE 2>/dev/null || echo "No .env file"

# Бэкап конфигурации Nginx
echo "Backing up Nginx config..."
sudo tar -czf $BACKUP_DIR/nginx_$DATE.tar.gz -C /etc/nginx sites-available sites-enabled conf.d 2>/dev/null || true

# Бэкап systemd service
echo "Backing up systemd service..."
sudo cp /etc/systemd/system/toursearch.service $BACKUP_DIR/toursearch.service.$DATE 2>/dev/null || true

# Удаление старых бэкапов (старше 7 дней)
echo "Cleaning old backups..."
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
ls -lh $BACKUP_DIR | tail -5
```

Сделайте исполняемым:
```bash
sudo chmod +x /usr/local/bin/backup-toursearch.sh
```

### 2. Настройка автоматического бэкапа

```bash
sudo crontab -e
```

Добавьте строку (бэкап каждый день в 2:00):
```
0 2 * * * /usr/local/bin/backup-toursearch.sh >> /var/log/toursearch-backup.log 2>&1
```

### 3. Восстановление из бэкапа

```bash
# Остановить сервис
sudo systemctl stop toursearch

# Восстановить код
cd /home/toursearch
tar -xzf /backup/toursearch/code_YYYYMMDD_HHMMSS.tar.gz -C tour-package-search

# Восстановить .env
cp /backup/toursearch/env_YYYYMMDD_HHMMSS /home/toursearch/tour-package-search/.env

# Пересобрать и запустить
cd tour-package-search
npm install --production
npm run build
sudo systemctl start toursearch
```

---

## Безопасность

### 1. Настройка файрвола

**UFW (Ubuntu/Debian):**
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status verbose
```

**firewalld (CentOS/RHEL):**
```bash
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
```

### 2. Настройка SSH

```bash
# Отключить вход по паролю (использовать только ключи)
sudo nano /etc/ssh/sshd_config
```

Измените:
```
PasswordAuthentication no
PubkeyAuthentication yes
```

Перезапустите SSH:
```bash
sudo systemctl restart sshd
```

### 3. Установка Fail2ban

```bash
# Установка
sudo apt install -y fail2ban  # Ubuntu/Debian
sudo yum install -y fail2ban  # CentOS/RHEL

# Настройка
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
sudo systemctl status fail2ban
```

### 4. Регулярные обновления

```bash
# Настроить автоматические обновления безопасности
sudo apt install -y unattended-upgrades  # Ubuntu/Debian
sudo yum install -y yum-cron            # CentOS/RHEL
```

### 5. Ограничение доступа к .env

```bash
chmod 600 /home/toursearch/tour-package-search/.env
chown toursearch:toursearch /home/toursearch/tour-package-search/.env
```

### 6. Мониторинг безопасности

- Регулярно проверяйте логи на подозрительную активность
- Используйте инструменты типа `rkhunter` для проверки на руткиты
- Настройте уведомления о критических обновлениях

---

## Альтернативные варианты развертывания

### PM2 вместо systemd

```bash
# Установка PM2
sudo npm install -g pm2

# Запуск приложения
pm2 start dist/index.js --name toursearch

# Сохранение конфигурации
pm2 save

# Настройка автозапуска
pm2 startup
```

### Docker

Создайте `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Kubernetes

Для масштабируемых развертываний используйте Kubernetes с соответствующими манифестами.

---

## Устранение неполадок

### Приложение не запускается

1. Проверьте логи: `sudo journalctl -u toursearch -n 50`
2. Проверьте .env: `cat .env`
3. Проверьте права: `ls -la`
4. Проверьте порт: `sudo netstat -tlnp | grep 3000`

### Nginx 502 Bad Gateway

1. Проверьте статус приложения: `sudo systemctl status toursearch`
2. Проверьте локальный доступ: `curl http://localhost:3000/api/health`
3. Проверьте логи Nginx: `sudo tail -f /var/log/nginx/toursearch-error.log`
4. Проверьте конфигурацию: `sudo nginx -t`

### Высокое использование памяти

1. Проверьте процессы: `top` или `htop`
2. Ограничьте память в systemd service файле
3. Рассмотрите использование PM2 с ограничениями

### Проблемы с SSL

1. Проверьте DNS записи: `dig your-domain.com`
2. Проверьте порты: `sudo netstat -tlnp | grep 443`
3. Проверьте сертификат: `sudo certbot certificates`
4. Обновите сертификат: `sudo certbot renew`

---

## Полезные ссылки

- [Node.js Production Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Systemd Documentation](https://www.freedesktop.org/software/systemd/man/)

