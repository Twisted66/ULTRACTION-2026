// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Server output is required for API routes (/api/contact, /api/jobs).
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://ultraction.ae',
  build: {
    format: 'directory',
  },
});
