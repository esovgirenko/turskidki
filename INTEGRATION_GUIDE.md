# Руководство по интеграции с API туроператоров

## Обзор

Это приложение поддерживает интеграцию с различными API российских туроператоров. В этом документе описаны параметры подключения и инструкции по настройке для популярных платформ.

## Поддерживаемые платформы

### 1. Andromeda (Андромеда)
**Описание**: B2B платформа для агрегации туров от российских туроператоров.

**Параметры подключения**:
```env
TOUR_API_BASE_URL=https://api.andromeda.ru/v1
TOUR_API_KEY=your-andromeda-api-key
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
```

**Особенности**:
- Требуется регистрация и получение API ключа через партнерский портал
- Поддерживает поиск по городам вылета, странам назначения, отелям
- Формат ответа: JSON
- Аутентификация: Bearer Token

**Документация**: Свяжитесь с представителями Andromeda для получения доступа к API документации.

---

### 2. Travelata API
**Описание**: API для поиска туров от различных туроператоров.

**Параметры подключения**:
```env
TOUR_API_BASE_URL=https://api.travelata.ru/v2
TOUR_API_KEY=your-travelata-api-key
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
```

**Особенности**:
- Партнерская программа для турагентств
- Поддержка фильтрации по отелям, датам, количеству гостей
- Формат ответа: JSON
- Аутентификация: API Key в заголовке `X-API-Key`

**Документация**: Доступна в личном кабинете партнера Travelata.

---

### 3. Level.Travel API
**Описание**: API для поиска туров и бронирования.

**Параметры подключения**:
```env
TOUR_API_BASE_URL=https://api.level.travel/v1
TOUR_API_KEY=your-level-api-key
TOUR_API_SECRET=your-level-api-secret
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
```

**Особенности**:
- Требуется API Key и Secret Key для подписи запросов
- Поддержка поиска туров с детальной информацией
- Формат ответа: JSON
- Аутентификация: HMAC подпись запросов

**Документация**: Предоставляется после регистрации в партнерской программе.

---

### 4. OnlineTours API
**Описание**: B2B платформа для турагентств.

**Параметры подключения**:
```env
TOUR_API_BASE_URL=https://api.onlinetours.ru/api/v1
TOUR_API_KEY=your-onlinetours-api-key
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
```

**Особенности**:
- Доступ для зарегистрированных турагентств
- Поиск туров с фильтрацией
- Формат ответа: JSON/XML
- Аутентификация: API Key

---

### 5. TravelLine Partner API
**Описание**: API для работы с отелями и турами.

**Параметры подключения**:
```env
TOUR_API_BASE_URL=https://api.travelline.ru/partner/v1
TOUR_API_KEY=your-travelline-api-key
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
```

**Особенности**:
- Интеграция с каналами продаж
- Получение информации о средствах размещения
- Формат ответа: JSON
- Аутентификация: Bearer Token

**Документация**: https://www.travelline.ru/about/technical-partners/partnership/

---

### 6. HT.KZ API
**Описание**: Казахстанская платформа для поиска туров.

**Параметры подключения**:
```env
TOUR_API_BASE_URL=https://api.ht.kz/v1
TOUR_API_KEY=your-ht-api-key
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
```

**Особенности**:
- Поддержка российских и казахстанских туроператоров
- Поиск туров с детальной информацией
- Формат ответа: JSON

---

## Общие параметры конфигурации

### Переменные окружения

Все параметры настраиваются через файл `.env`:

```env
# Сервер
PORT=3000
NODE_ENV=production

# API туроператора
TOUR_API_BASE_URL=https://api.example-tour-operator.com/v1
TOUR_API_KEY=your-api-key-here
TOUR_API_SECRET=your-api-secret-here  # Если требуется
TOUR_API_TIMEOUT=30000                # Таймаут запроса в миллисекундах
TOUR_API_RETRY_ATTEMPTS=3             # Количество попыток при ошибке

# Приложение
MAX_RESULTS_LIMIT=100                  # Максимальное количество результатов
DEFAULT_RESULTS_LIMIT=20               # Количество результатов по умолчанию
```

### Параметры по умолчанию

