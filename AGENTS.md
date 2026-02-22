# Repository Guidelines

## Project Structure & Module Organization
This repository is an Astro + React marketing site for Ultraction with content-driven project/blog pages.

- `src/pages/`: route entrypoints and APIs (`index.astro`, `about.astro`, `services.astro`, `projects.astro`, `projects/[slug].astro`, `blog/[slug].astro`, `api/contact.ts`, `api/element-capture.ts`).
- `src/components/`: UI blocks by area (`about/`, `sections/`, `layout/`, `animations/`, `common/`, `projects/`, `ui/`).
- `src/content/`: Markdown collections (`blog/`, `projects/`) and schemas in `src/content/config.ts`.
- `src/data/`: structured UI data (`services.ts`).
- `src/lib/`: shared logic/types (`graph-mail.ts`, `project-types.ts`).
- `src/styles/global.css`: global tokens, typography, utilities, and motion helpers.
- `public/` + `src/assets/`: static/public media and bundled image assets.
- `docs/`: integration runbooks (`CONTACT_FORM_SETUP.md`, `SENTRY_SETUP.md`).
- `mcp/element-inspector-app/`: separate MCP app subproject (own `package.json` and scripts).
- `email-signatures/`, `reports/`, `output/`, `tmp/`: supporting artifacts and experiments, not core runtime app routes.
- `dist/` and `.astro/`: generated outputs.

## Build, Test, and Development Commands
Run from repository root:

- `npm install`: install dependencies.
- `npm run dev`: start local Astro dev server (`http://localhost:4321`).
- `npm run build`: static production build to `dist/`.
- `npm run preview`: preview the built site.
- `npm run astro -- check`: Astro/TypeScript diagnostics across project files.

Notes:
- There is currently no root `npm run start` script.
- `astro.config.mjs` uses `output: 'static'` for cPanel/static deployment.

## Coding Style & Naming Conventions
- Use 2-space indentation in `.astro`, `.ts`, `.tsx`, `.jsx`, and `.css`.
- Prefer TypeScript for shared logic and interactive components.
- Use PascalCase for components (`ProjectCard.tsx`), lowercase for route files (`about.astro`), kebab-case for content slugs.
- Keep reusable logic in `src/lib/` or `src/data/`; keep large page sections in `src/components/sections/`.
- Use Astro-compatible attribute naming in `.astro` templates (for SVG prefer kebab-case attrs like `stroke-linecap`).

## Content & Category Consistency
- Project categories are schema-enforced in `src/content/config.ts` (`infrastructure`, `residential`, `commercial`, `industrial`, `marine`, `heritage`, `oil-gas`).
- When adding/changing categories, keep these in sync:
  `src/content/config.ts`, `src/lib/project-types.ts`, filter UI in `src/pages/projects.astro` and/or `src/components/sections/ProjectFilter.tsx`, and category landing routes under `src/pages/projects/`.
- Ensure each project markdown entry has valid frontmatter and matching image paths under `public/images/projects/...`.

## API & Environment Notes
- Contact endpoint: `src/pages/api/contact.ts` (rate limiting + optional attachments up to 10MB).
- Mail integration: `src/lib/graph-mail.ts` via Microsoft Graph.
- Required mail env vars: `MS_TENANT_ID`, `MS_CLIENT_ID`, `MS_CLIENT_SECRET`, `MS_SENDER_USER`.
- Optional mail env var: `CONTACT_RECEIVER_EMAIL` (defaults to `info@ultraction.ae`).
- Additional env vars in use: `SENTRY_DSN`, `SENTRY_ENVIRONMENT` (see `.env.example`).

## Testing & Verification
No dedicated automated test framework is configured yet.

Before PR:
- Run `npm run build` to verify static generation and route output.
- Run `npm run astro -- check` and document unresolved diagnostics if they are pre-existing/non-scope.
- Manually verify impacted pages in `npm run dev` or `npm run preview`.
- For content changes, verify affected slug pages and category pages render correctly.

## Commit & Pull Request Guidelines
- Commit format: `<Type>: <short description>` (e.g., `Fix: contact API validation`).
- Keep one logical change per commit.
- PRs should include: summary, changed routes/components, verification steps, and screenshots/GIFs for UI changes.
- Link related issues/tasks and list any required env vars (`.env.local` / cPanel environment).

## Security & Configuration Tips
- Never commit secrets. Keep credentials in `.env.local` / deployment environment variables.
- Keep `.env.example` updated when introducing new variables.
- Review `docs/CONTACT_FORM_SETUP.md` and `docs/SENTRY_SETUP.md` when touching integrations.
