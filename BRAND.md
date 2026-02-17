# ULTRACTION Brand Documentation

> Complete brand guidelines for the ULTRACTION GENERAL CONTRACTING LLC website
> Last Updated: 2025-02-17

---

## Table of Contents
1. [Brand Overview](#brand-overview)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Border Radius & Design Elements](#border-radius--design-elements)
6. [Animation & Motion](#animation--motion)
7. [Component Patterns](#component-patterns)
8. [Logo Guidelines](#logo-guidelines)
9. [Layout & Grid System](#layout--grid-system)
10. [Accessibility](#accessibility)

---

## Brand Overview

**ULTRACTION GENERAL CONTRACTING LLC** is a premium construction company with a brand identity characterized by:

- **Industrial Aesthetic**: Sharp corners, bold grid lines, strong structural elements
- **Professional Authority**: Black and maroon color scheme conveying sophistication
- **Modern Precision**: Clean typography and deliberate spacing choices
- **Trustworthy Presence**: Beige backgrounds providing warmth and approachability

The brand balances industrial strength with refined elegance, appealing to both B2B and B2C audiences in the construction sector.

---

## Color Palette

### Primary Colors (Light Mode)

| Token | HSL Value | Hex Value | Usage |
|-------|-----------|-----------|-------|
| `--color-primary` | 0 0% 8% | #141414 | Black - primary text, borders, strong elements |
| `--color-accent` | 2 64% 21% | #2c1810 | Maroon - accents, secondary elements |
| `--color-bg` | 33 55% 83% | #e8dcc8 | Beige - page background |
| `--color-surface` | 33 52% 93% | #f2ece1 | Light Beige - card surfaces |
| `--color-border` | 30 44% 70% | #b8a486 | Earthy Brown - input borders, dividers |
| `--color-text` | 0 0% 8% | #141414 | Black - default text |

### Semantic Color Mappings

| Token | HSL Value | Semantic Usage |
|-------|-----------|----------------|
| `--background` | 33 55% 83% | Page background |
| `--foreground` | 0 0% 8% | Primary text content |
| `--card` | 33 52% 93% | Card backgrounds |
| `--card-foreground` | 0 0% 8% | Card text |
| `--primary` | 0 0% 8% | Primary buttons, links |
| `--primary-foreground` | 0 0% 96% | Primary button text |
| `--secondary` | 2 64% 21% | Secondary elements, accents |
| `--secondary-foreground` | 0 0% 96% | Secondary button text |
| `--muted` | 30 44% 70% | Subtle backgrounds, disabled |
| `--muted-foreground` | 0 0% 30% | Muted text, hints |
| `--accent` | 2 64% 21% | Hover states, highlights |
| `--accent-foreground` | 0 0% 96% | Accent text |
| `--destructive` | 0 84% 60% | Error states, warnings |
| `--border` | 0 0% 8% | Strong borders, dividers |
| `--input` | 30 44% 70% | Input field borders |
| `--ring` | 2 64% 21% | Focus rings |

### Dark Mode Colors

| Token | HSL Value | Usage |
|------|-----------|-------|
| `--background` | 5 30% 8% | #1a1209 - Dark background |
| `--foreground` | 0 0% 96% | #f5f5f5 - Light text |
| `--card` | 5 25% 14% | #2c1e12 - Dark card surfaces |
| `--card-foreground` | 0 0% 93% | #ededed - Card text |
| `--primary` | 0 0% 96% | Light primary elements |
| `--primary-foreground` | 5 30% 8% | Primary text on light |
| `--secondary` | 2 64% 41% | Lighter maroon for dark mode |
| `--accent` | 2 64% 41% | Lighter maroon accent |
| `--border` | 0 0% 0% | Black borders |

### Focus Ring Styles

```css
/* Light mode */
--focus-ring: 0 0 0 3px rgba(44, 24, 16, 0.4);

/* Dark mode */
--focus-ring: 0 0 0 3px rgba(152, 97, 57, 0.4);
```

---

## Typography

### Font Families

| Token | Font Stack | Usage |
|-------|------------|-------|
| `--font-heading` | 'Public Sans', system-ui, Helvetica, Arial, sans-serif | Headings, titles, navigation |
| `--font-body` | 'Inter', system-ui, Helvetica, Arial, sans-serif | Body text, paragraphs |

**Import Statement:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Public+Sans:wght@400;500;600;700&display=swap');
```

### Font Weights

| Weight | CSS Value | Usage |
|--------|-----------|-------|
| Normal | 400 | Body text, regular content |
| Medium | 500 | Emphasis, subheadings |
| Semibold | 600 | Headings, important text |
| Bold | 700 | Navigation, titles, strong emphasis |

### Type Scale (1.25 Ratio)

| Token | Size (px) | REM | Usage |
|------|-----------|-----|-------|
| `--text-xs` | 12.8px | 0.8rem | Captions, labels, metadata |
| `--text-sm` | 14px | 0.875rem | Small text, secondary information |
| `--text-base` | 16px | 1rem | Body text, standard content |
| `--text-lg` | 20px | 1.25rem | Large body text, quotes |
| `--text-xl` | 25px | 1.5625rem | Subheadings, card titles |
| `--text-2xl` | 31.25px | 1.953rem | Section titles, H3 |
| `--text-3xl` | 39.06px | 2.441rem | Page titles, H2 |
| `--text-4xl` | 48.83px | 3.052rem | Hero titles, H1 |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `--leading-tight` | 1.2 | Headings, tight vertical spacing |
| `--leading-normal` | 1.6 | Body text, comfortable reading |

### Typography Classes

```css
.section-title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 600;
  margin-bottom: var(--space-6);
  color: hsl(var(--primary));
}

.body-text {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: hsl(var(--foreground));
}
```

---

## Spacing System

### Spacing Scale (4px Base Unit)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Ultra tight spacing, borders |
| `--space-2` | 8px | Padding for small elements |
| `--space-3` | 12px | Component spacing |
| `--space-4` | 16px | Standard padding/margin |
| `--space-6` | 24px | Section spacing, button padding |
| `--space-8` | 32px | Large spacing, section margins |
| `--space-12` | 48px | Hero sections, major spacing |
| `--space-16` | 64px | Extra large spacing |

### Spacing in Components

```css
/* Card padding */
.surface-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  padding: var(--space-6);
}

/* Chip/button padding */
.spacing-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) var(--space-4);
}

/* Section margins */
.section {
  margin-top: var(--space-12);
  margin-bottom: var(--space-12);
}
```

---

## Border Radius & Design Elements

### Corner Design

| Token | Value | Design Philosophy |
|-------|-------|-------------------|
| `--radius` | 0px | Sharp corners for industrial aesthetic |

**Rationale**: The zero-radius choice reflects the construction industry's precision and structural integrity. Sharp edges convey strength, professionalism, and attention to detail.

### Grid Border Utilities

The design uses prominent grid borders for visual structure:

```css
.grid-border-r { border-right: 1px solid currentColor; }
.grid-border-b { border-bottom: 1px solid currentColor; }
.grid-border-l { border-left: 1px solid currentColor; }
.grid-border-t { border-top: 1px solid currentColor; }

/* Dark mode override */
@media (prefers-color-scheme: dark) {
  .grid-border-r, .grid-border-b,
  .grid-border-l, .grid-border-t {
    border-color: #000000 !important;
  }
}
```

### Dividers

```css
/* Primary divider */
.divider {
  border-top: 1px solid hsl(var(--border));
  margin: var(--space-8) 0;
}

/* Strong divider */
.divider-strong {
  border-top: 2px solid hsl(var(--primary));
}
```

---

## Animation & Motion

### Duration Scale

| Token | Duration | Usage |
|-------|----------|-------|
| `--motion-duration-fast` | 180ms | Quick transitions, hover states |
| `--motion-duration-base` | 300ms | Standard transitions |
| `--motion-duration-medium` | 500ms | Moderate animations |
| `--motion-duration-slow` | 700ms | Slow animations, emphasis |

### Easing Functions

| Token | Function | Usage |
|-------|----------|-------|
| `--motion-ease-standard` | cubic-bezier(0.2, 0, 0, 1) | Smooth, natural motion |
| `--motion-ease-emphasized` | cubic-bezier(0.16, 1, 0.3, 1) | Bouncy, emphasized motion |

### Animation Utilities

```css
.motion-fast {
  transition-duration: var(--motion-duration-fast);
  transition-timing-function: var(--motion-ease-standard);
}

.motion-base {
  transition-duration: var(--motion-duration-base);
  transition-timing-function: var(--motion-ease-standard);
}

.motion-medium {
  transition-duration: var(--motion-duration-medium);
  transition-timing-function: var(--motion-ease-standard);
}

.motion-slow {
  transition-duration: var(--motion-duration-slow);
  transition-timing-function: var(--motion-ease-emphasized);
}

/* Transition properties */
.media-motion { transition-property: transform, opacity, filter; }
.overlay-motion { transition-property: opacity, background-color; }
.color-motion { transition-property: color, background-color, border-color; }
```

### Keyframe Animations

```css
/* Slow pulse for ambient elements */
@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

/* Slower pulse with delay */
@keyframes pulse-slower {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.15); }
}

