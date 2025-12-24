# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `PORT`: Server port (default: 3000)
   - `TOUR_API_BASE_URL`: Tour operator API base URL
   - `TOUR_API_KEY`: Your API key (if using real API)

3. **Build the project** (optional, for production):
   ```bash
   npm run build
   ```

4. **Start the server**:

   **Development mode** (with hot-reload):
   ```bash
   npm run dev
   ```

   **Production mode**:
   ```bash
   npm start
   ```

## Using the Application

### Via Web Interface

1. Open your browser and navigate to:
   ```
   http://localhost:3000/index.html
   ```

2. Fill in the search form:
   - Departure city (e.g., "Moscow")
   - Destination country (e.g., "Turkey")
   - Destination region (e.g., "Antalya")
   - Hotel filter (all hotels or specific hotel)
   - Departure date
   - Number of nights
   - Number of adults
   - Children (add children with ages)
   - Results limit

3. Click "Search Tours"

4. View results sorted by price (cheapest first)

### Via API (cURL)

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

### Via API (JavaScript/Fetch)

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

const data = await response.json();
console.log(data);
```

## Example Responses

### Success Response

```json
{
  "criteria": {
    "departureCity": "Moscow",
    "destinationCountry": "Turkey",
    "destinationRegion": "Antalya",
    "hotelFilter": { "type": "all" },
    "departureDate": "2025-06-15",
    "nights": 7,
    "guests": {
      "adults": 2,
      "children": [{ "age": 5 }, { "age": 9 }]
    },
    "limit": 20
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
        "children": [{ "age": 5 }, { "age": 9 }]
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

### Error Response

```json
{
  "error": "ValidationError",
  "message": "departureDate must be a future date"
}
```

## Health Check

Check if the server is running:

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "service": "tour-package-search"
}
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, change it in `.env`:
```env
PORT=3001
```

### API Connection Issues

If using a real tour operator API:
1. Verify `TOUR_API_BASE_URL` is correct
2. Verify `TOUR_API_KEY` is valid
3. Check network connectivity
4. Review API documentation for required parameters

### TypeScript Errors

Run type checking:
```bash
npm run type-check
```

### Build Errors

Clear and rebuild:
```bash
rm -rf dist node_modules
npm install
npm run build
```

## Next Steps

1. **Integrate Real API**: See `src/clients/realTourOperatorClient.ts` for integration template
2. **Add Caching**: Implement Redis caching for popular searches
3. **Add Authentication**: Implement API key authentication for production
4. **Add Logging**: Add structured logging (Winston, Pino, etc.)
5. **Add Tests**: Write unit and integration tests

