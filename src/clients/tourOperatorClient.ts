/**
 * Abstract interface for tour operator API clients
 * This file defines the contract that all tour operator implementations must follow
 */

import { ITourOperatorClient, TourSearchRequest, TourOffer } from '../types';

/**
 * Base abstract class for tour operator clients
 * Concrete implementations should extend this class
 */
export abstract class TourOperatorClient implements ITourOperatorClient {
  /**
   * Search for tours based on criteria
   * Must be implemented by concrete classes
   */
  abstract searchTours(criteria: TourSearchRequest): Promise<TourOffer[]>;

  /**
   * Helper method to calculate return date from departure date and nights
   */
  protected calculateReturnDate(departureDate: string, nights: number): string {
    const date = new Date(departureDate);
    date.setDate(date.getDate() + nights);
    return date.toISOString().split('T')[0];
  }

  /**
   * Helper method to format date for API calls
   */
  protected formatDate(date: string): string {
    return date; // ISO format (YYYY-MM-DD) is usually what APIs expect
  }
}

