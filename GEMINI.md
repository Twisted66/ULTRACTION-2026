# GEMINI.md - ULTRACTION Website Context

This document provides essential context and instructions for AI agents working on the ULTRACTION GENERAL CONTRACTING LLC website.

## 🏗️ Project Overview

- **Purpose**: Official website for ULTRACTION GENERAL CONTRACTING LLC, a premium construction company.
- **Framework**: [Astro](https://astro.build/) (Static (SSG) output).
- **Architecture**: Astro components for static structure, React for interactive elements and animations.
- **Tech Stack**:
  - **UI/Interactivity**: React 19, Framer Motion, Remotion, Lucide React.
  - **Styling**: Tailwind CSS with custom design tokens (see `BRAND.md`).
  - **Content**: Type-safe Markdown collections (Blog, Projects).
  - **Animations**: Complex animations using Framer Motion and 3D effects (Globe, Globe.gl).

## 🚀 Getting Started

### Key Commands
| Command | Description |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start development server at `localhost:4321` |
| `npm run build` | Build for production (outputs to `./dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run astro -- check` | Run type and Astro structural checks |

### Environment Variables
- Ensure `.env` is configured based on `.env.example`.
- Integrations for Contact Form and Sentry are documented in `docs/`.

## 📁 Project Structure

- `src/pages/`: Route entrypoints (lowercase filenames).
- `src/components/`: UI components organized by domain (`sections/`, `layout/`, `animations/`, `ui/`, `about/`, `common/`, `projects/`).
- `src/content/`: Markdown data for projects and blog posts (schema in `config.ts`).
- `src/layouts/`: Base `Layout.astro` providing global structure.
- `src/styles/`: `global.css` containing design tokens and Tailwind directives.
- `src/lib/` & `src/utils/`: Shared logic, types, and helper functions.

## 🎨 Design & Coding Conventions

### Brand Identity (Industrial Aesthetic)
- **Colors**: Primary Black (#141414), Accent Maroon (#2c1810), Background Beige (#e8dcc8).
- **Typography**: `Public Sans` (Headings), `Inter` (Body).
- **Corners**: Sharp (`--radius: 0px`).
- **Structure**: Bold grid lines (`grid-border-r`, etc.).

### Development Guidelines
- **Indentation**: 2 spaces for all file types.
- **Naming**: `PascalCase.tsx` for React components, `kebab-case.astro` for Astro components (except in `pages/` where lowercase is preferred).
- **React Hydration**: Always use appropriate `client:` directives (e.g., `client:idle`, `client:visible`).
- **Typing**: Use TypeScript for all logic and shared components.
- **Commits**: Follow the `<Type>: <short description>` format (e.g., `Feature: Add project filtering`).

## 🧪 Testing & Quality
- No automated test suite currently exists.
- **Mandatory Verification**:
  1. Run `npm run astro -- check`.
  2. Run `npm run build` to verify production readiness.
  3. Manually test UI/animations in different viewport sizes.

## 📖 Key Documentation
- `AGENTS.md`: Detailed repository guidelines.
- `CLAUDE.md`: Architectural deep-dive for AI assistants.
- `BRAND.md`: Full design system and color palette.
- `HERO-USAGE.md`: Guide for hero section components.
- `PROJECTS_COMPONENT_GUIDE.md`: Documentation for project components.
- `docs/`: Integration-specific guides.
