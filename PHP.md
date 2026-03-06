# PHP Backend Plan

## Goal

Move the current Astro static frontend to a cPanel-friendly PHP backend architecture without changing the frontend behavior more than necessary.

The frontend should remain a static Astro build in `public_html`, while backend logic moves to PHP endpoints under `public_html/api/`.

## Current API Surface

The frontend currently depends on these endpoints:

- `POST /api/contact`
- `GET /api/jobs`
- `POST /api/jobs`
- `PATCH /api/jobs?id=...`
- `DELETE /api/jobs?id=...`
- `GET /api/news`
- `POST /api/news`
- `PATCH /api/news?id=...`
- `DELETE /api/news?id=...`

## Recommended cPanel Architecture

Use plain PHP 8.1+ with PDO and MySQL.

Recommended structure:

```text
public_html/
  index.html
  _astro/
  images/
  api/
    contact.php
    jobs.php
    news.php

private/
  config.php
  bootstrap.php
  db.php
  lib/
    auth.php
    mail.php
    rate_limit.php
    response.php
    validation.php
  uploads/
    contact-attachments/
```

Notes:

- Keep static Astro output in `public_html`.
- Keep secrets and reusable PHP logic outside `public_html`.
- Store uploaded files outside public web access if hosting allows it.

## Endpoint Plan

### `/api/contact`

Method:

- `POST`

Responsibilities:

- accept `multipart/form-data`
- optionally accept JSON if needed later
- validate contact form fields
- support optional file upload
- support careers submissions through the same endpoint
- enforce honeypot field
- enforce rate limiting
- send email
- optionally log/store submissions in MySQL

Expected response shape:

```json
{ "ok": true, "message": "Your message has been sent." }
```

Validation rules to preserve:

- `name`: 2 to 100 chars
- `email`: valid email, max 254 chars
- `subject`: allowed values only
- `message`: 10 to 5000 chars
- attachment max size: 10 MB
- allowed file types only
- honeypot field `company`

Mail implementation:

- preferred for cPanel: SMTP via PHPMailer
- avoid Microsoft Graph for this PHP path unless required

### `/api/jobs`

Methods:

- `GET /api/jobs?status=open|closed|all`
- `POST /api/jobs`
- `PATCH /api/jobs?id=...`
- `DELETE /api/jobs?id=...`

Responsibilities:

- public read for open jobs
- protected read for closed or all jobs
- protected write access for admin and GPT Actions
- keep current JSON contract so frontend pages continue to work

Auth:

- support `x-jobs-api-key`
- support `Authorization: Bearer ...`

### `/api/news`

Methods:

- `GET /api/news?status=published|draft|archived|all`
- `POST /api/news`
- `PATCH /api/news?id=...`
- `DELETE /api/news?id=...`

Responsibilities:

- public read for published news
- protected read for draft, archived, and all
- protected writes
- keep current response shapes for frontend compatibility

Auth:

- support `x-news-api-key`
- support `Authorization: Bearer ...`

## Database Plan

Use MySQL instead of JSON or file-backed stores.

### `contact_submissions`

Suggested fields:

- `id`
- `name`
- `email`
- `subject`
- `subject_label`
- `message`
- `company`
- `attachment_path`
- `attachment_name`
- `ip`
- `user_agent`
- `created_at`

### `jobs`

Suggested fields:

- `id`
- `slug`
- `title`
- `location`
- `description`
- `department`
- `employment_type`
- `status`
- `posted_at`
- `archived_at`
- `created_at`
- `updated_at`

### `news`

Suggested fields:

- `id`
- `slug`
- `title`
- `excerpt`
- `content`
- `category`
- `author`
- `image`
- `source_name`
- `source_url`
- `source_published_at`
- `status`
- `published_at`
- `archived_at`
- `created_at`
- `updated_at`

### `news_tags`

Suggested fields:

- `id`
- `news_id`
- `tag`

Optional:

- `api_rate_limits`

Only needed if rate limiting must persist across PHP processes.

## Security Baseline

Minimum requirements:

- store secrets outside `public_html`
- use prepared statements only
- validate request method and content type
- enforce max upload size in PHP config and app logic
- sanitize uploaded filenames
- rate limit by IP
- use constant-time comparison for API keys
- log server-side failures without exposing internals to users
- only add CORS if cross-origin access is required

## Frontend Compatibility Rules

Keep the frontend changes minimal:

- continue using `/api/contact`
- continue using `/api/jobs`
- continue using `/api/news`
- preserve current JSON response shapes as much as possible

Important deployment note:

- Astro static builds generate `dist/api/*` output
- real PHP endpoints must replace those static API files in cPanel
- do not upload static Astro `api/*` output over the PHP endpoints

## Recommended Delivery Order

1. Create MySQL schema for `jobs`, `news`, `news_tags`, and `contact_submissions`.
2. Build shared PHP bootstrap, DB connection, JSON response helpers, auth, and validation.
3. Implement `contact.php` with SMTP mail and file uploads.
4. Implement `jobs.php` with matching read/write behavior.
5. Implement `news.php` with matching read/write behavior.
6. Update deployment flow so Astro static assets and PHP endpoints coexist cleanly.
7. Test `/contact`, `/careers`, `/careers-admin`, and GPT Actions flows.

## Pragmatic Recommendation

Start with:

1. `contact.php`
2. `jobs.php`

These are the most directly tied to active site flows and business operations.

`news.php` should follow once those are stable.
