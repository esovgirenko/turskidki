/**
 * Mock implementation of the tour operator client
 * This simulates a real API and can be used for development/testing
 * Replace this with a real implementation when integrating with actual tour operator APIs
 */

import { TourOperatorClient } from './tourOperatorClient';
import { TourSearchRequest, TourOffer } from '../types';

/**
 * Mock tour operator client for development and testing
 * Generates realistic mock data based on search criteria
 */
export class MockTourOperatorClient extends TourOperatorClient {
  private readonly mockOperators = [
    'Coral Travel',
    'TUI Россия',
    'Pegas Touristik',
    'TEZ TOUR',
    'Анекс Тур',
    'Библио Глобус',
    'Интурист',
  ];

  private readonly mockRoomTypes = [
    'Standard Room, All Inclusive',
    'Superior Room, All Inclusive',
    'Deluxe Room, All Inclusive',
    'Family Room, All Inclusive',
    'Suite, All Inclusive',
    'Standard Room, Half Board',
    'Superior Room, Half Board',
  ];

  /**
   * Search for tours - generates mock data
   */
  async searchTours(criteria: TourSearchRequest): Promise<TourOffer[]> {
    // Simulate API delay
    await this.delay(300 + Math.random() * 500);

    const results: TourOffer[] = [];
    const numResults = Math.floor(Math.random() * 15) + 5; // 5-20 results

    for (let i = 0; i < numResults; i++) {
      const basePrice = this.calculateBasePrice(criteria);
      const priceVariation = basePrice * (0.7 + Math.random() * 0.6); // ±30% variation
      const totalPrice = Math.round(priceVariation);

      const hotelName = criteria.hotelFilter.type === 'single' 
        ? criteria.hotelFilter.hotelName!
        : this.generateHotelName(criteria.destinationRegion);

      results.push({
        tourId: `TOUR-${Date.now()}-${i}`,
        tourOperator: this.mockOperators[Math.floor(Math.random() * this.mockOperators.length)],
        hotel: hotelName,
        roomType: this.mockRoomTypes[Math.floor(Math.random() * this.mockRoomTypes.length)],
        departureDate: criteria.departureDate,
        returnDate: this.calculateReturnDate(criteria.departureDate, criteria.nights),
        nights: criteria.nights,
        guests: {
          adults: criteria.guests.adults,
          children: [...criteria.guests.children],
        },
        totalPrice,
        currency: 'RUB',
      });
    }

    return results;
  }

  /**
   * Calculate a base price for the tour based on criteria
   */
  private calculateBasePrice(criteria: TourSearchRequest): number {
    let basePrice = 50000; // Base price per adult

    // Adjust for number of adults
    basePrice *= criteria.guests.adults;

    // Adjust for children (typically 50-80% of adult price)
    const childPriceMultiplier = 0.65;
    criteria.guests.children.forEach(child => {
      const childPrice = basePrice / criteria.guests.adults * childPriceMultiplier;
      basePrice += childPrice;
    });

    // Adjust for number of nights
    basePrice *= (criteria.nights / 7); // Normalize to 7 nights

    // Add some randomness
    basePrice *= (0.9 + Math.random() * 0.2);

    return Math.round(basePrice);
  }

  /**
   * Generate a mock hotel name
   */
  private generateHotelName(region: string): string {
    const prefixes = ['Grand', 'Royal', 'Sunset', 'Paradise', 'Crystal', 'Golden', 'Blue', 'Green'];
    const suffixes = ['Resort', 'Hotel', 'Beach', 'Palace', 'Villa', 'Club'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${prefix} ${region} ${suffix}`;
  }

  /**
   * Simulate network delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

