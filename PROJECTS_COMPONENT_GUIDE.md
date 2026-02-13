# Projects Section Component

## Overview

The Projects section component displays featured construction projects in a responsive grid layout. It integrates with Astro's content collection system to dynamically render project cards.

## File Location

`C:\Users\NeilEdwardBaja\Desktop\CLONE\ultraction-website\src\components\sections\Projects.astro`

## Features

### Dynamic Content
- Fetches projects from `astro:content` collection
- Automatically sorts by completion date (newest first)
- Configurable limit on number of projects displayed
- Optional "show all" mode for full portfolio view

### Responsive Grid Layout
- **Desktop (>1024px)**: 3 columns
- **Tablet (768px-1024px)**: 2 columns
- **Mobile (<768px)**: 1 column

### Project Card Features
- Thumbnail image with lazy loading
- Placeholder SVG when no image available
- Featured badge (optional, based on project data)
- Category badge (always shown)
- Project title with line clamping
- Location with icon
- Client name with icon (optional)
- Project size with icon (optional)

### Interactive Effects
- Card hover: lift effect with enhanced shadow
- Image hover: smooth scale animation
- Border color change on hover
- Button hover with arrow animation

## Usage

### Basic Usage (Featured Projects)

```astro
---
import Projects from '@components/sections/Projects.astro';
---

<Projects />
```

This displays the first 6 projects (sorted by newest) with the default title "Featured Projects".

### Custom Title

```astro
---
import Projects from '@components/sections/Projects.astro';
---

<Projects title="Our Latest Work" />
```

### Show All Projects

```astro
---
import Projects from '@components/sections/Projects.astro';
---

<Projects showAll={true} title="Complete Portfolio" />
```

### Custom Limit

```astro
---
import Projects from '@components/sections/Projects.astro';
---

<Projects limit={3} title="Recent Projects" />
```

### Combined Props

```astro
---
import Projects from '@components/sections/Projects.astro';
---

<Projects
  showAll={false}
  title="Featured Developments"
  limit={4}
/>
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showAll` | `boolean` | `false` | If true, displays all projects. If false, limits to `limit` |
| `title` | `string` | `"Featured Projects"` | Section heading text |
| `limit` | `number` | `6` | Maximum number of projects to display (when `showAll` is false) |

## Content Collection Schema

The component expects projects to follow this schema (defined in `src/content/config.ts`):

```typescript
{
  title: string;           // Project title
  client?: string;         // Client name (optional)
  location: string;        // Project location
  completed: Date;         // Completion date
  category: string;        // Project category
  featured?: boolean;      // Whether to show "Featured" badge (default: false)
  images?: string[];       // Array of image paths (optional)
  size?: string;          // Project size (optional)
  duration?: string;      // Project duration (optional)
}
```

## Example Project Content

```markdown
---
title: "Modern Office Tower Dubai"
client: "ABC Corporation"
location: "Dubai Marina, UAE"
completed: 2024-12-01
category: "Commercial"
featured: true
size: "25,000 sq ft"
duration: "18 months"
images:
  - "/projects/office-tower-1.jpg"
  - "/projects/office-tower-2.jpg"
---

# Modern Office Tower Dubai

A state-of-the-art commercial tower...
```

## Styling

### Design Tokens Used

The component uses ULTRACTION brand design tokens:

- `--color-primary`: Dark brown for text
- `--color-accent`: Terracotta for badges and buttons
- `--color-surface`: Light beige background
- `--color-background`: Card background
- `--color-border`: Border color
- `--font-heading`: Public Sans for headings
- `--space-*`: Consistent spacing scale

### Customization

To customize the component's appearance, modify the scoped `<style>` section:

```css
/* Change grid gap */
.projects-grid {
  gap: var(--space-8); /* Increase spacing */
}

/* Adjust card hover effect */
.project-card:hover {
  transform: translateY(-12px); /* More lift */
  box-shadow: 0 20px 40px rgba(44, 24, 16, 0.2);
}

/* Modify badge colors */
.project-badge.featured {
  background: hsl(var(--color-primary)); /* Dark badge */
}
```