| Параметр | Значение по умолчанию | Описание |
|----------|----------------------|----------|
| `PORT` | `3000` | Порт сервера |
| `NODE_ENV` | `development` | Режим работы |
| `TOUR_API_TIMEOUT` | `30000` | Таймаут 30 секунд |
| `TOUR_API_RETRY_ATTEMPTS` | `3` | 3 попытки при ошибке |
| `MAX_RESULTS_LIMIT` | `100` | Максимум результатов |
| `DEFAULT_RESULTS_LIMIT` | `20` | Результатов по умолчанию |

---

## Пошаговая инструкция по интеграции

### Шаг 1: Получение доступа к API

1. **Выберите платформу** из списка выше
2. **Зарегистрируйтесь** в партнерской программе
3. **Получите API ключи**:
   - API Key (обязательно)
   - API Secret (если требуется)
   - Документацию по API

### Шаг 2: Настройка переменных окружения

1. Скопируйте `.env.example` в `.env`:
   ```bash
   cp .env.example .env
   ```

2. Отредактируйте `.env` и укажите параметры вашего API:
   ```env
   TOUR_API_BASE_URL=https://api.your-tour-operator.com/v1
   TOUR_API_KEY=your-actual-api-key
   TOUR_API_SECRET=your-actual-api-secret  # Если требуется
   ```

### Шаг 3: Адаптация клиента под ваш API

Откройте файл `src/clients/realTourOperatorClient.ts` и адаптируйте под ваш API:

#### 3.1. Настройка аутентификации

```typescript
constructor(config: TourOperatorConfig) {
  super();
  this.config = config;
  
  this.axiosInstance = axios.create({
    baseURL: config.baseUrl,
    timeout: config.timeout,
    headers: {
      // Вариант 1: Bearer Token
      'Authorization': `Bearer ${config.apiKey}`,
      
      // Вариант 2: API Key в заголовке
      // 'X-API-Key': config.apiKey,
      
      // Вариант 3: Basic Auth
      // 'Authorization': `Basic ${Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString('base64')}`,
      
      'Content-Type': 'application/json',
    },
  });
}
```

#### 3.2. Маппинг параметров запроса

Обновите метод `mapCriteriaToApiParams()`:

```typescript
private mapCriteriaToApiParams(criteria: TourSearchRequest): unknown {
  return {
    // Пример для Andromeda API
    departure_city_id: this.getCityId(criteria.departureCity),
    country_id: this.getCountryId(criteria.destinationCountry),
    region_id: this.getRegionId(criteria.destinationRegion),
    hotel_id: criteria.hotelFilter.type === 'single' 
      ? this.getHotelId(criteria.hotelFilter.hotelName!) 
      : undefined,
    check_in: this.formatDate(criteria.departureDate),
    nights: criteria.nights,
    adults: criteria.guests.adults,
    children: criteria.guests.children.map(c => c.age),
    limit: criteria.limit || 20,
  };
}
```

**Важно**: Вам нужно будет реализовать методы для преобразования названий в ID:
- `getCityId(cityName: string): number`
- `getCountryId(countryName: string): number`
- `getRegionId(regionName: string): number`
- `getHotelId(hotelName: string): number`

Эти методы могут использовать справочники API или кэш.

#### 3.3. Парсинг ответа API

Обновите метод `parseApiResponse()`:

```typescript
private parseApiResponse(apiData: unknown, criteria: TourSearchRequest): TourOffer[] {
  const offers: TourOffer[] = [];
  
  // Структура ответа зависит от вашего API
  const results = (apiData as { tours?: unknown[] }).tours || [];
  
  for (const tour of results) {
    const t = tour as Record<string, unknown>;
    offers.push({
      tourId: String(t.id || t.tour_id || ''),
      tourOperator: String(t.operator_name || t.operator || ''),
      hotel: String(t.hotel_name || t.hotel || ''),
      roomType: String(t.room_type || t.room || ''),
      departureDate: String(t.departure_date || criteria.departureDate),
      returnDate: String(t.return_date || this.calculateReturnDate(criteria.departureDate, criteria.nights)),
      nights: Number(t.nights || criteria.nights),
      guests: {
        adults: criteria.guests.adults,
        children: [...criteria.guests.children],
      },
      totalPrice: Number(t.total_price || t.price || 0),
      currency: String(t.currency || 'RUB'),
      rawData: tour, // Сохраняем оригинальные данные для отладки
    });
  }
  
  return offers;
}
```

### Шаг 4: Переключение на реальный клиент

Откройте `src/index.ts` и замените:

