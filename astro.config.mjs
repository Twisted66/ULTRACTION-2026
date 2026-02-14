// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  // cPanel Node.js deployment (keeps `/api/*` routes working).
  output: 'server',
  adapter: node({ mode: 'standalone' }),
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
