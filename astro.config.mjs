import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';

const site = process.env.PUBLIC_SITE_URL || 'https://free-japanese-academy.pages.dev';
const publicFoundationUrls = new Set(
  JSON.parse(readFileSync(new URL('./docs/LESSON_INVENTORY.json', import.meta.url), 'utf8')).items
    .filter(item => item.status === 'published' && item.noindex === false && typeof item.url === 'string')
    .map(item => new URL(item.url, site).pathname)
);

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    react(),
    mdx(),
    sitemap({ filter: (page) => {
      const path = new URL(page).pathname;
      const foundationsPublished = path === '/learn/start/' || publicFoundationUrls.has(path);
      if (path.startsWith('/learn/start/') && !foundationsPublished) return false;
      return !/\/(dashboard|practice\/demo|privacy|learn\/(n4|n3|n2|n1)|learn\/n5\/hiragana-introduction)\/?$/.test(path);
    } })
  ],
  vite: { plugins: [tailwindcss()] }
});
