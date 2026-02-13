// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [
    react(),
    tailwind(),
  ],
  site: 'https://ultraction.ae',
  vite: {
    server: {
      // Increase body size limit to 15MB for file uploads
      bodySizeLimit: '15mb',
    },
  },
});
