# Careers Jobs API (Backend-Managed Open Roles)

This project supports backend-managed roles for `/careers` through `src/pages/api/jobs.ts`.

## Manual HR Publishing (No GPT Required)

An internal page is available at `/careers-admin` for HR to publish roles manually.

- Route file: `src/pages/careers-admin.astro`
- Uses the same backend endpoint: `POST /api/jobs`
- Requires `JOBS_API_KEY` entered by authorized staff in the browser
- Key is stored only in browser `sessionStorage` for convenience per session

Security recommendations:

1. Keep `/careers-admin` private (VPN, basic auth, reverse proxy allowlist, or SSO).
2. Share `JOBS_API_KEY` only with trusted HR/admin users.
3. Rotate `JOBS_API_KEY` immediately if there is any exposure risk.

## Runtime Note

The site currently builds statically (`astro.config.mjs` uses `output: 'static'`).  
Astro API routes require a server runtime to execute in production.

Use one of these deployment models:

1. Deploy with an Astro server adapter (Node runtime) so `/api/jobs` runs on the same domain.
2. Keep static site hosting, deploy `/api/jobs` separately, and set `PUBLIC_JOBS_API_BASE_URL` to that API origin.

## Environment Variables

Add these variables in `.env.local` and deployment env:

```bash
JOBS_API_KEY=replace-with-strong-random-secret
JOBS_DATABASE_URL=
JOBS_STORAGE_PATH=tmp/jobs-data.json
PUBLIC_JOBS_API_BASE_URL=
```

- `JOBS_API_KEY`: required for write operations (`POST`, `PATCH`, `DELETE`)
- `JOBS_DATABASE_URL`: optional PostgreSQL connection string; when available this is the canonical jobs store
- `JOBS_STORAGE_PATH`: optional file-backed fallback data location
- `PUBLIC_JOBS_API_BASE_URL`: optional API origin for static frontend deployment

## API Contract

Base route: `/api/jobs`

- `GET /api/jobs`
  - Public. Returns open jobs.
  - Optional query:
    - `status=open|closed|all` (`closed` and `all` require auth header)
- `POST /api/jobs`
  - Auth required.
  - Creates a new job.
- `PATCH /api/jobs?id={jobId}`
  - Auth required.
  - Updates mutable fields.
- `DELETE /api/jobs?id={jobId}`
  - Auth required.
  - Archives the job (sets `status=closed`) instead of hard-delete.
  - Requires confirmation guard:
    - `confirm=true` (query) or `confirmArchive=true` (JSON body)
    - `confirmTitle` must exactly match the current title

Auth header options for write operations:

- `Authorization: Bearer <JOBS_API_KEY>`
- `x-jobs-api-key: <JOBS_API_KEY>`

Notes:

- For `GET /api/jobs?status=closed|all`, missing/invalid credentials return `401/403`.
- If `JOBS_API_KEY` is missing on server, protected operations return `503`.

## Quick cURL Checks

Set env for local testing:

```bash
export JOBS_API_KEY=replace-with-strong-random-secret
```

Create:

```bash
curl -X POST http://localhost:4321/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JOBS_API_KEY" \
  -d '{
    "title":"Site Engineer",
    "location":"Abu Dhabi, UAE",
    "description":"Lead site execution and coordination for infrastructure packages.",
    "department":"Operations",
    "employmentType":"Full-time"
  }'
```

List open:

```bash
curl http://localhost:4321/api/jobs
```

Update:

```bash
curl -X PATCH "http://localhost:4321/api/jobs?id=<JOB_ID>" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JOBS_API_KEY" \
  -d '{"description":"Updated role scope and responsibilities."}'
```

Archive (safe delete):

```bash
curl -X DELETE "http://localhost:4321/api/jobs?id=<JOB_ID>&confirm=true&confirmTitle=<EXACT_JOB_TITLE>" \
  -H "Authorization: Bearer $JOBS_API_KEY"
```

## Custom GPT Action Mapping

Recommended action operations:

1. `listJobs` -> `GET /api/jobs`
2. `createJob` -> `POST /api/jobs`
3. `updateJob` -> `PATCH /api/jobs?id={id}`
4. `archiveJob` -> `DELETE /api/jobs?id={id}&confirm=true&confirmTitle={title}`

Security requirements:

- Store `JOBS_API_KEY` only in GPT Action secret configuration.
- Never expose the key to frontend/browser code.
- Rotate the key if leaked.

## Custom GPT Actions OpenAPI Import

Use one of these spec files:

- `docs/CUSTOM_GPT_JOBS_ACTIONS_OPENAPI.yaml`
- `docs/CUSTOM_GPT_JOBS_ACTIONS_OPENAPI_STRICT.yaml` (recommended for production)

Setup checklist:

1. In Custom GPT builder, open **Actions** and import the YAML file.
2. Replace server URL in the spec with your live API domain (where `/api/jobs` is reachable).
3. Add secret:
   - Name: `JOBS_API_KEY`
   - Value: your server-side `JOBS_API_KEY`
4. Configure auth header for action calls:
   - Preferred: `Authorization: Bearer {{JOBS_API_KEY}}`
   - Alternative: `x-jobs-api-key: {{JOBS_API_KEY}}`

Recommended exposed actions:

1. `listJobs`
2. `createJob`
3. `updateJob`
4. `archiveJob`

For safer production usage, import `docs/CUSTOM_GPT_JOBS_ACTIONS_OPENAPI_STRICT.yaml` and expose only:

1. `listJobs`
2. `updateJob`
3. `archiveJob`
