import { test, expect } from '@playwright/test';

const publisher = 'ca-pub-3399213817491318';
const exactSrc = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + publisher;

test('shared layout includes the AdSense publisher script exactly once on all page types', async ({ page }) => {
  // Prevent third-party ad activity during functional tests; inspect the actual document markup.
  await page.route('https://pagead2.googlesyndication.com/**', route => route.abort());
  for (const path of [
    '/',
    '/learn/start/module-01/chapter-01/lesson-06/',
    '/dashboard/',
    '/privacy/',
    '/learn/n5/'
  ]) {
    await page.goto(path);
    const scripts = page.locator('head script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]');
    await expect(scripts, 'AdSense script should appear once in the shared page head: ' + path).toHaveCount(1);
    await expect(scripts.first()).toHaveAttribute('src', exactSrc);
    await expect(scripts.first()).toHaveAttribute('async', '');
    await expect(scripts.first()).toHaveAttribute('crossorigin', 'anonymous');
  }
});

test('publisher has an accessible root ads.txt seller entry', async ({ request }) => {
  const response = await request.get('/ads.txt');
  expect(response.status()).toBe(200);
  expect((await response.text()).trim()).toBe('google.com, pub-3399213817491318, DIRECT, f08c47fec0942fa0');
});
