/**
 * Application configuration
 * Loads configuration from environment variables
 */

import dotenv from 'dotenv';
import { TourOperatorConfig } from './types';

// Load environment variables
dotenv.config();

/**
 * Application configuration interface
 */
export interface AppConfig {
  port: number;
  nodeEnv: string;
  tourOperator: TourOperatorConfig;
  maxResultsLimit: number;
  defaultResultsLimit: number;
}

/**
 * Load and validate configuration from environment variables
 */
export function loadConfig(): AppConfig {
  const port = parseInt(process.env.PORT || '3000', 10);
  const nodeEnv = process.env.NODE_ENV || 'development';

  // Tour operator API configuration
  const tourOperator: TourOperatorConfig = {
    baseUrl: process.env.TOUR_API_BASE_URL || 'https://api.example-tour-operator.com/v1',
    apiKey: process.env.TOUR_API_KEY || '',
    timeout: parseInt(process.env.TOUR_API_TIMEOUT || '30000', 10),
    retryAttempts: parseInt(process.env.TOUR_API_RETRY_ATTEMPTS || '3', 10),
  };

  const maxResultsLimit = parseInt(process.env.MAX_RESULTS_LIMIT || '100', 10);
  const defaultResultsLimit = parseInt(process.env.DEFAULT_RESULTS_LIMIT || '20', 10);

  return {
    port,
    nodeEnv,
    tourOperator,
    maxResultsLimit,
    defaultResultsLimit,
  };
}

