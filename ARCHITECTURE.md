# Architecture Documentation

## High-Level Architecture

The application follows a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  HTML/JavaScript UI (public/index.html, app.js)      │   │
│  │  - Form for search criteria                          │   │
│  │  - Results display                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      HTTP API Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Express Routes (src/api/routes.ts)                  │   │
│  │  - POST /api/tours/search                            │   │
│  │  - GET /api/health                                   │   │
│  └───────────────────────────┬──────────────────────────┘   │
│                              │                               │
│  ┌───────────────────────────▼──────────────────────────┐   │
│  │  Controllers (src/api/controllers.ts)                  │   │
│  │  - Request validation                                 │   │
│  │  - Error handling                                     │   │
│  │  - Response formatting                                │   │
│  └───────────────────────────┬──────────────────────────┘   │
└──────────────────────────────┼───────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Domain Logic Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Tour Search Service (src/services/tourSearchService)│   │
│  │  - Filtering logic                                    │   │
│  │  - Ranking/sorting logic                             │   │
│  │  - Pagination                                        │   │
│  └───────────────────────────┬──────────────────────────┘   │
└──────────────────────────────┼───────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Access Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Tour Operator Client Interface                      │   │
│  │  (src/clients/tourOperatorClient.ts)                 │   │
│  │                                                       │   │
│  │  ┌────────────────────┐  ┌──────────────────────┐   │   │
│  │  │ Mock Client        │  │ Real Client          │   │   │
│  │  │ (Development)      │  │ (Production)         │   │   │
│  │  └────────────────────┘  └──────────────────────┘   │   │
│  └───────────────────────────┬──────────────────────────┘   │
└──────────────────────────────┼───────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  External Tour Operator APIs                │
│  (Andromeda, Travelata, Level.Travel, etc.)                 │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Search Request Flow

1. **Frontend** → User fills form and submits
2. **HTTP API** → Request received at `POST /api/tours/search`
3. **Controller** → Validates request using `validateTourSearchRequest()`
4. **Service** → Calls `tourSearchService.searchTours()`
5. **Client** → Calls `tourOperatorClient.searchTours()` to fetch from external API
6. **Service** → Filters results to match exact criteria
7. **Service** → Sorts by price (ascending)
8. **Service** → Applies pagination (limit/offset)
9. **Controller** → Formats response
10. **HTTP API** → Returns JSON response
11. **Frontend** → Displays results in table

## Module Responsibilities

### `src/types/index.ts`
- Defines all TypeScript interfaces
- Request/response schemas
- Domain models (TourOffer, TourSearchRequest, etc.)
- Client interface contracts

### `src/utils/validation.ts`
- Input validation logic
- Type guards and assertions
- Validation error handling

### `src/clients/tourOperatorClient.ts`
- Abstract base class for tour operator clients
- Defines interface contract
- Helper methods for date calculations

### `src/clients/mockTourOperatorClient.ts`
- Mock implementation for development/testing
- Generates realistic test data
- Simulates API delays

### `src/clients/realTourOperatorClient.ts`
- Template for real API integration
- Handles authentication
- Maps criteria to API-specific parameters
- Parses API responses
- Implements retry logic with exponential backoff

### `src/services/tourSearchService.ts`
- **Filtering**: Ensures all results match exact criteria
  - Departure date match
  - Nights match
  - Guests composition match (adults + children ages)
  - Hotel filter match
- **Ranking**: Sorts by total price (ascending)
- **Pagination**: Applies limit and offset

### `src/api/controllers.ts`
- HTTP request handling
- Input validation
- Error handling and formatting
- Response formatting

### `src/api/routes.ts`
- Express route definitions
- Route-to-controller mapping

### `src/config.ts`
- Environment variable loading
- Configuration validation
- Default values

### `src/index.ts`
- Application entry point
- Express server setup
- Middleware configuration
- Dependency injection
- Server startup

## Design Patterns

### 1. Repository Pattern
The `ITourOperatorClient` interface abstracts data access, allowing easy swapping of implementations:
- Development: `MockTourOperatorClient`
- Production: `RealTourOperatorClient` (or any other implementation)

### 2. Service Layer Pattern
Business logic is separated from HTTP concerns:
- Controllers handle HTTP-specific concerns
- Services handle business logic (filtering, ranking, pagination)

### 3. Dependency Injection
Services and clients are injected via constructors:
```typescript
const client = new MockTourOperatorClient();
const service = new TourSearchService(client);
const controller = new TourSearchController(service);
```

### 4. Strategy Pattern
Different tour operator APIs can be swapped by implementing `ITourOperatorClient`:
- Each API has its own implementation
- Same interface, different behavior

## API Integration Strategy

### Current State (Development)
- Uses `MockTourOperatorClient` for testing
- Generates realistic mock data
- Simulates network delays

### Production Integration
To integrate with a real API:

1. **Update `realTourOperatorClient.ts`**:
   ```typescript
   // Map application criteria to API parameters
   private mapCriteriaToApiParams(criteria: TourSearchRequest): unknown {
     return {
       departure_city: this.mapCityToCode(criteria.departureCity),
       destination_country: this.mapCountryToId(criteria.destinationCountry),
       // ... etc
     };
   }
   
   // Parse API response to TourOffer format
   private parseApiResponse(apiData: unknown): TourOffer[] {
     // Transform API-specific format to our standard format
   }
   ```

2. **Update `src/index.ts`**:
   ```typescript
   const tourOperatorClient = new RealTourOperatorClient(config.tourOperator);
   ```

3. **Configure environment variables**:
   ```env
   TOUR_API_BASE_URL=https://api.real-tour-operator.com/v1
   TOUR_API_KEY=your-actual-api-key
   ```

## Error Handling

### Validation Errors (400)
- Invalid input format
- Missing required fields
- Invalid date ranges
- Invalid guest composition

### API Errors (500)
- External API failures
- Network timeouts
- Parsing errors
- Unexpected errors

### Error Response Format
```json
{
  "error": "ValidationError",
  "message": "departureDate must be a future date",
  "details": {} // Only in development mode
}
```

## Configuration

All configuration is managed via environment variables:
- Server settings (PORT, NODE_ENV)
- API settings (base URL, API key, timeout, retries)
- Application settings (max results, default limit)

See `.env.example` for all available configuration options.

## Security Considerations

1. **Input Validation**: All inputs are validated before processing
2. **Error Messages**: Sensitive information not exposed in production
3. **API Keys**: Stored in environment variables, never in code
4. **CORS**: Configured for frontend access
5. **Rate Limiting**: Can be added at the Express middleware level

## Scalability Considerations

1. **Caching**: Can add Redis caching layer between service and client
2. **Rate Limiting**: Implement rate limiting for API endpoints
3. **Database**: Can add database layer for caching popular searches
4. **Load Balancing**: Stateless design allows horizontal scaling
5. **Async Processing**: Can move to queue-based processing for long-running searches

## Testing Strategy

1. **Unit Tests**: Test individual modules (services, validation, clients)
2. **Integration Tests**: Test API endpoints with mock client
3. **E2E Tests**: Test full flow with real API (when available)
4. **Mock Client**: Use `MockTourOperatorClient` for development/testing

