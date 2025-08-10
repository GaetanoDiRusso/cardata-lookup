export const MONGODB_URI = process.env.MONGODB_URI || '';
export const GOOGLE_ID = process.env.GOOGLE_ID || '';
export const GOOGLE_SECRET = process.env.GOOGLE_SECRET || '';
export const DATA_RETRIEVAL_SERVICE_URL = process.env.DATA_RETRIEVAL_SERVICE_URL || 'http://localhost:3001';

if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

if (!GOOGLE_ID || !GOOGLE_SECRET) {
  throw new Error('Invalid/Missing environment variable: "GOOGLE_ID" or "GOOGLE_SECRET"');
}

if (!DATA_RETRIEVAL_SERVICE_URL) {
  throw new Error('Invalid/Missing environment variable: "DATA_RETRIEVAL_SERVICE_URL"');
}