## Image Handling

### With Images

Projects with images use Astro's `<Image />` component for optimization:

```astro
<Image
  src={project.data.images[0]}
  alt={project.data.title}
  width={600}
  height={400}
  class="project-image"
  loading="lazy"
/>
```

### Without Images

Projects without images display a styled placeholder:

```astro
<div class="project-image-placeholder">
  <svg>...</svg>
</div>
```

### Image Paths

Image paths should be relative to the `public/` directory:

```markdown
---
images:
  - "/projects/office-tower-1.jpg"  # Stored in public/projects/
---
```

## Accessibility Features

- Semantic HTML with proper heading hierarchy
- Alt text for all images
- ARIA-compatible icon SVGs
- Keyboard-accessible links
- Sufficient color contrast
- Focus-visible states (via browser defaults)

## Performance Optimizations

- Lazy loading for images (`loading="lazy"`)
- Image optimization with Astro's `<Image />` component
- CSS-based animations (GPU-accelerated transforms)
- No JavaScript dependencies (pure CSS interactivity)
- Scoped styles to prevent CSS bloat

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Integration Examples

### Home Page

```astro
---
import Layout from '@layouts/Layout.astro';
import Projects from '@components/sections/Projects.astro';
---

<Layout title="ULTRACTION - Home">
  <main>
    <Hero />
    <Stats />
    <Services />
    <Projects limit={3} title="Featured Projects" />
    <ContactCTA />
  </main>
</Layout>
```

### Projects Page

```astro
---
import Layout from '@layouts/Layout.astro';
import Projects from '@components/sections/Projects.astro';
---

<Layout title="ULTRACTION - Projects">
  <main>
    <Projects showAll={true} title="Our Portfolio" />
  </main>
</Layout>
```

### Category-Specific Page

You can extend the component to filter by category:

```astro
---
// In Projects.astro, add a category filter:
const { category } = Astro.props;
const filteredProjects = category
  ? projects.filter(p => p.data.category === category)
  : projects;
---
```

## Troubleshooting

### Projects Not Displaying

**Issue**: No projects appear on the page

**Solutions**:
1. Verify project files exist in `src/content/projects/`
2. Check frontmatter matches the schema
3. Ensure `completed` date is valid
4. Check browser console for errors

### Images Not Loading

**Issue**: Placeholder appears instead of images

**Solutions**:
1. Verify image paths start with `/`
2. Check images exist in `public/` directory
3. Confirm file extensions are correct
4. Check image file permissions

### Styling Issues

**Issue**: Colors or spacing look incorrect

**Solutions**:
1. Verify design tokens are defined in `global.css`
2. Check CSS variables are properly set
3. Ensure no conflicting styles from other components
4. Test in different browsers

## Future Enhancements

Potential improvements for the component:

1. **Filter by Category**: Add category filter buttons
2. **Search Functionality**: Filter projects by search term
3. **Animation on Scroll**: Reveal cards as they enter viewport
4. **Masonry Layout**: Alternative layout for varied image sizes
5. **Lightbox Gallery**: Click to view full image gallery
6. **Load More Button**: Progressive loading for many projects
7. **Project Sharing**: Social sharing buttons
8. **Favorites System**: Allow users to save favorites

## Related Components

- `Hero.astro`: Main hero section
- `Services.astro`: Services grid section
- `Stats.astro`: Statistics section
- `ContactCTA.astro`: Call-to-action section

## Support

For issues or questions about this component:

1. Check the Astro documentation: https://docs.astro.build
2. Review content collections: https://docs.astro.build/en/guides/content-collections/
3. Consult ULTRACTION brand guidelines in `CLAUDE.md`

---

**Component Version**: 1.0.0
**Last Updated**: 2025-02-09
**Maintained By**: ULTRACTION Web Team
