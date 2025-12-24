# Параметры подключения к API туроператоров

## Быстрая справка

### Обязательные параметры

| Параметр | Описание | Пример |
|----------|----------|--------|
| `TOUR_API_BASE_URL` | Базовый URL API | `https://api.andromeda.ru/v1` |
| `TOUR_API_KEY` | API ключ для аутентификации | `your-api-key-here` |

### Опциональные параметры

| Параметр | По умолчанию | Описание |
|----------|--------------|----------|
| `TOUR_API_SECRET` | - | Секретный ключ (если требуется) |
| `TOUR_API_TIMEOUT` | `30000` | Таймаут в миллисекундах (30 сек) |
| `TOUR_API_RETRY_ATTEMPTS` | `3` | Количество попыток при ошибке |

---

## Параметры для конкретных платформ

### 1. Andromeda (Андромеда)

```env
TOUR_API_BASE_URL=https://api.andromeda.ru/v1
TOUR_API_KEY=your-andromeda-api-key
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
```

**Особенности**:
- Аутентификация: Bearer Token
- Формат: JSON
- Получение доступа: через партнерский портал

---

### 2. Travelata

```env
TOUR_API_BASE_URL=https://api.travelata.ru/v2
TOUR_API_KEY=your-travelata-api-key
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
```

**Особенности**:
- Аутентификация: API Key в заголовке `X-API-Key`
- Формат: JSON
- Получение доступа: партнерская программа для турагентств

---

### 3. Level.Travel

```env
TOUR_API_BASE_URL=https://api.level.travel/v1
TOUR_API_KEY=your-level-api-key
TOUR_API_SECRET=your-level-api-secret
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
```

**Особенности**:
- Аутентификация: HMAC подпись (требуется API Key + Secret)
- Формат: JSON
- Получение доступа: партнерская программа

---

### 4. OnlineTours

```env
TOUR_API_BASE_URL=https://api.onlinetours.ru/api/v1
TOUR_API_KEY=your-onlinetours-api-key
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
```

**Особенности**:
- Аутентификация: API Key
- Формат: JSON/XML
- Получение доступа: для зарегистрированных турагентств

---

### 5. TravelLine Partner API

```env
TOUR_API_BASE_URL=https://api.travelline.ru/partner/v1
TOUR_API_KEY=your-travelline-api-key
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
```

**Особенности**:
- Аутентификация: Bearer Token
- Формат: JSON
- Получение доступа: https://www.travelline.ru/about/technical-partners/partnership/

---

### 6. HT.KZ

```env
TOUR_API_BASE_URL=https://api.ht.kz/v1
TOUR_API_KEY=your-ht-api-key
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
```

**Особенности**:
- Аутентификация: API Key
- Формат: JSON
- Получение доступа: через партнерскую программу

---

## Полный список параметров конфигурации

### Сервер

| Переменная | Обязательная | По умолчанию | Описание |
|-----------|--------------|--------------|----------|
| `PORT` | Нет | `3000` | Порт сервера |
| `NODE_ENV` | Нет | `development` | Режим работы |

### API туроператора

| Переменная | Обязательная* | По умолчанию | Описание |
|-----------|---------------|--------------|----------|
| `TOUR_API_BASE_URL` | Да* | - | Базовый URL API |
| `TOUR_API_KEY` | Да* | - | API ключ |
| `TOUR_API_SECRET` | Нет | - | Секретный ключ |
| `TOUR_API_TIMEOUT` | Нет | `30000` | Таймаут (мс) |
| `TOUR_API_RETRY_ATTEMPTS` | Нет | `3` | Количество попыток |

*Обязательны только при использовании реального API (не mock)

### Приложение

| Переменная | Обязательная | По умолчанию | Описание |
|-----------|--------------|--------------|----------|
| `MAX_RESULTS_LIMIT` | Нет | `100` | Максимум результатов |
| `DEFAULT_RESULTS_LIMIT` | Нет | `20` | Результатов по умолчанию |

---

## Примеры конфигураций

### Минимальная конфигурация (для разработки с mock)

```env
PORT=3000
NODE_ENV=development
```

### Конфигурация для Andromeda

```env
PORT=3000
NODE_ENV=production
TOUR_API_BASE_URL=https://api.andromeda.ru/v1
TOUR_API_KEY=andromeda_abc123xyz789
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
MAX_RESULTS_LIMIT=100
DEFAULT_RESULTS_LIMIT=20
```

### Конфигурация для Travelata

```env
PORT=3000
NODE_ENV=production
TOUR_API_BASE_URL=https://api.travelata.ru/v2
TOUR_API_KEY=travelata_key_123456
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
MAX_RESULTS_LIMIT=100
DEFAULT_RESULTS_LIMIT=20
```

### Конфигурация для Level.Travel

```env
PORT=3000
NODE_ENV=production
TOUR_API_BASE_URL=https://api.level.travel/v1
TOUR_API_KEY=level_key_abc123
TOUR_API_SECRET=level_secret_xyz789
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
MAX_RESULTS_LIMIT=100
DEFAULT_RESULTS_LIMIT=20
```

---

## Настройка в коде

Параметры загружаются автоматически из `.env` файла через `src/config.ts`:

```typescript
const config = loadConfig();
// config.tourOperator.baseUrl
// config.tourOperator.apiKey
// config.tourOperator.timeout
// config.tourOperator.retryAttempts
```

---

## Безопасность

⚠️ **Важно**: 
- Никогда не коммитьте `.env` файл в Git
- Храните API ключи в секретах (для продакшена используйте переменные окружения сервера)
- Используйте разные ключи для разработки и продакшена

---

## Получение API ключей

Для получения доступа к API свяжитесь с представителями выбранной платформы:

- **Andromeda**: Партнерский портал
- **Travelata**: https://www.travelata.ru/partners
- **Level.Travel**: https://www.level.travel/partners
- **TravelLine**: https://www.travelline.ru/about/technical-partners/
- **OnlineTours**: Партнерская программа
- **HT.KZ**: Партнерская программа

---

## Дополнительная информация

- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Подробное руководство по интеграции
- [USAGE_GUIDE.md](./USAGE_GUIDE.md) - Инструкция по использованию
- [README.md](./README.md) - Основная документация

