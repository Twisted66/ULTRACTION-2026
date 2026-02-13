# Hero Component Usage Guide

## Location
`C:\Users\NeilEdwardBaja\Desktop\CLONE\ultraction-website\src\components\sections\Hero.astro`

## Overview
The Hero component is a full-viewport hero section for the ULTRACTION website with customizable content, CTAs, and background styling.

## Features
- Full viewport height (85vh mobile, 90vh tablet, 100vh desktop)
- Centered layout with prominent headline
- Dual CTA buttons (primary and secondary)
- Optional background gradient overlay
- Responsive design (mobile-first)
- Dark mode support
- Stats section (15+ Years, 200+ Projects, 50+ Team)
- Accessibility-focused (focus rings, proper contrast)

## Props Interface

```typescript
interface Props {
  title?: string;                    // Main headline
  subtitle?: string;                 // Subheading text
  primaryCta?: {                     // Primary button config
    text: string;
    href: string;
  };
  secondaryCta?: {                   // Secondary button config
    text: string;
    href: string;
  };
  showBackground?: boolean;          // Show gradient overlay (default: true)
}
```

## Default Values

```typescript
{
  title: "Building Excellence in the UAE",
  subtitle: "Your trusted partner for premium construction and renovation services",
  primaryCta: { text: "View Our Projects", href: "/projects" },
  secondaryCta: { text: "Get in Touch", href: "/contact" },
  showBackground: true
}
```

## Usage Examples

### 1. Default Usage (No Props)
```astro
---
import Hero from '../components/sections/Hero.astro';
---

<Hero />
```

### 2. Custom Title and Subtitle
```astro
---
import Hero from '../components/sections/Hero.astro';
---

<Hero
  title="Transforming Spaces, Exceeding Expectations"
  subtitle="Leading construction company delivering exceptional quality across the UAE"
/>
```

### 3. Custom CTAs
```astro
---
import Hero from '../components/sections/Hero.astro';
---

<Hero
  primaryCta={{ text: "Our Services", href: "/services" }}
  secondaryCta={{ text: "Request Quote", href: "/contact" }}
/>
```

### 4. No Background Gradient
```astro
---
import Hero from '../components/sections/Hero.astro';
---

<Hero
  showBackground={false}
  title="Premium Construction Services"
/>
```

### 5. Full Customization
```astro
---
import Hero from '../components/sections/Hero.astro';
---

<Hero
  title="Your Vision, Our Expertise"
  subtitle="Delivering world-class construction solutions since 2009"
  primaryCta={{ text: "Explore Portfolio", href: "/projects" }}
  secondaryCta={{ text: "Contact Us", href: "/contact" }}
  showBackground={true}
/>
```

## Integration in Page

### Example: Home Page (`src/pages/index.astro`)
```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/sections/Hero.astro';
---

<Layout title="ULTRACTION - Premium Construction Services">
  <Hero />
</Layout>
```

## Styling Details

### Colors Used
- **Primary**: Dark brown (`hsl(var(--color-primary))`)
- **Accent**: Terracotta (`hsl(var(--color-accent))`)
- **Background**: Beige gradient (`hsl(var(--color-bg))`)
- **Text**: Dark brown (`hsl(var(--color-text))`)

### Typography
- **Headings**: Public Sans (700 weight)
- **Body**: Inter (500 weight)
- **Sizes**: 48px (mobile) → 64px (desktop)

### Spacing
- **Horizontal padding**: `var(--space-6)` (24px mobile) → `var(--space-12)` (48px desktop)
- **Vertical padding**: `var(--space-12)` (48px)

### Responsive Breakpoints
- **Mobile**: < 768px (stacked buttons, smaller text)
- **Tablet**: 768px - 1024px (side-by-side buttons)
- **Desktop**: 1024px - 1280px (larger text, 90vh height)
- **Large Desktop**: ≥ 1280px (full 100vh height, 64px heading)

## Dark Mode

The component automatically adapts to dark mode when `.dark` class is applied to the HTML element:
- Background darkens
- Text colors invert for proper contrast
- Button hover states adjust
- Accent color maintains prominence

## Accessibility Features

- Proper semantic HTML (`<section>`, `<h1>`, `<a>`)
- Focus-visible ring for keyboard navigation
- ARIA-friendly button styling
- Color contrast ≥ 4.5:1
- `text-wrap: balance` for better heading distribution
- Responsive touch targets (≥ 44x44px)

## Animation & Interaction

### Button Hover Effects
- **Primary**: Background shifts to dark brown, slight lift (translateY -2px)
- **Secondary**: Transparent background with accent tint, slight lift
- **Active**: Returns to original position
- **Transition**: 200ms ease-in-out

### Background Overlay
- Radial gradient at 30% horizontal, 50% vertical
- 8% opacity accent color (light mode)
- 12% opacity accent color (dark mode)
- Subtle depth without interfering with content

## Stats Section

The Hero includes an integrated stats section showing:
- **15+ Years Experience**
- **200+ Projects Completed**
- **50+ Expert Team Members**

These stats are:
- Displayed in a responsive grid
- Center-aligned with the main content
- Separated by border-top
- Styled with accent color for numbers

## Files Modified/Created

**Created**: `C:\Users\NeilEdwardBaja\Desktop\CLONE\ultraction-website\src\components\sections\Hero.astro`

## Testing Checklist

- [ ] Default props render correctly
- [ ] Custom props override defaults
- [ ] Buttons link to correct pages
- [ ] Mobile responsive (stacked layout)
- [ ] Tablet responsive (side-by-side buttons)
- [ ] Desktop responsive (full height, larger text)
- [ ] Dark mode colors display correctly
- [ ] Focus states visible on keyboard navigation
- [ ] Hover states work on buttons
- [ ] Background gradient appears when `showBackground={true}`
- [ ] Stats section displays correctly at all breakpoints

## Next Steps

1. Import the Hero component in your home page
2. Test with dev server (`npm run dev`)
3. Adjust props as needed for your content
4. Consider adding background image option in future iterations
5. Add animations (fade-in, slide-up) for enhanced UX

---

**Component Status**: ✅ Ready for Use
**Last Updated**: 2025-02-09
**Brand Compliance**: ULTRACTION Design System v1.0
