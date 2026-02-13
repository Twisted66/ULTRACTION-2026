# Contact Form Setup (Astro + Microsoft Graph + cPanel Node)

## 1. Environment variables

Set these in your cPanel Node app environment:

- `MS_TENANT_ID`
- `MS_CLIENT_ID`
- `MS_CLIENT_SECRET`
- `MS_SENDER_USER` (example: `info@ultraction.ae`)
- `CONTACT_RECEIVER_EMAIL` (optional, defaults to `info@ultraction.ae`)

## 2. Microsoft Outlook / Graph configuration

1. Open Azure Portal -> Entra ID -> App registrations -> New registration.
2. Create app, then copy:
   - Application (client) ID -> `MS_CLIENT_ID`
   - Directory (tenant) ID -> `MS_TENANT_ID`
3. Go to `Certificates & secrets` -> create a client secret -> `MS_CLIENT_SECRET`.
4. Go to `API permissions`:
   - Add permission -> Microsoft Graph -> **Application permissions**
   - Add `Mail.Send`
5. Click **Grant admin consent** for the tenant.
6. Ensure mailbox in `MS_SENDER_USER` exists and is permitted for sending with the app context in your Microsoft 365 setup.

## 3. Build and run on cPanel

From project root:

```bash
npm install
npm run build
npm run start
```

Use `npm run start` as the cPanel Node app startup command.

## 4. Smoke test

After deploy, test API directly:

```bash
curl -X POST https://your-domain.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","subject":"project","message":"Testing contact form from API."}'
```

Expected success response:

```json
{"ok":true,"message":"Your message has been sent."}
```
