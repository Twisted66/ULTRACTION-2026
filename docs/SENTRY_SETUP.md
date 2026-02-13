# Sentry & Spotlight Integration Guide

This document explains how to set up and use Sentry error tracking with Spotlight overlay in the ULTRACTION website.

## What is Sentry + Spotlight?

- **Sentry**: Error tracking and performance monitoring platform
- **Spotlight**: Developer-side overlay that shows Sentry events in real-time during development

## Setup Instructions

### 1. Get Sentry DSN

1. Go to [sentry.io](https://sentry.io/)
2. Create a new project or select existing one
3. Copy your **DSN** (Data Source Name) from Settings > Client Keys (DSN)

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env` and add your Sentry DSN:

```env
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/projectId
SENTRY_ENVIRONMENT=development
```

**For Astro public variables**, use `PUBLIC_` prefix:

```env
PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/projectId
PUBLIC_SENTRY_ENVIRONMENT=development
```

### 3. Start Spotlight (Development)

In a separate terminal, start the Spotlight sidecar:

```bash
npx @spotlightjs/spotlight
```

Or use the MCP command:

```bash
npx @spotlightjs/spotlight@latest mcp add sentry-spotlight
```

Spotlight will:
- Start on `http://localhost:8969`
- Automatically receive events from your app
- Show errors, traces, and performance data in real-time

### 4. Start Development Server

```bash
npm run dev
```

Visit your site at `http://localhost:4321`. Open `http://localhost:8969` to see the Spotlight overlay.

## Usage in Code

### Automatic Error Tracking

Most errors are captured automatically:
- Unhandled exceptions
- Unhandled promise rejections
- Network errors (if using Sentry fetch integration)

### Manual Error Reporting

```typescript
import { captureException, captureMessage } from '../utils/sentry';

// Capture an exception
try {
  // risky code
} catch (error) {
  captureException(error, { context: 'additional data' });
}

// Capture a message
captureMessage('Something important happened', 'warning');
```

### User Context

Track which user experienced the error:

```typescript
import { setUser } from '../utils/sentry';

setUser({
  id: 'user-123',
  email: 'user@example.com',
  username: 'johndoe'
});
```

### Breadcrumbs

Track user actions leading to errors:

```typescript
import { addBreadcrumb } from '../utils/sentry';

addBreadcrumb('User clicked checkout button', 'user-action');
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|----------|
| `PUBLIC_SENTRY_DSN` | Your Sentry project DSN | `https://xxx@o0.ingest.sentry.io/xxx` |
| `PUBLIC_SENTRY_ENVIRONMENT` | Environment name | `development`, `staging`, `production` |

## Files Added

| File | Purpose |
|-------|---------|
| `astro.config.mjs` | Sentry plugin configuration |
| `src/layouts/Layout.astro` | Spotlight sidecar script |
| `src/utils/sentry.ts` | Sentry utilities & helpers |
| `src/components/common/SentryInit.astro` | Client-side initialization |
| `.env.example` | Environment variable template |

## Production Deployment

1. Set `PUBLIC_SENTRY_DSN` in your hosting environment variables
2. Set `PUBLIC_SENTRY_ENVIRONMENT=production`
3. Build and deploy normally

```bash
npm run build
```

## Troubleshooting

**Spotlight not showing events?**
- Ensure Spotlight is running on port 8969
- Check browser console for connection errors
- Verify sidecar script is loading in dev mode only

**Errors not appearing in Sentry?**
- Check DSN is correctly set in `.env`
- Verify environment variables are loaded (check Network tab)
- Check `beforeSend` filter in `sentry.ts`

**Build errors after adding Sentry?**
- Ensure `@sentry/astro` was installed: `npm install @sentry/astro`
- Check `astro.config.mjs` has correct import

## Resources

- [Sentry Astro Docs](https://docs.sentry.io/platforms/javascript/guides/astro/)
- [Spotlight Docs](https://spotlightjs.com/)
- [Sentry Dashboard](https://sentry.io/)
