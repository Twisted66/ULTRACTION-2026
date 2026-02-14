# Repository Guidelines

## Project Structure & Module Organization
This repository is an Astro + React site for Ultraction.

- `src/pages/`: route entrypoints (`index.astro`, `about.astro`, `projects/[slug].astro`, API at `src/pages/api/contact.ts`).
- `src/components/`: UI blocks by domain (`sections/`, `layout/`, `animations/`, `projects/`, `ui/`).
- `src/content/`: Markdown content collections (`blog/`, `projects/`) and schema config in `src/content/config.ts`.
- `src/styles/`: global styles (`global.css`).
- `src/assets/` and `public/`: static/media assets.
- `docs/`: operational setup docs (contact form, Sentry).
- `dist/`: production build output (generated).

## Build, Test, and Development Commands
Run commands from repository root:

- `npm install`: install dependencies.
- `npm run dev`: start local dev server (default `http://localhost:4321`).
- `npm run build`: create production output in `dist/`.
- `npm run preview`: serve built output for local verification.
- `npm run start`: run the server entrypoint from `dist/` (after build).
- `npm run astro -- check`: run Astro/TypeScript checks.

## Coding Style & Naming Conventions
- Use 2-space indentation in `.astro`, `.ts`, `.tsx`, `.jsx`, and CSS files.
- Prefer TypeScript for shared logic (`src/lib`, interactive components).
- Components/pages: PascalCase for component files (e.g., `ProjectCard.tsx`), lowercase route files for pages (`about.astro`).
- Content files: kebab-case slugs in `src/content/projects/` and `src/content/blog/`.
- Keep section components focused; place reusable logic in `src/lib/` or `src/utils/`.

## Testing Guidelines
There is no dedicated automated test framework configured yet. Before opening a PR:

- Run `npm run astro -- check`.
- Run `npm run build` to catch type/build regressions.
- Manually verify changed pages in `npm run dev` or `npm run preview`.
- For content changes, verify target slug routes render correctly.

## Commit & Pull Request Guidelines
Current history uses concise, title-style commits (examples: `Feature: Modern homepage with CTO statement`, `Initial commit: ULTRACTION website source`). Follow this pattern:

- Commit format: `<Type>: <short description>` (e.g., `Fix: contact API validation`).
- Keep commits scoped to one logical change.
- PRs should include: summary, affected routes/components, verification steps, and screenshots/GIFs for UI changes.
- Link related issues/tasks and call out any required environment variables (`.env`, `.env.local`).

## Security & Configuration Tips
- Never commit secrets; keep keys in `.env.local` and update `.env.example` when adding new variables.
- Review `docs/CONTACT_FORM_SETUP.md` and `docs/SENTRY_SETUP.md` when touching integrations.