.animate-pulse-slow {
  animation: pulse-slow 12s ease-in-out infinite;
}

.animate-pulse-slower {
  animation: pulse-slower 10s ease-in-out infinite;
  animation-delay: 1s;
}
```

---

## Component Patterns

### Navigation Links

**Desktop Navigation:**
```css
.nav-link {
  padding: 1.5rem 2rem; /* py-6 px-8 */
  color: #000000;
  transition: background-color var(--motion-duration-base);
  font-weight: 700;
  letter-spacing: -0.025em; /* tracking-tight */
  font-size: 0.875rem; /* text-sm */
}

.nav-link:hover {
  background-color: hsl(var(--primary) / 0.1);
}

.nav-link--active::after {
  content: '';
  display: block;
  width: 6px;
  height: 6px;
  background: hsl(var(--accent));
  border-radius: 50%;
  margin: 4px auto 0;
}
```

**Mobile Navigation:**
```css
.mobile-nav-link {
  padding: 1rem 1.5rem; /* py-4 px-6 */
  min-height: 44px; /* Touch target size */
  font-weight: 500;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: background-color var(--motion-duration-base);
}
```

### Buttons

**Primary Button (Accent Background):**
```css
.btn-primary {
  display: inline-block;
  background-color: hsl(var(--accent));
  color: hsl(var(--background));
  padding: 0.75rem 1.5rem; /* py-3 px-6 */
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-wide */
  transition: all var(--motion-duration-base);
}

