# Tour Package Search Application

A production-grade web application for searching the best tour packages from Russian tour operators by price.

## 📚 Документация

- **[USAGE_GUIDE.md](./USAGE_GUIDE.md)** - Подробная инструкция по использованию приложения
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Руководство по интеграции с API туроператоров
- **[API_PARAMETERS.md](./API_PARAMETERS.md)** - Справочник параметров подключения к API
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Подробное руководство по развертыванию на VPS
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Описание архитектуры приложения
- **[QUICKSTART.md](./QUICKSTART.md)** - Быстрый старт

## Features

- **Comprehensive Search Criteria**: Search tours by departure city, destination country/region, hotel filters, dates, nights, and guest composition
- **Flexible Hotel Filtering**: Search for specific hotels or all hotels in a region
- **Child Guest Support**: Specify exact ages for children
- **Price-Based Ranking**: Results are automatically sorted by total price (cheapest first)
- **Pagination Support**: Limit and offset parameters for result pagination
- **Clean Architecture**: Separation of concerns with dedicated layers for API clients, domain logic, and HTTP controllers
- **Easy API Integration**: Abstract interface allows easy swapping of tour operator APIs
- **Modern Frontend**: Beautiful, responsive UI for searching and viewing results

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│   Frontend      │
│  (HTML/JS)      │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  Express API    │
│  (Controllers)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Tour Search    │
│    Service      │
│ (Domain Logic)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Tour Operator   │
│     Client      │
│  (API Client)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  External API   │
│ (Tour Operators)│
└─────────────────┘
```

### Module Structure

- **`src/types/`**: TypeScript interfaces and type definitions
- **`src/clients/`**: Tour operator API client implementations
  - `tourOperatorClient.ts`: Abstract base class
  - `mockTourOperatorClient.ts`: Mock implementation for development
  - `realTourOperatorClient.ts`: Template for real API integration
- **`src/services/`**: Domain logic for filtering and ranking
- **`src/api/`**: HTTP controllers and routes
- **`src/utils/`**: Validation utilities
- **`src/config.ts`**: Configuration management
- **`public/`**: Frontend static files

## API Design

### Endpoint: `POST /api/tours/search`

#### Request Body

```json
{
  "departureCity": "Moscow",
  "destinationCountry": "Turkey",
  "destinationRegion": "Antalya",
  "hotelFilter": {
    "type": "single",
    "hotelName": "Grand Antalya Resort"
  },
  "departureDate": "2025-06-15",
  "nights": 7,
  "guests": {
    "adults": 2,
    "children": [
      { "age": 5 },
      { "age": 9 }
    ]
  },
  "limit": 20,
  "offset": 0
}
```

#### Response Body

```json
{
  "criteria": {
    "departureCity": "Moscow",
    "destinationCountry": "Turkey",
    "destinationRegion": "Antalya",
    "hotelFilter": {
      "type": "single",
      "hotelName": "Grand Antalya Resort"
    },
    "departureDate": "2025-06-15",
    "nights": 7,
    "guests": {
      "adults": 2,
      "children": [
        { "age": 5 },
        { "age": 9 }
      ]
    },
    "limit": 20,
    "offset": 0
  },
  "results": [
    {
      "tourId": "TOUR-123456",
      "tourOperator": "Coral Travel",
      "hotel": "Grand Antalya Resort",
      "roomType": "Standard Room, All Inclusive",
      "departureDate": "2025-06-15",
      "returnDate": "2025-06-22",
      "nights": 7,
      "guests": {
        "adults": 2,
        "children": [
          { "age": 5 },
          { "age": 9 }
        ]
      },
      "totalPrice": 185000,
      "currency": "RUB"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

### Endpoint: `GET /api/health`

Health check endpoint for monitoring.

## Setup and Installation

### Prerequisites

- Node.js 18+ and npm
- TypeScript 5+

### Installation

1. Clone the repository and navigate to the project directory:
```bash
cd "Agent project"
```

2. Install dependencies:
```bash
npm install
```

3. Copy the example environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=3000
NODE_ENV=development
TOUR_API_BASE_URL=https://api.example-tour-operator.com/v1
TOUR_API_KEY=your-api-key-here
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
MAX_RESULTS_LIMIT=100
DEFAULT_RESULTS_LIMIT=20
```

### Running the Application

#### Development Mode

```bash
npm run dev
```

This starts the server with hot-reload using `ts-node-dev`.

#### Production Mode

1. Build the TypeScript code:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

The application will be available at:
- API: `http://localhost:3000/api`
- Frontend: `http://localhost:3000/index.html`
- Health Check: `http://localhost:3000/api/health`

## Установка на продуктивный VPS

### Требования к серверу

- **ОС**: Ubuntu 20.04+ / Debian 11+ / CentOS 8+ (рекомендуется Ubuntu 22.04)
- **RAM**: минимум 512 MB (рекомендуется 1 GB+)
- **CPU**: 1 ядро (рекомендуется 2+)
- **Диск**: минимум 2 GB свободного места
- **Доступ**: SSH доступ с правами root или sudo

### Шаг 1: Подготовка сервера

#### 1.1. Обновление системы

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

#### 1.2. Установка Node.js 18+

**Вариант A: Через NodeSource (рекомендуется)**

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка установки
node --version  # Должно быть >= 18.0.0
npm --version
```

**Вариант B: Через nvm (для пользователя)**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

#### 1.3. Установка дополнительных инструментов

```bash
# Ubuntu/Debian
sudo apt install -y git build-essential

# CentOS/RHEL
sudo yum groupinstall -y "Development Tools"
sudo yum install -y git
```

### Шаг 2: Установка приложения

#### 2.1. Создание пользователя для приложения (рекомендуется)

```bash
# Создать пользователя
sudo adduser --disabled-password --gecos "" toursearch
sudo su - toursearch
```

#### 2.2. Клонирование репозитория

```bash
# Если используете Git
git clone https://github.com/your-username/tour-package-search.git
cd tour-package-search

# Или загрузите файлы через SCP/SFTP
```

#### 2.3. Установка зависимостей

```bash
npm install --production
```

#### 2.4. Сборка проекта

```bash
npm run build
```

### Шаг 3: Настройка окружения

#### 3.1. Создание файла `.env`

```bash
cp .env.example .env
nano .env
```

#### 3.2. Настройка переменных окружения

```env
# Сервер
PORT=3000
NODE_ENV=production

# API туроператора (замените на реальные значения)
TOUR_API_BASE_URL=https://api.your-tour-operator.com/v1
TOUR_API_KEY=your-api-key-here
TOUR_API_SECRET=your-api-secret-here
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3

# Приложение
MAX_RESULTS_LIMIT=100
DEFAULT_RESULTS_LIMIT=20
```

#### 3.3. Защита файла `.env`

```bash
chmod 600 .env
chown toursearch:toursearch .env
```

### Шаг 4: Настройка systemd для автозапуска

#### 4.1. Создание service файла

```bash
sudo nano /etc/systemd/system/toursearch.service
```

#### 4.2. Содержимое service файла

```ini
[Unit]
Description=Tour Package Search Application
After=network.target

[Service]
Type=simple
User=toursearch
WorkingDirectory=/home/toursearch/tour-package-search
Environment="NODE_ENV=production"
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=toursearch

[Install]
WantedBy=multi-user.target
```

**Примечание**: Замените `/home/toursearch/tour-package-search` на реальный путь к приложению.

#### 4.3. Активация и запуск сервиса

```bash
# Перезагрузка systemd
sudo systemctl daemon-reload

# Включение автозапуска
sudo systemctl enable toursearch

# Запуск сервиса
sudo systemctl start toursearch

# Проверка статуса
sudo systemctl status toursearch

# Просмотр логов
sudo journalctl -u toursearch -f
```

### Шаг 5: Настройка Nginx как reverse proxy

#### 5.1. Установка Nginx

```bash
# Ubuntu/Debian
sudo apt install -y nginx

# CentOS/RHEL
sudo yum install -y nginx
```

#### 5.2. Создание конфигурации

```bash
sudo nano /etc/nginx/sites-available/toursearch
```

**Для Ubuntu/Debian** (создайте симлинк):
```bash
sudo ln -s /etc/nginx/sites-available/toursearch /etc/nginx/sites-enabled/
```

**Для CentOS/RHEL** (создайте в `/etc/nginx/conf.d/toursearch.conf`)

#### 5.3. Конфигурация Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Логи
    access_log /var/log/nginx/toursearch-access.log;
    error_log /var/log/nginx/toursearch-error.log;

    # Увеличение размера тела запроса (если нужно)
    client_max_body_size 10M;

    # Проксирование на Node.js приложение
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
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://localhost:3000;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 5.4. Проверка и перезапуск Nginx

```bash
# Проверка конфигурации
sudo nginx -t

# Перезапуск Nginx
sudo systemctl restart nginx

# Включение автозапуска
sudo systemctl enable nginx
```

### Шаг 6: Настройка SSL сертификата (Let's Encrypt)

#### 6.1. Установка Certbot

```bash
# Ubuntu/Debian
sudo apt install -y certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install -y certbot python3-certbot-nginx
```

#### 6.2. Получение SSL сертификата

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Certbot автоматически:
- Получит сертификат
- Настроит Nginx для HTTPS
- Настроит автоматическое обновление

#### 6.3. Проверка автообновления

```bash
sudo certbot renew --dry-run
```

### Шаг 7: Настройка файрвола

#### 7.1. UFW (Ubuntu/Debian)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

#### 7.2. firewalld (CentOS/RHEL)

```bash
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### Шаг 8: Мониторинг и логирование

#### 8.1. Просмотр логов приложения

```bash
# Systemd логи
sudo journalctl -u toursearch -f

# Последние 100 строк
sudo journalctl -u toursearch -n 100

# Логи за сегодня
sudo journalctl -u toursearch --since today
```

#### 8.2. Просмотр логов Nginx

```bash
# Access лог
sudo tail -f /var/log/nginx/toursearch-access.log

# Error лог
sudo tail -f /var/log/nginx/toursearch-error.log
```

#### 8.3. Проверка статуса сервисов

```bash
# Статус приложения
sudo systemctl status toursearch

# Статус Nginx
sudo systemctl status nginx

# Проверка портов
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

### Шаг 9: Обновление приложения

#### 9.1. Процесс обновления

```bash
# Перейти в директорию приложения
cd /home/toursearch/tour-package-search

# Остановить сервис
sudo systemctl stop toursearch

# Обновить код (если используете Git)
git pull origin main

# Установить зависимости
npm install --production

# Пересобрать проект
npm run build

# Запустить сервис
sudo systemctl start toursearch

# Проверить статус
sudo systemctl status toursearch
```

### Шаг 10: Резервное копирование

#### 10.1. Создание скрипта бэкапа

```bash
sudo nano /usr/local/bin/backup-toursearch.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backup/toursearch"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/home/toursearch/tour-package-search"

mkdir -p $BACKUP_DIR

# Бэкап кода
tar -czf $BACKUP_DIR/code_$DATE.tar.gz -C $APP_DIR .

# Бэкап .env (если нужно)
cp $APP_DIR/.env $BACKUP_DIR/env_$DATE

# Удаление старых бэкапов (старше 7 дней)
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
sudo chmod +x /usr/local/bin/backup-toursearch.sh
```

#### 10.2. Настройка cron для автоматического бэкапа

```bash
sudo crontab -e
```

Добавьте строку (бэкап каждый день в 2:00):
```
0 2 * * * /usr/local/bin/backup-toursearch.sh
```

### Полезные команды

```bash
# Перезапуск приложения
sudo systemctl restart toursearch

# Остановка приложения
sudo systemctl stop toursearch

# Запуск приложения
sudo systemctl start toursearch

# Просмотр логов в реальном времени
sudo journalctl -u toursearch -f

# Проверка использования ресурсов
top -p $(pgrep -f "node dist/index.js")

# Проверка доступности API
curl http://localhost:3000/api/health
curl https://your-domain.com/api/health
```

### Устранение неполадок

#### Приложение не запускается

1. Проверьте логи: `sudo journalctl -u toursearch -n 50`
2. Проверьте `.env` файл: `cat .env`
3. Проверьте права доступа: `ls -la`
4. Проверьте порт: `sudo netstat -tlnp | grep 3000`

#### Nginx возвращает 502 Bad Gateway

1. Проверьте, что приложение запущено: `sudo systemctl status toursearch`
2. Проверьте, что порт 3000 открыт: `curl http://localhost:3000/api/health`
3. Проверьте логи Nginx: `sudo tail -f /var/log/nginx/toursearch-error.log`

#### SSL сертификат не работает

1. Проверьте DNS записи для домена
2. Проверьте, что порты 80 и 443 открыты в файрволе
3. Перезапустите Nginx: `sudo systemctl restart nginx`

### Рекомендации по безопасности

1. **Регулярные обновления**: `sudo apt update && sudo apt upgrade -y`
2. **Fail2ban**: Установите для защиты от брутфорса
3. **Ограничение SSH**: Используйте ключи вместо паролей
4. **Мониторинг**: Настройте мониторинг (например, UptimeRobot)
5. **Логирование**: Регулярно проверяйте логи на подозрительную активность

### Дополнительные улучшения

- **PM2**: Альтернатива systemd для управления процессами Node.js
- **Docker**: Контейнеризация приложения
- **Load Balancer**: Для высокой нагрузки
- **CDN**: Для статических файлов
- **Database**: Для кэширования популярных запросов

## Интеграция с реальными API туроператоров

### Быстрый старт

Для интеграции с реальным API российских туроператоров (Andromeda, Travelata, Level.Travel и др.):

1. **Получите доступ к API** через партнерскую программу выбранной платформы
2. **Настройте переменные окружения** в `.env` (см. раздел ниже)
3. **Адаптируйте клиент** под ваш API (см. `INTEGRATION_GUIDE.md`)
4. **Переключите на реальный клиент** в `src/index.ts`

### Подробное руководство

📖 **Полное руководство по интеграции**: См. [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

В руководстве описаны:
- Параметры подключения для популярных платформ (Andromeda, Travelata, Level.Travel, OnlineTours, TravelLine, HT.KZ)
- Пошаговая инструкция по настройке
- Примеры конфигураций
- Обработка ошибок
- Рекомендации по безопасности и оптимизации

### Параметры подключения

#### Общие параметры (все платформы)

```env
# Базовый URL API
TOUR_API_BASE_URL=https://api.your-tour-operator.com/v1

# API ключ (обязательно)
TOUR_API_KEY=your-api-key-here

# Секретный ключ (если требуется)
TOUR_API_SECRET=your-api-secret-here

# Таймаут запроса в миллисекундах
TOUR_API_TIMEOUT=30000

# Количество попыток при ошибке
TOUR_API_RETRY_ATTEMPTS=3
```

#### Примеры для конкретных платформ

**Andromeda**:
```env
TOUR_API_BASE_URL=https://api.andromeda.ru/v1
TOUR_API_KEY=your-andromeda-api-key
```

**Travelata**:
```env
TOUR_API_BASE_URL=https://api.travelata.ru/v2
TOUR_API_KEY=your-travelata-api-key
```

**Level.Travel**:
```env
TOUR_API_BASE_URL=https://api.level.travel/v1
TOUR_API_KEY=your-level-api-key
TOUR_API_SECRET=your-level-api-secret
```

**OnlineTours**:
```env
TOUR_API_BASE_URL=https://api.onlinetours.ru/api/v1
TOUR_API_KEY=your-onlinetours-api-key
```

**TravelLine**:
```env
TOUR_API_BASE_URL=https://api.travelline.ru/partner/v1
TOUR_API_KEY=your-travelline-api-key
```

**HT.KZ**:
```env
TOUR_API_BASE_URL=https://api.ht.kz/v1
TOUR_API_KEY=your-ht-api-key
```

### Переключение на реальный API

В файле `src/index.ts` замените:

```typescript
// Было (для разработки):
const tourOperatorClient = new MockTourOperatorClient();

// Стало (для продакшена):
import { RealTourOperatorClient } from './clients/realTourOperatorClient';
const tourOperatorClient = new RealTourOperatorClient(config.tourOperator);
```

### Адаптация клиента

Откройте `src/clients/realTourOperatorClient.ts` и адаптируйте:
- Метод аутентификации (Bearer Token, API Key, HMAC и т.д.)
- Маппинг параметров запроса (`mapCriteriaToApiParams`)
- Парсинг ответа API (`parseApiResponse`)

Подробные инструкции см. в [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md).

## Example Requests

### Using cURL

```bash
curl -X POST http://localhost:3000/api/tours/search \
  -H "Content-Type: application/json" \
  -d '{
    "departureCity": "Moscow",
    "destinationCountry": "Turkey",
    "destinationRegion": "Antalya",
    "hotelFilter": {
      "type": "all"
    },
    "departureDate": "2025-06-15",
    "nights": 7,
    "guests": {
      "adults": 2,
      "children": [
        { "age": 5 },
        { "age": 9 }
      ]
    },
    "limit": 10
  }'
```

### Использование веб-интерфейса

1. Откройте `http://localhost:3000/index.html` в браузере
2. Заполните форму поиска:
   - **Город вылета**: например, "Moscow", "Saint Petersburg"
   - **Страна назначения**: например, "Turkey", "Egypt", "UAE"
   - **Регион назначения**: например, "Antalya", "Sharm El Sheikh", "Dubai"
   - **Фильтр отеля**: 
     - "All Hotels" - поиск по всем отелям в регионе
     - "Specific Hotel" - поиск по конкретному отелю (укажите название)
   - **Дата вылета**: выберите дату (должна быть в будущем)
   - **Количество ночей**: например, 7, 10, 14
   - **Взрослые**: количество взрослых (минимум 1)
   - **Дети**: добавьте детей с указанием возраста (0-17 лет)
   - **Лимит результатов**: количество результатов для отображения (по умолчанию 20)
3. Нажмите "Search Tours"
4. Просмотрите результаты, отсортированные по цене (от дешевых к дорогим)

### Использование через API

#### Пример запроса (JavaScript/Fetch)

```javascript
const response = await fetch('http://localhost:3000/api/tours/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    departureCity: 'Moscow',
    destinationCountry: 'Turkey',
    destinationRegion: 'Antalya',
    hotelFilter: {
      type: 'all'  // или 'single' с hotelName
    },
    departureDate: '2025-06-15',
    nights: 7,
    guests: {
      adults: 2,
      children: [
        { age: 5 },
        { age: 9 }
      ]
    },
    limit: 20
  })
});

const data = await response.json();
console.log(data.results); // Массив туров, отсортированных по цене
```

#### Пример запроса (Python)

```python
import requests

url = 'http://localhost:3000/api/tours/search'
data = {
    'departureCity': 'Moscow',
    'destinationCountry': 'Turkey',
    'destinationRegion': 'Antalya',
    'hotelFilter': {
        'type': 'all'
    },
    'departureDate': '2025-06-15',
    'nights': 7,
    'guests': {
        'adults': 2,
        'children': [
            {'age': 5},
            {'age': 9}
        ]
    },
    'limit': 20
}

response = requests.post(url, json=data)
results = response.json()
print(results['results'])  # Массив туров
```

## Code Structure

### Key Components

- **Validation**: Input validation with meaningful error messages
- **Filtering**: Strict filtering ensures all criteria are met
- **Ranking**: Automatic sorting by total price (ascending)
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
- **Type Safety**: Full TypeScript support with strict type checking

### Design Patterns

- **Repository Pattern**: Abstract interface for tour operator clients
- **Service Layer**: Business logic separated from HTTP layer
- **Dependency Injection**: Services and clients injected via constructors

## Документация

- **[README.md](./README.md)** - Основная документация (этот файл)
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Подробное руководство по интеграции с API туроператоров
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Описание архитектуры приложения
- **[QUICKSTART.md](./QUICKSTART.md)** - Быстрый старт

## Параметры конфигурации

### Полный список переменных окружения

| Переменная | Обязательная | По умолчанию | Описание |
|-----------|--------------|--------------|----------|
| `PORT` | Нет | `3000` | Порт сервера |
| `NODE_ENV` | Нет | `development` | Режим работы (`development`/`production`) |
| `TOUR_API_BASE_URL` | Да* | - | Базовый URL API туроператора |
| `TOUR_API_KEY` | Да* | - | API ключ для аутентификации |
| `TOUR_API_SECRET` | Нет | - | Секретный ключ (если требуется) |
| `TOUR_API_TIMEOUT` | Нет | `30000` | Таймаут запроса в миллисекундах |
| `TOUR_API_RETRY_ATTEMPTS` | Нет | `3` | Количество попыток при ошибке |
| `MAX_RESULTS_LIMIT` | Нет | `100` | Максимальное количество результатов |
| `DEFAULT_RESULTS_LIMIT` | Нет | `20` | Количество результатов по умолчанию |

*Обязательны только при использовании реального API (не mock)

### Пример файла `.env`

```env
# Сервер
PORT=3000
NODE_ENV=development

# API туроператора (замените на реальные значения)
TOUR_API_BASE_URL=https://api.example-tour-operator.com/v1
TOUR_API_KEY=your-api-key-here
TOUR_API_SECRET=your-api-secret-here
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3

# Приложение
MAX_RESULTS_LIMIT=100
DEFAULT_RESULTS_LIMIT=20
```

## Валидация запросов

API валидирует все входящие запросы. Примеры ошибок:

### Ошибка валидации (400)

```json
{
  "error": "ValidationError",
  "message": "departureDate must be a future date"
}
```

**Типичные ошибки валидации**:
- `departureCity is required` - не указан город вылета
- `departureDate must be a future date` - дата вылета должна быть в будущем
- `nights must be a positive integer` - количество ночей должно быть положительным числом
- `guests.adults must be a positive integer` - количество взрослых должно быть минимум 1
- `guests.children[0].age must be an integer between 0 and 17` - возраст ребенка должен быть от 0 до 17
- `hotelFilter.hotelName is required when type is "single"` - при выборе конкретного отеля нужно указать название

## Обработка ошибок API

### Ошибка сервера (500)

```json
{
  "error": "InternalServerError",
  "message": "Tour operator API error: Connection timeout"
}
```

**Возможные причины**:
- Проблемы с подключением к API туроператора
- Неверный API ключ
- Превышен таймаут запроса
- Ошибка парсинга ответа API

**Решение**: Проверьте настройки в `.env` и логи сервера.

## Тестирование

Приложение включает mock клиент для разработки и тестирования. Для тестирования с реальными данными интегрируйте реальный API клиент как описано в [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md).

### Запуск в режиме разработки

```bash
npm run dev
```

Используется `MockTourOperatorClient`, который генерирует тестовые данные.

### Тестирование с реальным API

1. Настройте `.env` с реальными параметрами API
2. Адаптируйте `RealTourOperatorClient` под ваш API
3. Переключите на `RealTourOperatorClient` в `src/index.ts`
4. Запустите сервер и протестируйте

## Поддержка

### Полезные ссылки

- **Andromeda**: Свяжитесь через партнерский портал
- **Travelata**: https://www.travelata.ru/partners
- **Level.Travel**: https://www.level.travel/partners
- **TravelLine**: https://www.travelline.ru/about/technical-partners/

### Получение помощи

1. Проверьте документацию в папке проекта
2. Изучите [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) для вопросов по интеграции
3. Проверьте логи приложения на наличие ошибок
4. Обратитесь в поддержку выбранной платформы API

## License

MIT

