import { IS_PRODUCTION } from '@/server/config';

export const TESTING_BASE_PATH = '/api/testing';
export const TESTING_API_PATH = `${TESTING_BASE_PATH}`;

// All testing routes that should be excluded from middleware in development only
export const TESTING_ROUTES = [
  TESTING_BASE_PATH,
  TESTING_API_PATH,
];

// Check if testing routes should be available
export const isTestingEnabled = () => {
  return !IS_PRODUCTION;
}; 