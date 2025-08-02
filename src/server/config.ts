export const MONGODB_URI = process.env.MONGODB_URI || '';
export const GOOGLE_ID = process.env.GOOGLE_ID || '';
export const GOOGLE_SECRET = process.env.GOOGLE_SECRET || '';

if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

if (!GOOGLE_ID || !GOOGLE_SECRET) {
  throw new Error('Invalid/Missing environment variable: "GOOGLE_ID" or "GOOGLE_SECRET"');
}