# Подробная инструкция по использованию

## Содержание

1. [Быстрый старт](#быстрый-старт)
2. [Установка и настройка](#установка-и-настройка)
3. [Использование веб-интерфейса](#использование-веб-интерфейса)
4. [Использование API](#использование-api)
5. [Примеры запросов](#примеры-запросов)
6. [Обработка результатов](#обработка-результатов)
7. [Часто задаваемые вопросы](#часто-задаваемые-вопросы)

---

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка окружения

```bash
cp .env.example .env
```

Отредактируйте `.env` и укажите параметры (для разработки можно оставить значения по умолчанию).

### 3. Запуск сервера

**Режим разработки** (с hot-reload):
```bash
npm run dev
```

**Продакшн режим**:
```bash
npm run build
npm start
```

### 4. Открытие приложения

Откройте в браузере: `http://localhost:3000/index.html`

---

## Установка и настройка

### Требования

- **Node.js**: версия 18 или выше
- **npm**: версия 9 или выше
- **Операционная система**: Windows, macOS, Linux

### Проверка версий

```bash
node --version  # Должно быть >= 18.0.0
npm --version   # Должно быть >= 9.0.0
```

### Установка зависимостей

```bash
npm install
```

Это установит все необходимые пакеты:
- `express` - веб-сервер
- `axios` - HTTP клиент для API запросов
- `cors` - поддержка CORS
- `dotenv` - загрузка переменных окружения
- `typescript` - компилятор TypeScript
- И другие зависимости

### Настройка переменных окружения

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Минимальная конфигурация для разработки:

```env
PORT=3000
NODE_ENV=development
```

Для работы с реальным API добавьте:

```env
TOUR_API_BASE_URL=https://api.your-tour-operator.com/v1
TOUR_API_KEY=your-api-key-here
TOUR_API_TIMEOUT=30000
TOUR_API_RETRY_ATTEMPTS=3
```

---

## Использование веб-интерфейса

### Открытие интерфейса

1. Запустите сервер: `npm run dev`
2. Откройте браузер: `http://localhost:3000/index.html`

### Заполнение формы поиска

#### 1. Город вылета

Введите название города на русском или английском языке:
- ✅ "Moscow", "Москва"
- ✅ "Saint Petersburg", "Санкт-Петербург"
- ✅ "Novosibirsk", "Новосибирск"

#### 2. Страна назначения

Введите название страны:
- ✅ "Turkey", "Турция"
- ✅ "Egypt", "Египет"
- ✅ "UAE", "ОАЭ", "United Arab Emirates"

#### 3. Регион назначения

Введите название региона/курорта:
- ✅ "Antalya", "Анталья"
- ✅ "Sharm El Sheikh", "Шарм-эль-Шейх"
- ✅ "Dubai", "Дубай"

#### 4. Фильтр отеля

**Вариант A: Все отели**
- Выберите "All Hotels"
- Поиск будет выполнен по всем отелям в указанном регионе

**Вариант B: Конкретный отель**
- Выберите "Specific Hotel"
- Введите название отеля (например, "Grand Antalya Resort")

#### 5. Дата вылета

- Выберите дату из календаря
- Дата должна быть в будущем (нельзя выбрать прошедшую дату)
- Формат: ГГГГ-ММ-ДД (например, 2025-06-15)

#### 6. Количество ночей

- Введите число от 1 до 365
- Обычно: 7, 10, 14 ночей

#### 7. Взрослые

- Минимум: 1 взрослый
- Максимум: обычно до 10 (зависит от API)

#### 8. Дети

- Нажмите "+ Add Child" для добавления ребенка
- Укажите возраст каждого ребенка (0-17 лет)
- Можно добавить несколько детей
- Для удаления нажмите "Remove" рядом с ребенком

**Примеры**:
- 1 ребенок, 5 лет
- 2 ребенка: 3 года и 7 лет
- 3 ребенка: 2, 5 и 10 лет

#### 9. Лимит результатов

- Количество результатов для отображения
- По умолчанию: 20
- Максимум: 100 (настраивается в `.env`)

### Выполнение поиска

1. Заполните все обязательные поля (отмечены *)
2. Нажмите кнопку "Search Tours"
3. Дождитесь загрузки результатов (обычно 1-5 секунд)

### Просмотр результатов

Результаты отображаются в виде карточек, отсортированных по цене (от дешевых к дорогим).

**Каждая карточка содержит**:
- **Название отеля** - крупным шрифтом
- **Цена** - в правом верхнем углу (в валюте API, обычно RUB)
- **Туроператор** - название компании
- **Тип номера** - например, "Standard Room, All Inclusive"
- **Дата вылета** - дата отправления
- **Дата возврата** - дата возвращения
- **Количество ночей**
- **Состав группы** - количество взрослых и детей с возрастами
- **ID тура** - уникальный идентификатор

---

## Использование API

### Базовый URL

```
http://localhost:3000/api
```

### Endpoints

#### 1. Поиск туров

**POST** `/api/tours/search`

**Заголовки**:
```
Content-Type: application/json
```

**Тело запроса**:
```json
{
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
  "limit": 20,
  "offset": 0
}
```

**Ответ (успех, 200)**:
```json
{
  "criteria": { /* эхо запроса */ },
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

**Ответ (ошибка валидации, 400)**:
```json
{
  "error": "ValidationError",
  "message": "departureDate must be a future date"
}
```

**Ответ (ошибка сервера, 500)**:
```json
{
  "error": "InternalServerError",
  "message": "Tour operator API error: Connection timeout"
}
```

#### 2. Проверка здоровья сервера

**GET** `/api/health`

**Ответ (200)**:
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "service": "tour-package-search"
}
```

---

## Примеры запросов

### cURL

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
    "limit": 20
  }'
```

### JavaScript (Fetch API)

```javascript
async function searchTours() {
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
        type: 'all'
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

  if (!response.ok) {
    const error = await response.json();
    console.error('Error:', error.message);
    return;
  }

  const data = await response.json();
  console.log('Found tours:', data.results.length);
  console.log('Cheapest tour:', data.results[0]);
}
```

### Python (requests)

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

if response.status_code == 200:
    result = response.json()
    print(f"Found {len(result['results'])} tours")
    print(f"Cheapest: {result['results'][0]['totalPrice']} {result['results'][0]['currency']}")
else:
    error = response.json()
    print(f"Error: {error['message']}")
```

### Node.js (axios)

```javascript
const axios = require('axios');

async function searchTours() {
  try {
    const response = await axios.post('http://localhost:3000/api/tours/search', {
      departureCity: 'Moscow',
      destinationCountry: 'Turkey',
      destinationRegion: 'Antalya',
      hotelFilter: {
        type: 'all'
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
    });

    console.log(`Found ${response.data.results.length} tours`);
    console.log('Cheapest tour:', response.data.results[0]);
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data.message);
    } else {
      console.error('Error:', error.message);
    }
  }
}
```

---

## Обработка результатов

### Структура результата

Каждый тур в массиве `results` содержит:

```typescript
{
  tourId: string;           // Уникальный ID тура
  tourOperator: string;      // Название туроператора
  hotel: string;             // Название отеля
  roomType: string;          // Тип номера и питание
  departureDate: string;     // Дата вылета (YYYY-MM-DD)
  returnDate: string;        // Дата возврата (YYYY-MM-DD)
  nights: number;            // Количество ночей
  guests: {                  // Состав группы
    adults: number;
    children: Array<{ age: number }>;
  };
  totalPrice: number;        // Общая цена тура
  currency: string;          // Валюта (обычно "RUB")
}
```

### Сортировка

Результаты автоматически отсортированы по `totalPrice` по возрастанию (от дешевых к дорогим).

### Пагинация

Используйте параметры `limit` и `offset` для пагинации:

```json
{
  "limit": 20,    // Количество результатов на странице
  "offset": 0     // Смещение (для второй страницы: offset=20)
}
```

**Пример**: Получить вторую страницу (результаты 21-40):
```json
{
  "limit": 20,
  "offset": 20
}
```

### Фильтрация

Все результаты уже отфильтрованы по вашим критериям:
- ✅ Совпадает город вылета
- ✅ Совпадает страна и регион назначения
- ✅ Совпадает фильтр отеля
- ✅ Совпадает дата вылета
- ✅ Совпадает количество ночей
- ✅ Совпадает состав группы (взрослые + дети с возрастами)

---

## Часто задаваемые вопросы

### Как найти самый дешевый тур?

Результаты уже отсортированы по цене. Самый дешевый тур - это первый элемент в массиве `results`:

```javascript
const cheapestTour = data.results[0];
```

### Можно ли искать без указания конкретного отеля?

Да, используйте `hotelFilter.type: "all"` для поиска по всем отелям в регионе.

### Как указать несколько детей?

Добавьте несколько объектов в массив `children`:

```json
{
  "guests": {
    "adults": 2,
    "children": [
      { "age": 5 },
      { "age": 9 },
      { "age": 12 }
    ]
  }
}
```

### Что делать, если нет результатов?

1. Проверьте правильность введенных данных
2. Попробуйте расширить критерии поиска (например, "all hotels" вместо конкретного отеля)
3. Измените дату вылета
4. Проверьте логи сервера на наличие ошибок

### Как получить больше результатов?

Увеличьте параметр `limit` (максимум зависит от настройки `MAX_RESULTS_LIMIT` в `.env`):

```json
{
  "limit": 50
}
```

### Можно ли искать туры на разные даты одновременно?

Нет, API поддерживает поиск только по одной дате вылета за раз. Для поиска по диапазону дат нужно сделать несколько запросов.

### Как обработать ошибки?

```javascript
try {
  const response = await fetch('/api/tours/search', { /* ... */ });
  
  if (!response.ok) {
    const error = await response.json();
    
    if (response.status === 400) {
      // Ошибка валидации
      console.error('Validation error:', error.message);
    } else if (response.status === 500) {
      // Ошибка сервера
      console.error('Server error:', error.message);
    }
    return;
  }
  
  const data = await response.json();
  // Обработка успешного ответа
} catch (error) {
  // Ошибка сети
  console.error('Network error:', error);
}
```

### Как проверить, что сервер работает?

Выполните запрос к health check endpoint:

```bash
curl http://localhost:3000/api/health
```

Или откройте в браузере: `http://localhost:3000/api/health`

---

## Дополнительные ресурсы

- [README.md](./README.md) - Основная документация
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Руководство по интеграции с API
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Описание архитектуры
- [QUICKSTART.md](./QUICKSTART.md) - Быстрый старт