```typescript
// Было:
const tourOperatorClient = new MockTourOperatorClient();

// Стало:
const tourOperatorClient = new RealTourOperatorClient(config.tourOperator);
```

Также раскомментируйте импорт:
```typescript
import { RealTourOperatorClient } from './clients/realTourOperatorClient';
```

### Шаг 5: Тестирование

1. Запустите сервер:
   ```bash
   npm run dev
   ```

2. Проверьте подключение:
   ```bash
   curl http://localhost:3000/api/health
   ```

3. Выполните тестовый поиск через API или веб-интерфейс

4. Проверьте логи на наличие ошибок

---

## Обработка ошибок API

### Типичные ошибки и решения

#### 401 Unauthorized
**Причина**: Неверный API ключ или истекший токен
**Решение**: 
- Проверьте правильность `TOUR_API_KEY` в `.env`
- Обновите токен, если используется OAuth

#### 403 Forbidden
**Причина**: Недостаточно прав доступа
**Решение**: 
- Проверьте права вашего API ключа
- Свяжитесь с поддержкой API для расширения доступа

#### 404 Not Found
**Причина**: Неверный URL или endpoint
**Решение**: 
- Проверьте `TOUR_API_BASE_URL`
- Убедитесь, что используете правильную версию API

#### 429 Too Many Requests
**Причина**: Превышен лимит запросов
**Решение**: 
- Увеличьте `TOUR_API_RETRY_ATTEMPTS`
- Добавьте задержку между запросами
- Используйте кэширование

#### 500 Internal Server Error
**Причина**: Ошибка на стороне API
**Решение**: 
- Повторите запрос (автоматически через retry)
- Свяжитесь с поддержкой API

---

## Кэширование и оптимизация

### Рекомендации по производительности

1. **Кэширование справочников**:
   - Города, страны, регионы, отели
   - Обновлять раз в день или при необходимости

2. **Кэширование результатов поиска**:
   - Кэшировать популярные запросы на 5-15 минут
   - Использовать Redis или in-memory cache

3. **Параллельные запросы**:
   - Если API поддерживает, делайте запросы параллельно
   - Используйте `Promise.all()` для нескольких источников

---

## Безопасность

### Рекомендации

1. **Храните секреты в `.env`**:
   - Никогда не коммитьте `.env` в Git
   - Используйте `.env.example` для шаблона

2. **Используйте HTTPS**:
   - Всегда используйте HTTPS для API запросов
   - Проверяйте SSL сертификаты

3. **Ограничьте доступ**:
   - Используйте firewall для ограничения доступа к API
   - Реализуйте rate limiting

4. **Логирование**:
   - Не логируйте API ключи
   - Логируйте только необходимую информацию

---

## Поддержка и контакты

### Полезные ссылки

- **Andromeda**: Свяжитесь через партнерский портал
- **Travelata**: https://www.travelata.ru/partners
- **Level.Travel**: https://www.level.travel/partners
- **TravelLine**: https://www.travelline.ru/about/technical-partners/

### Получение помощи

1. Проверьте документацию вашего API
2. Обратитесь в поддержку партнерской программы
3. Проверьте логи приложения на наличие ошибок

---

## Примеры конфигураций

### Пример 1: Andromeda

```env
TOUR_API_BASE_URL=https://api.andromeda.ru/v1
TOUR_API_KEY=andromeda_abc123xyz789
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
```

### Пример 2: Travelata

```env
TOUR_API_BASE_URL=https://api.travelata.ru/v2
TOUR_API_KEY=travelata_key_123456
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
```

### Пример 3: Level.Travel

```env
TOUR_API_BASE_URL=https://api.level.travel/v1
TOUR_API_KEY=level_key_abc123
TOUR_API_SECRET=level_secret_xyz789
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
```

---

## Часто задаваемые вопросы

### Как получить API ключ?

Свяжитесь с представителями выбранной платформы через партнерскую программу. Обычно требуется регистрация как турагентство или партнер.

### Можно ли использовать несколько API одновременно?

Да, можно создать несколько клиентов и объединять результаты. Для этого нужно модифицировать `TourSearchService`.

### Как обрабатывать разные форматы ответов?

Каждый API может иметь свой формат. Адаптируйте метод `parseApiResponse()` под конкретный формат вашего API.

### Что делать, если API требует другую аутентификацию?

Измените заголовки в конструкторе `RealTourOperatorClient` под требования вашего API (OAuth, HMAC подпись и т.д.).

