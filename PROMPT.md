# Production Finalization Prompt

Finalize ULTRACTION to production on this cPanel host.

## Target State

- web root is `~/public_html`
- secure PHP code is in `~/private`
- no nested `~/public_html/public_html`

## Package Layout Expected

- extracted `public_html/*` must become `~/public_html/*`
- extracted `private/*` must become `~/private/*`

## Execute Now

1. Find latest uploaded `ultraction-cpanel-static-*.zip`.
2. Back up current `~/public_html` and `~/private` with timestamps.
3. Extract zip into a temp dir and inspect contents before copying.
4. Deploy by copying:
   - extracted `public_html/.` -> `~/public_html/`
   - extracted `private` -> `~/private`
5. Remove or avoid any accidental nested `~/public_html/public_html`.
6. Verify these exist:
   - `~/public_html/index.html`
   - `~/public_html/_astro`
   - `~/public_html/api/contact.php`
   - `~/public_html/api/jobs.php`
   - `~/public_html/api/news.php`
   - `~/public_html/api/.htaccess`
   - `~/private/bootstrap.php`
   - `~/private/config.php`
   - `~/private/db.php`
   - `~/private/lib`
   - `~/private/schema/mysql.sql`
7. Ensure runtime dirs exist and are writable:
   - `~/private/uploads/contact-attachments`
   - `~/private/var/rate_limits`
   - `~/private/logs`
8. Configure production secrets for PHP runtime safely outside web root:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
   - `JOBS_API_KEY`
   - `NEWS_API_KEY`
   - `CONTACT_RECEIVER_EMAIL`
9. Confirm PHP environment supports:
   - PHP 8.1+
   - `pdo_mysql`
   - `fileinfo`
10. Apply `~/private/schema/mysql.sql` to the production MySQL DB safely and idempotently.
11. Verify production:
   - site homepage loads
   - `/contact` loads
   - `GET /api/jobs?status=open` returns JSON
   - `GET /api/news?status=published` returns JSON
   - protected writes reject missing auth
12. If anything fails, fix it and continue until working.

## Report Back With

- zip used
- backup paths
- final deployed paths
- config method used for secrets
- schema changes applied
- verification results
- any remaining blocker
