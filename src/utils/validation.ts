/**
 * Input validation utilities for tour search requests
 */

import { TourSearchRequest, HotelFilter, Guests } from '../types';

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates a date string (YYYY-MM-DD format)
 */
function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validates that a date is in the future
 */
function isFutureDate(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

/**
 * Validates hotel filter
 */
function validateHotelFilter(filter: HotelFilter): void {
  if (!filter || typeof filter !== 'object') {
    throw new ValidationError('hotelFilter is required and must be an object');
  }

  if (filter.type !== 'single' && filter.type !== 'all') {
    throw new ValidationError('hotelFilter.type must be either "single" or "all"');
  }

  if (filter.type === 'single' && (!filter.hotelName || typeof filter.hotelName !== 'string' || filter.hotelName.trim().length === 0)) {
    throw new ValidationError('hotelFilter.hotelName is required when type is "single"');
  }
}

/**
 * Validates guests composition
 */
function validateGuests(guests: Guests): void {
  if (!guests || typeof guests !== 'object') {
    throw new ValidationError('guests is required and must be an object');
  }

  if (typeof guests.adults !== 'number' || guests.adults < 1 || !Number.isInteger(guests.adults)) {
    throw new ValidationError('guests.adults must be a positive integer');
  }

  if (!Array.isArray(guests.children)) {
    throw new ValidationError('guests.children must be an array');
  }

  for (let i = 0; i < guests.children.length; i++) {
    const child = guests.children[i];
    if (!child || typeof child !== 'object') {
      throw new ValidationError(`guests.children[${i}] must be an object`);
    }
    if (typeof child.age !== 'number' || child.age < 0 || child.age > 17 || !Number.isInteger(child.age)) {
      throw new ValidationError(`guests.children[${i}].age must be an integer between 0 and 17`);
    }
  }
}

/**
 * Validates tour search request
 */
export function validateTourSearchRequest(request: unknown): asserts request is TourSearchRequest {
  if (!request || typeof request !== 'object') {
    throw new ValidationError('Request body is required and must be an object');
  }

  const req = request as Partial<TourSearchRequest>;

  // Validate departureCity
  if (!req.departureCity || typeof req.departureCity !== 'string' || req.departureCity.trim().length === 0) {
    throw new ValidationError('departureCity is required and must be a non-empty string');
  }

  // Validate destinationCountry
  if (!req.destinationCountry || typeof req.destinationCountry !== 'string' || req.destinationCountry.trim().length === 0) {
    throw new ValidationError('destinationCountry is required and must be a non-empty string');
  }

  // Validate destinationRegion
  if (!req.destinationRegion || typeof req.destinationRegion !== 'string' || req.destinationRegion.trim().length === 0) {
    throw new ValidationError('destinationRegion is required and must be a non-empty string');
  }

  // Validate hotelFilter
  validateHotelFilter(req.hotelFilter as HotelFilter);

  // Validate departureDate
  if (!req.departureDate || typeof req.departureDate !== 'string') {
    throw new ValidationError('departureDate is required and must be a string');
  }
  if (!isValidDate(req.departureDate)) {
    throw new ValidationError('departureDate must be in YYYY-MM-DD format');
  }
  if (!isFutureDate(req.departureDate)) {
    throw new ValidationError('departureDate must be a future date');
  }

  // Validate nights
  if (typeof req.nights !== 'number' || req.nights < 1 || !Number.isInteger(req.nights)) {
    throw new ValidationError('nights must be a positive integer');
  }

  // Validate guests
  validateGuests(req.guests as Guests);

  // Validate limit (optional)
  if (req.limit !== undefined) {
    if (typeof req.limit !== 'number' || req.limit < 1 || !Number.isInteger(req.limit)) {
      throw new ValidationError('limit must be a positive integer if provided');
    }
  }

  // Validate offset (optional)
  if (req.offset !== undefined) {
    if (typeof req.offset !== 'number' || req.offset < 0 || !Number.isInteger(req.offset)) {
      throw new ValidationError('offset must be a non-negative integer if provided');
    }
  }
}