.btn-primary:hover {
  background-color: hsl(var(--background));
  color: hsl(var(--primary));
}
```

**Secondary Button (Outline):**
```css
.btn-secondary {
  display: inline-block;
  background-color: transparent;
  color: hsl(var(--primary));
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid hsl(var(--primary));
  transition: all var(--motion-duration-base);
}

.btn-secondary:hover {
  background-color: hsl(var(--primary));
  color: hsl(var(--background));
}
```

### Cards and Surfaces

```css
.surface-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  padding: var(--space-6);
}

.surface-card--elevated {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### Project Cards with Hover Effects

```css
.project-card {
  position: relative;
  overflow: hidden;
}

.project-card img {
  transition: transform var(--motion-duration-medium) var(--motion-ease-standard);
}

.project-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  opacity: 0;
  transition-property: opacity;
  transition-duration: var(--motion-duration-base);
  transition-timing-function: var(--motion-ease-standard);
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-card:hover img {
  transform: scale(1.05);
}
```

### Category Badges

```css
.category-badge {
  display: inline-block;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: hsl(var(--accent));
  color: hsl(var(--background));
}
```

---

## Logo Guidelines

### Logo Files

| File | Usage | Format |
|------|-------|--------|
| `UGC-HEADER.png` | Primary logo for header | PNG with transparency |
| `UGC-LOGO-HQ.png` | High-resolution version | PNG with transparency |
| `ULTRACTION-LOGO.pdf` | Vector version for print | PDF vector |

### Logo Specifications

| Context | Height | Notes |
|---------|--------|-------|
| Header (Mobile) | 48px | Standard mobile header |
| Header (Desktop) | 64px | Standard desktop header |
| Footer | 32px | With brightness filter for white appearance |

### Logo Implementation

```html
<!-- Header logo -->
<img src="/logo/UGC-HEADER.png" alt="ULTRACTION" class="h-12 md:h-16 w-auto" />

<!-- Footer logo (inverted for dark background) -->
<img src="/logo/UGC-HEADER.png" alt="ULTRACTION" class="h-8 w-auto brightness-0 invert" />
```

### Logo Usage Rules

1. **Minimum clear space**: Maintain padding equal to the height of the "U" character
2. **Don't stretch**: Always maintain aspect ratio
3. **Background contrast**: Ensure sufficient contrast for readability
4. **Alt text**: Always include "ULTRACTION" as alt text for accessibility

---

## Layout & Grid System

### Responsive Breakpoints

| Breakpoint | Width | Device Context |
|------------|-------|----------------|
| `sm` | 640px | Large phones, landscape |
| `md` | 768px | Tablets portrait |
| `lg` | 1024px | Tablets landscape, small laptops |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large screens |

### Grid System

**Standard Grid:**
```css
/* Mobile: 1 column */
.grid-standard {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .grid-standard {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3-4 columns */
@media (min-width: 1024px) {
  .grid-standard {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .grid-standard {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

**Masonry Grid for Projects:**
```css
.grid-masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
  grid-auto-rows: 10px;
}

