// MongoDB Configuration
export const MONGODB_URI = process.env.MONGODB_URI || '';

// Authentication Configuration
export const GOOGLE_ID = process.env.GOOGLE_ID || '';
export const GOOGLE_SECRET = process.env.GOOGLE_SECRET || '';
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || '';
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL || '';

// Service Configuration
export const DATA_RETRIEVAL_SERVICE_URL = process.env.DATA_RETRIEVAL_SERVICE_URL;

// Environment Configuration
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const APP_ENV = process.env.APP_ENV || NODE_ENV;
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_DEVELOPMENT = NODE_ENV === 'development';
export const IS_STAGING = APP_ENV === 'staging';

// Validation
if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

if (!GOOGLE_ID || !GOOGLE_SECRET) {
  throw new Error('Invalid/Missing environment variable: "GOOGLE_ID" or "GOOGLE_SECRET"');
}

if (!NEXTAUTH_SECRET) {
  throw new Error('Invalid/Missing environment variable: "NEXTAUTH_SECRET"');
}

if (!DATA_RETRIEVAL_SERVICE_URL) {
  throw new Error('Invalid/Missing environment variable: "DATA_RETRIEVAL_SERVICE_URL"');
}

console.log('Starting server with the following configuration:', {
  MONGODB_URI,
  GOOGLE_ID,
  GOOGLE_SECRET,
  NEXTAUTH_SECRET,
  NEXTAUTH_URL,
  DATA_RETRIEVAL_SERVICE_URL,
  NODE_ENV,
  APP_ENV,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  IS_STAGING
});