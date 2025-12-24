# Tour Package Search Application

A production-grade web application for searching the best tour packages from Russian tour operators by price.

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

## Integrating with Real Tour Operator APIs

To integrate with a real Russian tour operator API (e.g., Andromeda, Travelata, Level.Travel):

1. **Update `src/clients/realTourOperatorClient.ts`**:
   - Replace API endpoint URLs
   - Implement authentication mechanism
   - Map application criteria to API-specific parameters
   - Parse API response to match `TourOffer` interface

2. **Update `src/index.ts`**:
   - Switch from `MockTourOperatorClient` to `RealTourOperatorClient`
   - Configure with actual API credentials from environment variables

3. **Update `.env`**:
   - Set `TOUR_API_BASE_URL` to the actual API endpoint
   - Set `TOUR_API_KEY` with your API key

Example:
```typescript
// In src/index.ts
import { RealTourOperatorClient } from './clients/realTourOperatorClient';

const tourOperatorClient = new RealTourOperatorClient(config.tourOperator);
```

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

### Using the Frontend

1. Open `http://localhost:3000/index.html` in your browser
2. Fill in the search form
3. Click "Search Tours"
4. View results in a formatted table

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

## Testing

The application includes a mock tour operator client for development and testing. To test with real data, integrate a real API client as described above.

## License

MIT