.grid-masonry-item--span-2 {
  grid-row: span 20;
}

.grid-masonry-item--span-3 {
  grid-row: span 30;
}
```

### Container Widths

| Context | Max Width | Padding |
|---------|-----------|---------|
| Mobile | 100% | 1rem (16px) |
| Tablet | 100% | 2rem (32px) |
| Desktop | 1280px | 3rem (48px) |

```css
.container {
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@media (min-width: 1280px) {
  .container {
    padding-left: 3rem;
    padding-right: 3rem;
  }
}
```

### Section Header Pattern

```css
.section-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.section-header__subtitle {
  display: inline-block;
  font-size: var(--text-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: hsl(var(--accent));
  margin-bottom: var(--space-3);
  position: relative;
}

.section-header__subtitle::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background: hsl(var(--accent));
}

.section-header__title {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 600;
  color: hsl(var(--primary));
}

@media (min-width: 768px) {
  .section-header__title {
    font-size: var(--text-4xl);
  }
}
```

---

## Accessibility

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable smooth scrolling */
  html {
    scroll-behavior: auto;
  }

  /* Immediate transitions */
  .motion-fast,
  .motion-base,
  .motion-medium,
  .motion-slow {
    transition-duration: 1ms !important;
    animation-duration: 1ms !important;
  }

  /* Disable hover animations */
  .project-overlay,
  .project-card img {
    transition: none !important;
  }

  .project-card:hover img {
    transform: none !important;
  }

  /* Disable animations */
  * {
    animation: none !important;
  }
}
```

### Touch Target Sizes

**Minimum touch target: 44x44px**

```css
/* Ensure adequate touch targets */
.btn-primary,
.btn-secondary,
.nav-link,
.mobile-nav-link {
  min-height: 44px;
  min-width: 44px;
}
```

### Focus Management

```css
/* Visible focus indicators */
:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

/* Skip link for keyboard navigation */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: hsl(var(--accent));
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Color Contrast

All text must meet WCAG AA standards:
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text** (18px+): Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio against background

### ARIA Labels

```html
<!-- Navigation -->
<nav aria-label="Main navigation">

<!-- Mobile menu button -->
<button aria-label="Toggle navigation menu" aria-expanded="false">

<!-- Project cards -->
<article aria-labelledby="project-title-1">
  <h2 id="project-title-1">Project Name</h2>
</article>
```

---

## Scrollbar Styling

### Custom Scrollbar

```css
/* WebKit browsers (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: hsl(var(--color-bg));
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--color-border));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--color-accent));
}
```

---

## Summary

The ULTRACTION brand identity is defined by:

1. **Industrial Aesthetic**: Sharp corners (0px radius) and bold grid lines
2. **Color Strategy**: Black (#141414) and Maroon (#2c1810) with Beige (#e8dcc8) backgrounds
3. **Typography**: Public Sans for headings, Inter for body text
4. **Motion**: Smooth animations with 180-700ms durations
5. **Structure**: Strong visual hierarchy through spacing and typography scale
6. **Accessibility**: Reduced motion support, 44px touch targets, WCAG AA contrast

This documentation serves as the single source of truth for all design decisions on the ULTRACTION website.

---

*For questions or clarifications about this brand guide, please refer to the project's CLAUDE.md file.*
