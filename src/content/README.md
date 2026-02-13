# Content Collections Guide

This directory contains Astro content collections for the ULTRACTION website.

## Collections

### Blog Collection
Located in: `src/content/blog/*.md`

**Frontmatter Schema:**
```yaml
---
title: "Required - Post title"
description: "Required - Post description/excerpt"
pubDate: 2025-02-09  # Required - Publication date
author: "Required - Author name"
image: "/images/blog/example.jpg"  # Optional - Featured image URL
category: "Industry News"  # Optional - Content category
tags: ["construction", "UAE"]  # Optional - Array of tags
featured: true  # Optional - Defaults to false
---
```

**Example Usage in Astro:**
```astro
---
import { getCollection } from 'astro:content';

const allPosts = await getCollection('blog');
const featuredPosts = allPosts.filter(post => post.data.featured);
---

{allPosts.map((post) => (
  <a href={`/blog/${post.slug}`}>
    <h2>{post.data.title}</h2>
    <p>{post.data.description}</p>
    <small>{post.data.pubDate.toLocaleDateString()}</small>
  </a>
))}
```

### Projects Collection
Located in: `src/content/projects/*.md`

**Frontmatter Schema:**
```yaml
---
title: "Required - Project title"
client: "Required - Client name"
location: "Required - Project location"
completed: 2024-12-01  # Required - Completion date
category: "Commercial"  # Required - One of: Commercial, Residential, Industrial, Infrastructure, Renovation, Other
featured: true  # Optional - Defaults to false
images:
  - "/projects/image1.jpg"  # Optional - Array of image URLs
thumbnail: "/projects/thumb.jpg"  # Optional - Thumbnail image URL
projectSize: "45,000 sq ft"  # Optional
duration: "18 months"  # Optional
status: "Completed"  # Optional - One of: Completed, In Progress, Upcoming (defaults to Completed)
---
```

**Example Usage in Astro:**
```astro
---
import { getCollection } from 'astro:content';

const allProjects = await getCollection('projects');
const commercialProjects = allProjects.filter(
  project => project.data.category === 'Commercial'
);
---

{allProjects.map((project) => (
  <div class="project-card">
    <img src={project.data.thumbnail || project.data.images[0]} alt={project.data.title} />
    <h3>{project.data.title}</h3>
    <p>{project.data.client}</p>
    <p>{project.data.location}</p>
    <span>{project.data.category}</span>
  </div>
))}
```

## Validation

All content is validated using Zod schemas defined in `config.ts`. If you add or edit content and it doesn't match the schema, Astro will show you helpful error messages during build.

## Creating New Content

1. Create a new `.md` file in the appropriate collection directory
2. Add frontmatter with all required fields
3. Write your content in Markdown below the frontmatter
4. Astro will automatically include it in the collection

## Content Querying

You can query and filter collections in any Astro component:

```astro
---
import { getCollection } from 'astro:content';

// Get all items
const allItems = await getCollection('blog');

// Filter by custom logic
const publishedItems = allItems.filter(item => item.data.pubDate <= new Date());

// Sort by date
const sortedItems = allItems.sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
---
```

## TypeScript Support

The schemas provide full TypeScript autocomplete and type safety:

```astro
---
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

const posts = await getCollection('blog');

// TypeScript knows the shape of post.data
const titles = posts.map((post: CollectionEntry<'blog'>) => post.data.title);
---
```
