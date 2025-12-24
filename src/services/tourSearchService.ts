/**
 * Domain logic for tour search, filtering, and ranking
 */

import { ITourOperatorClient, TourSearchRequest, TourOffer, TourSearchResponse } from '../types';

/**
 * Tour search service
 * Handles business logic for searching, filtering, and ranking tours
 */
export class TourSearchService {
  constructor(private tourOperatorClient: ITourOperatorClient) {}

  /**
   * Search for tours based on criteria
   * Applies filtering and ranking logic
   */
  async searchTours(criteria: TourSearchRequest): Promise<TourSearchResponse> {
    // Get raw results from the tour operator API
    const allOffers = await this.tourOperatorClient.searchTours(criteria);

    // Apply strict filtering to ensure all criteria are met
    const filteredOffers = this.filterOffers(allOffers, criteria);

    // Sort by total price (ascending - cheapest first)
    const sortedOffers = this.sortByPrice(filteredOffers);

    // Apply pagination
    const offset = criteria.offset || 0;
    const limit = criteria.limit || 20;
    const paginatedOffers = sortedOffers.slice(offset, offset + limit);

    return {
      criteria,
      results: paginatedOffers,
      total: sortedOffers.length,
      limit,
      offset,
    };
  }

  /**
   * Filter offers to ensure they match all criteria
   */
  private filterOffers(offers: TourOffer[], criteria: TourSearchRequest): TourOffer[] {
    return offers.filter(offer => {
      // Check departure date matches
      if (offer.departureDate !== criteria.departureDate) {
        return false;
      }

      // Check number of nights matches
      if (offer.nights !== criteria.nights) {
        return false;
      }

      // Check guests composition matches
      if (offer.guests.adults !== criteria.guests.adults) {
        return false;
      }

      if (offer.guests.children.length !== criteria.guests.children.length) {
        return false;
      }

      // Check children ages match (order-independent)
      const offerAges = offer.guests.children.map(c => c.age).sort();
      const criteriaAges = criteria.guests.children.map(c => c.age).sort();
      if (JSON.stringify(offerAges) !== JSON.stringify(criteriaAges)) {
        return false;
      }

      // Check hotel filter
      if (criteria.hotelFilter.type === 'single') {
        if (offer.hotel.toLowerCase() !== criteria.hotelFilter.hotelName!.toLowerCase()) {
          return false;
        }
      }
      // If type is 'all', we accept any hotel in the region (no additional filtering needed)

      return true;
    });
  }

  /**
   * Sort offers by total price (ascending)
   */
  private sortByPrice(offers: TourOffer[]): TourOffer[] {
    return [...offers].sort((a, b) => {
      // First compare by price
      if (a.totalPrice !== b.totalPrice) {
        return a.totalPrice - b.totalPrice;
      }
      // If prices are equal, sort by tour ID for consistency
      return a.tourId.localeCompare(b.tourId);
    });
  }
}

