/**
 * Main application entry point
 */

import express, { Express } from 'express';
import cors from 'cors';
import { loadConfig } from './config';
import { createRoutes } from './api/routes';
import { TourSearchController } from './api/controllers';
import { TourSearchService } from './services/tourSearchService';
import { MockTourOperatorClient } from './clients/mockTourOperatorClient';
// import { RealTourOperatorClient } from './clients/realTourOperatorClient';

/**
 * Initialize and start the Express server
 */
async function main(): Promise<void> {
  // Load configuration
  const config = loadConfig();

  // Initialize Express app
  const app: Express = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.static('public')); // Serve static files from public directory

  // Initialize tour operator client
  // For development, use MockTourOperatorClient
  // For production, switch to RealTourOperatorClient and configure it with actual API credentials
  const tourOperatorClient = new MockTourOperatorClient();
  // const tourOperatorClient = new RealTourOperatorClient(config.tourOperator);

  // Initialize services
  const tourSearchService = new TourSearchService(tourOperatorClient);

  // Initialize controllers
  const tourSearchController = new TourSearchController(tourSearchService);

  // Setup routes
  app.use('/api', createRoutes(tourSearchController));

  // Root endpoint
  app.get('/', (_req, res) => {
    res.send(`
      <h1>Tour Package Search API</h1>
      <p>API is running. Use POST /api/tours/search to search for tours.</p>
      <p><a href="/index.html">Go to Frontend</a></p>
    `);
  });

  // Start server
  const port = config.port;
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📝 API endpoint: http://localhost:${port}/api/tours/search`);
    console.log(`🌐 Frontend: http://localhost:${port}/index.html`);
    console.log(`💚 Health check: http://localhost:${port}/api/health`);
  });
}

// Start the application
main().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

