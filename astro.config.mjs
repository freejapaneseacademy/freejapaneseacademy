import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.PUBLIC_SITE_URL || 'https://free-japanese-academy.pages.dev';
export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    react(),
    mdx(),
    sitemap({ filter: (page) => !/\/(dashboard|practice\/demo|privacy|learn\/(n4|n3|n2|n1)|learn\/n5\/hiragana-introduction)\/?$/.test(page) })
  ],
  vite: { plugins: [tailwindcss()] }
});
