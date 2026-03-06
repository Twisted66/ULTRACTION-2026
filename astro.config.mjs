<<<<<<< HEAD
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Static export for cPanel deployment (standard hosting)
  output: 'static',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://ultraction.ae',
  build: {
    format: 'directory',
  },
});
=======
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://ultraction.ae',
  build: {
    format: 'directory',
  },
});
>>>>>>> origin/master
