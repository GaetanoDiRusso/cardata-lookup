// Client-side environment variables (must start with NEXT_PUBLIC_)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Environment detection for client-side
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Validation for client-side variables
if (!API_BASE_URL && IS_PRODUCTION) {
  console.warn('Warning: NEXT_PUBLIC_API_BASE_URL is not set in production');
}

console.log('Client-side configuration:', {
  API_BASE_URL,
  IS_PRODUCTION,
  IS_DEVELOPMENT
});