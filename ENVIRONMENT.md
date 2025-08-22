# Environment Configuration

This project supports multiple environment configurations for development, staging, and production.

## Available Commands

### Development
```bash
# Local development (uses .env.development + .env.local)
npm run dev

# Staging environment (uses .env.staging)
npm run dev:staging

# Production environment (uses .env.production)
npm run dev:prod
```

### Build
```bash
# Development build
npm run build

# Staging build
npm run build:staging

# Production build
npm run build:prod
```

### Start (Production Server)
```bash
# Development start
npm run start

# Staging start
npm run start:staging

# Production start
npm run start:prod
```

## Environment Files

Next.js automatically loads environment variables based on `NODE_ENV`:

- **`.env.development`** - Loaded when `NODE_ENV=development` (default for `npm run dev`)
- **`.env.staging`** - Loaded when `NODE_ENV=staging`
- **`.env.production`** - Loaded when `NODE_ENV=production`
- **`.env.local`** - Always loaded, overrides other files (gitignored)

## Environment Variable Priority

1. `.env.local` (highest priority)
2. `.env.[environment]` (based on NODE_ENV)
3. `.env` (lowest priority)

## Example Usage

```bash
# Run with staging environment
npm run dev:staging

# Run with production environment
npm run dev:prod

# Build for staging
npm run build:staging

# Start production server
npm run start:prod
```

## Environment Variables

### Common Variables
- `NODE_ENV` - Environment name (development/staging/production)
- `NEXTAUTH_URL` - Authentication callback URL
- `MONGODB_URI` - MongoDB connection string
- `DATA_RETRIEVAL_SERVICE_URL` - External service URL
- `GOOGLE_ID` - Google OAuth client ID
- `GOOGLE_SECRET` - Google OAuth client secret
- `NEXTAUTH_SECRET` - NextAuth.js secret

### Public Variables (Client-side)
Variables prefixed with `NEXT_PUBLIC_` are available in the browser:
- `NEXT_PUBLIC_APP_ENV` - Current environment
- `NEXT_PUBLIC_API_BASE_URL` - API base URL
