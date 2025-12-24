/**
 * HTTP controllers for tour search API
 */

import { Request, Response } from 'express';
import { TourSearchService } from '../services/tourSearchService';
import { validateTourSearchRequest } from '../utils/validation';
import { TourSearchRequest, ErrorResponse } from '../types';

/**
 * Tour search controller
 */
export class TourSearchController {
  constructor(private tourSearchService: TourSearchService) {}

  /**
   * Handle POST /api/tours/search
   */
  async searchTours(req: Request, res: Response): Promise<void> {
    try {
      // Validate request
      validateTourSearchRequest(req.body);

      // Perform search
      const criteria = req.body as TourSearchRequest;
      const result = await this.tourSearchService.searchTours(criteria);

      // Return success response
      res.status(200).json(result);
    } catch (error) {
      // Handle validation errors
      if (error instanceof Error && error.name === 'ValidationError') {
        const errorResponse: ErrorResponse = {
          error: 'ValidationError',
          message: error.message,
        };
        res.status(400).json(errorResponse);
        return;
      }

      // Handle other errors
      const errorResponse: ErrorResponse = {
        error: 'InternalServerError',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      };
      res.status(500).json(errorResponse);
    }
  }

  /**
   * Health check endpoint
   */
  healthCheck(_req: Request, res: Response): void {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'tour-package-search',
    });
  }
}

