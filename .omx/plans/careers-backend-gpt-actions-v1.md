# Careers Backend + Custom GPT Actions Plan (v1)

## Context
ULTRACTION currently has a static careers page (`src/pages/careers.astro`) that routes applications into the contact workflow (`/contact?subject=careers`), and a working API pattern in `src/pages/api/contact.ts` with validation/rate-limiting + Microsoft Graph mail integration. The objective is to make open jobs backend-managed and updatable by a Custom GPT Action without introducing a CMS or broad refactor.

## Work Objectives
1. Serve open jobs from a backend endpoint instead of hardcoded careers content.
2. Allow secure mutations (create/update/close/list) from Custom GPT Actions.
3. Keep current applicant submission flow intact for v1 (`contact` subject = `careers`).
4. Avoid architecture-wide changes and keep implementation scoped.

## Guardrails
### Must Have
- New jobs API with auth for write operations and public read for open roles.
- Validation, rate limits, and deterministic error responses.
- Careers page rendering driven by backend jobs feed + explicit empty state.
- Deployment/runtime decision documented before coding starts.

### Must NOT Have
- No CMS adoption in v1.
- No admin dashboard UI in v1.
- No ATS workflow expansion (candidate pipeline/status management).
- No broad route/component refactor outside careers/jobs scope.

## Task Flow (3-6 steps)

### 1) Lock Runtime + Storage Decision
Define and approve v1 execution model: Astro runtime API on current hosting vs external backend service, plus persistent storage choice (file store vs managed DB).

**Acceptance criteria**
- One approved runtime/storage decision is written in plan notes.
- Decision includes persistence guarantee and recovery/backups approach.
- Decision includes where secrets live in each environment.

### 2) Define Jobs Schema + API Contract (v1)
Create a strict v1 jobs schema and endpoint contract for `GET /api/jobs` and secured mutation operations (`POST/PATCH` and optional `DELETE`).

**Acceptance criteria**
- Required/optional fields are explicitly listed (including status and timestamps).
- Open-list sort/filter rules are explicit and testable.
- Status code matrix is defined (`200/201/204/400/401/403/404/409`).
- Non-goals and out-of-scope operations are listed.

### 3) Plan Backend Implementation Scope
Plan exact backend files to add/modify using existing Astro API patterns (`src/pages/api/contact.ts`) for validation, auth, and rate limits.

**Acceptance criteria**
- File-level change list is explicit (new API route, storage adapter/module, env docs updates).
- Write auth model for GPT Actions is defined (header/API key or signed token).
- Audit logging requirement is either included or explicitly deferred.

### 4) Plan Careers Page Integration
Plan UI integration for `src/pages/careers.astro` to consume backend jobs and preserve current application CTA behavior.

**Acceptance criteria**
- Rendering strategy is defined (server-side fetch vs client fetch) with freshness target.
- Empty state behavior and fallback behavior on API failure are specified.
- Existing `contact?subject=careers` apply flow is preserved unless explicitly changed.

### 5) Plan Custom GPT Action Wiring + Verification
Define Action schema and end-to-end verification steps for secure GPT-driven job updates.

**Acceptance criteria**
- Custom GPT Action function schema maps to approved jobs mutation operations.
- Auth and secret handling path for Action calls is documented.
- Verification checklist includes: unauthenticated write rejection, valid write success, list refresh visibility window, and build/check pass.

## Detailed TODOs for Executor Handoff
- Create/modify only scoped files for jobs API, storage module, careers data rendering, and docs/env updates.
- Add contract tests or deterministic manual test scripts for jobs API operations.
- Add deployment/runbook notes for runtime requirements and rollback.
- Perform smoke tests from Custom GPT Action and direct cURL requests.

## Success Criteria
- Open jobs are backend-managed and visible on `/careers`.
- Custom GPT Action can securely create/update/close openings.
- Unauthorized mutations are blocked.
- No CMS introduced and no broad refactor performed.
- Existing careers application path remains functional.
