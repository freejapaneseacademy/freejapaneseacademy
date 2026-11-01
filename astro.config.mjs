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
    sitemap({ filter: (page) => {
      const path = new URL(page).pathname;
      const foundationsPublished = path === '/learn/start/' || path === '/learn/start/module-01/chapter-01/lesson-01/';
      if (path.startsWith('/learn/start/') && !foundationsPublished) return false;
      return !/\/(dashboard|practice\/demo|privacy|learn\/(n4|n3|n2|n1)|learn\/n5\/hiragana-introduction)\/?$/.test(path);
    } })
  ],
  vite: { plugins: [tailwindcss()] }
});
