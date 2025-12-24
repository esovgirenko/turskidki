/**
 * API route definitions
 */

import { Router } from 'express';
import { TourSearchController } from './controllers';

/**
 * Create and configure API routes
 */
export function createRoutes(controller: TourSearchController): Router {
  const router = Router();

  // Health check endpoint
  router.get('/health', (req, res) => controller.healthCheck(req, res));

  // Tour search endpoint
  router.post('/tours/search', (req, res) => controller.searchTours(req, res));

  return router;
}

