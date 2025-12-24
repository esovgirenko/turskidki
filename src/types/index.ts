/**
 * Type definitions for the tour package search application
 */

/**
 * Child guest information
 */
export interface ChildGuest {
  age: number;
}

/**
 * Guest composition for a tour
 */
export interface Guests {
  adults: number;
  children: ChildGuest[];
}

/**
 * Hotel filter configuration
 */
export interface HotelFilter {
  type: 'single' | 'all';
  hotelName?: string; // Required when type is 'single'
}

/**
 * Tour search request criteria
 */
export interface TourSearchRequest {
  departureCity: string;
  destinationCountry: string;
  destinationRegion: string;
  hotelFilter: HotelFilter;
  departureDate: string; // ISO date string (YYYY-MM-DD)
  nights: number;
  guests: Guests;
  limit?: number; // Optional limit for pagination
  offset?: number; // Optional offset for pagination
}

/**
 * Internal representation of a tour offer from the API
 */
export interface TourOffer {
  tourId: string;
  tourOperator: string;
  hotel: string;
  roomType: string;
  departureDate: string;
  returnDate: string;
  nights: number;
  guests: Guests;
  totalPrice: number;
  currency: string;
  // Additional metadata that might be useful
  rawData?: unknown; // Store original API response for debugging
}

/**
 * Tour search response
 */
export interface TourSearchResponse {
  criteria: TourSearchRequest;
  results: TourOffer[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

/**
 * Tour Operator API client interface
 * This abstraction allows easy swapping of different tour operator APIs
 */
export interface ITourOperatorClient {
  /**
   * Search for tours based on criteria
   * @param criteria - Search criteria
   * @returns Promise resolving to an array of tour offers
   */
  searchTours(criteria: TourSearchRequest): Promise<TourOffer[]>;
}

/**
 * Configuration for the tour operator API client
 */
export interface TourOperatorConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
  retryAttempts: number;
}

