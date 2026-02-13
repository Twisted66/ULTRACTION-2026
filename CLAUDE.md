# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ULTRACTION GENERAL CONTRACTING LLC** - Construction company website built with Astro framework.

- **Site**: https://ultraction.ae
- **Framework**: Astro (SSR mode with Node.js adapter)
- **Styling**: Tailwind CSS with custom design tokens
- **Interactive Components**: React with Framer Motion animations

## Commands

```bash
# Development
npm run dev              # Start dev server at localhost:4321
npm run build            # Build for production (outputs to ./dist/)
npm run preview          # Preview production build locally
npm start                # Start production server (runs ./dist/server/entry.mjs)

# Astro CLI
npm run astro ...        # Run any Astro CLI command
```

## Architecture

### File Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.astro      # Fixed header with desktop/mobile nav
│   │   └── Footer.astro      # Site footer with contact info
│   ├── sections/              # Reusable page sections
│   │   ├── Hero.astro       # Full-viewport hero component
│   │   ├── Stats.astro       # Statistics counters (React)
│   │   ├── Services.astro    # Services grid
│   │   ├── Projects.astro    # Projects gallery from content collection
│   │   └── ...
│   ├── animations/            # React components using Framer Motion
│   │   ├── TextTypeAnimation.tsx   # Typing effect for words
│   │   ├── Globe.tsx               # 3D globe animation
│   │   └── HomeHeroRemotion.tsx  # Remotion video animations
│   └── common/                # Shared utilities
│       ├── VideoPlayer.astro  # Video background player
│       ├── ProjectCard.tsx   # Individual project card
│       └── InfiniteScroll.astro # Horizontal scrolling gallery
├── content/
│   ├── config.ts              # Content collection schemas (blog, projects)
│   ├── blog/                  # Blog post markdown files
│   └── projects/               # Project markdown files
├── layouts/
│   └── Layout.astro           # Base layout with Header/Footer
├── pages/
│   ├── index.astro            # Home page
│   ├── projects.astro         # Projects gallery with filters
│   ├── projects/*.astro        # Category-specific project pages
│   ├── about.astro
│   ├── services.astro
│   ├── contact.astro
│   ├── blog/
│   │   ├── index.astro
│   │   └── [slug].astro          # Dynamic blog post routes
│   └── projects/[slug].astro    # Dynamic project detail pages
└── styles/
    └── global.css              # Design tokens + Tailwind directives
```

### Component Types

- **`.astro` files**: Static components, no JS shipped by default
- **`.tsx` files**: Interactive React components, require `client:` directive when used in `.astro`
- **`.jsx` files**: React components without TypeScript

### React Client Directives

When using React components in `.astro` files, specify when to hydrate:
- `client:load` - Load immediately on page load
- `client:idle` - Load during browser idle (default for animations)
- `client:visible` - Load when component enters viewport

```astro
<TextTypeAnimation client:idle words="Word1,Word2,Word3" />
```

## Design System

### Colors (HSL format in `global.css`)

Light mode:
- `--color-primary`: 0 0% 8% (Black #141414)
- `--color-accent`: 2 64% 21% (Maroon #2c1810)
- `--color-bg`: 33 55% 83% (Beige #e8dcc8)
- `--color-surface`: 33 52% 93% (Light beige #f2ece1)

Dark mode (via `.dark` class):
- Backgrounds darken, foregrounds invert for contrast
- Accent lightens for better visibility

### Typography

- **Headings**: Public Sans (`--font-heading`)
- **Body**: Inter (`--font-body`)
- **Scale**: xs(12.8px), sm(14px), base(16px), lg(20px), xl(25px), 2xl(31.25px), 3xl(39.06px), 4xl(48.83px)

### Spacing Scale

`--space-1`: 4px, `--space-2`: 8px, `--space-3`: 12px, `--space-4`: 16px, `--space-6`: 24px, `--space-8`: 32px, `--space-12`: 48px

### Border Radius

`--radius`: 0px (sharp corners for industrial/construction aesthetic)

## Content Collections

Defined in `src/content/config.ts` with Zod validation:

### Blog Collection
```typescript
{
  title: string,
  description: string,
  pubDate: Date,
  author: string,
  image?: string,
  category?: string,
  tags?: string[]
}
```

### Projects Collection
```typescript
{
  title: string,
  client?: string,
  location: string,
  completed: Date,
  category: 'infrastructure' | 'residential' | 'commercial' | 'industrial' | 'marine' | 'heritage' | 'oil-gas',
  featured?: boolean,
  images?: string[],
  size?: string,
  duration?: string,
  status?: string
}
```

Query content in components:
```astro
---
import { getCollection } from 'astro:content';

const allProjects = await getCollection('projects');
const featuredProjects = allProjects.filter(p => p.data.featured);
---
```

## Key Components

### Header.astro
- Fixed position (`fixed top-0`)
- Desktop: horizontal nav links with hover dots
- Mobile: hamburger menu with full-screen overlay
- Logo links to home page

### Footer.astro
- 3-column layout: Company info, Quick links, Contact info
- Social media links (Facebook, Instagram, LinkedIn)
- Copyright with dynamic year

### VideoPlayer.astro
Props: `src`, `poster?`, `autoplay?`, `muted?`, `loop?`, `controls?`, `fallbackImage?`
- Defaults: autoplay, muted, loop (for hero backgrounds)

### TextTypeAnimation.tsx
Props: `words` (comma-separated string), `typingSpeed?`, `deletingSpeed?`, `pauseDuration?`
- Cycles through words with typing/deleting effect
- Blinking cursor animation

### InfiniteScroll.astro
Props: `images` array with `{ src, alt }`
- Duplicates image set for seamless loop
- Pauses on hover
- 40s animation duration

## Page Routes

- `/` - Home page with video hero, stats, services preview, featured projects
- `/about` - Company information
- `/services` - Service offerings
- `/projects` - Project gallery with category filters
- `/projects/[slug]` - Individual project detail pages
- `/blog` - Blog listing
- `/blog/[slug]` - Individual blog posts
- `/contact` - Contact form

## Important Patterns

### Hero Sections
Full viewport height with gradient overlay for text readability:
```astro
<section class="relative w-full h-screen min-h-[600px] overflow-hidden">
  <VideoPlayer src="/video/hero.mp4" />
  <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
  <!-- Content -->
</section>
```

### Project Cards
Hover effect with overlay:
```css
.project-overlay { opacity: 0; transition: 0.3s; }
.project-card:hover .project-overlay { opacity: 1; }
.project-card:hover img { transform: scale(1.05); }
```

### Grid Borders
Use `grid-border-r`, `grid-border-b` utilities for prominent grid lines.

## Static Assets

- Logos: `public/logo/UGC-HEADER.png`, `public/logo/UGC-LOGO-HQ.png`
- Project images: `public/images/projects/[category]/`
- Client logos: `src/assets/clients/`
- Video: `public/video/hero.mp4`

## Deployment

- **Output mode**: `server` (see `astro.config.mjs`)
- **Adapter**: Node.js standalone
- **Build output**: `./dist/`
- **Server entry**: `./dist/server/entry.mjs`

The site is configured for SSR with Node.js adapter for standalone deployment.
