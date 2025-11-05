# BoothVerse – Deployment & Local Testing

## Vercel Environment Variables
Set these in Vercel Project Settings → Environment Variables:

- SUPABASE_URL – Your Supabase project URL
- SUPABASE_SERVICE_ROLE – Supabase service role key (server only)
- ADMIN_PASSWORD – Shared secret for admin‑guarded API routes (header `x-admin-key`)
- SITEMAP_BASE_URL – Public base URL (e.g., https://www.iboothme.com)

Optional (for GA Admin summary API in `api/ga/summary`):
- GA_PROPERTY_ID – GA4 property ID
- GA_CLIENT_EMAIL – Service account client email
- GA_PRIVATE_KEY – Service account private key

Tip: Add these to all environments you use (Production/Preview/Development) as needed.

## Build & Preview Locally (Production-like)

1) Export required env vars in your shell:
```
export SUPABASE_URL=...
export SUPABASE_SERVICE_ROLE=...
export ADMIN_PASSWORD=dev-secret
export SITEMAP_BASE_URL=http://localhost:4173
```

2) Build static assets and SEO files:
```
npm run build:client
```
This runs:
- vite build → outputs to `dist/public`
- scripts/generate-sitemap.ts → writes `client/public/sitemap.xml` (copied into dist by Vite)
- scripts/generate-robots.ts → writes `client/public/robots.txt` and `client/public/.well-known/ai.txt`

3) Preview the static build:
```
npm run preview:client
```
Serves `dist/public` at http://localhost:4173.

## Test API Routes Locally
The static preview server does not run API routes. Use Vercel Dev to emulate functions:

```
vercel dev
```
Then test endpoints like:
- GET http://localhost:3000/api/health/env
- GET http://localhost:3000/api/settings/ga
- POST http://localhost:3000/api/leads  (JSON body: `{ name, email, ... }`)
- Admin-protected reads: include header `x-admin-key: $ADMIN_PASSWORD`

Ensure the same env vars are available to `vercel dev` (Vercel CLI can read from a linked project or your shell environment).

## Notes
- SPA routes are handled by Vercel with a catch‑all to `/index.html` (see `vercel.json`).
- Vite root is `client/`; final output is `dist/public`.
- Configure Supabase tables (`leads`, `settings`, etc.) before using API endpoints.

