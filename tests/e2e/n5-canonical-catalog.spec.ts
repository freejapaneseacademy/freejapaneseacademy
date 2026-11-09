import { test, expect } from '@playwright/test';
test('N5 course catalog links only to published canonical lesson routes', async ({page}) => {
  await page.goto('/learn/n5/');
  const cards = page.locator('a[data-canonical-n5-lesson-id]');
  await expect(cards).toHaveCount(35);
  await expect(cards.first()).toHaveAttribute('href', '/learn/n5/module-01/chapter-01/lesson-01/');
  await expect(cards.last()).toHaveAttribute('href', '/learn/n5/module-01/chapter-04/lesson-08/');
  await expect(page.getByRole('heading', {name:/Study in module and chapter order/i})).toBeVisible();
});
test('N5 course catalog remains readable at 320px and in dark mode', async ({page}) => {
  await page.setViewportSize({width:320,height:720});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto('/learn/n5/');
  await expect(page.locator('a[data-canonical-n5-lesson-id]')).toHaveCount(35);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)).toBe(false);
});
