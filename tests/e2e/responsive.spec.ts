import { test, expect } from '@playwright/test';

const paths = ['/', '/learn/', '/learn/n5/', '/learn/n5/hiragana-introduction/', '/practice/demo/', '/dashboard/', '/faq/'];
const widths = [320, 360, 390, 430, 530, 768, 820, 1024, 1280];

for (const width of widths) {
  test('responsive layout at ' + width + 'px: no horizontal scroll or obscured controls', async ({ page }) => {
    await page.setViewportSize({ width, height: 820 });
    for (const path of paths) {
      await page.goto(path);
      await expect(page.locator('header.site-header')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      const sizes = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        headerRight: document.querySelector('.header-inner')?.getBoundingClientRect().right ?? 0,
      }));
      expect(sizes.documentWidth, path + ' must not scroll horizontally at ' + width + 'px').toBeLessThanOrEqual(sizes.viewportWidth + 2);
      expect(sizes.headerRight, path + ' header must fit at ' + width + 'px').toBeLessThanOrEqual(width + 2);
    }
    await page.goto('/');
    if (width <= 1080) {
      const { card, note } = await page.evaluate(() => {
        const card = document.querySelector('.hero-card')!.getBoundingClientRect();
        const note = document.querySelector('.floating-note')!.getBoundingClientRect();
        return { card: { bottom: card.bottom }, note: { top: note.top } };
      });
      expect(note.top, 'floating note must be below the lesson card').toBeGreaterThanOrEqual(card.bottom - 1);
      await page.locator('.mobile-nav summary').click();
      await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
    }
    await page.locator('html').evaluate((el) => { el.dataset.theme = 'dark'; });
    await expect(page.locator('.hero-card')).toBeVisible();
  });
}
