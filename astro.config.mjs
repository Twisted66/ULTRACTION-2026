// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // Static export for cPanel deployment (standard hosting)
  output: 'static',
  integrations: [
    react(),
    tailwind(),
  ],
  site: 'https://ultraction.ae',
  build: {
    format: 'directory',
  },
  vite: {
    server: {
      // Increase body size limit to 15MB for file uploads
      bodySizeLimit: '15mb',
    },
  },
});
