import { defineCollection, z } from 'astro:content';

// Project category enum
const projectCategory = z.enum([
  'infrastructure',
  'residential',
  'commercial',
  'industrial',
  'marine',
  'heritage',
  'oil-gas',
]);

// Blog collection
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string(),
    image: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

// Projects collection
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string().optional(),
    location: z.string(),
    completed: z.coerce.date(),
    category: projectCategory,
    featured: z.boolean().default(false),
    images: z.array(z.string()).optional(),
    size: z.string().optional(),
    duration: z.string().optional(),
    status: z.string().optional(),
  }),
});

export const collections = { blog, projects };
