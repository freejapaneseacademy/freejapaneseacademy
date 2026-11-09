import { test, expect } from '@playwright/test';
const path = '/learn/n5/module-01/chapter-01/lesson-01/';
test('320px dark-mode first meeting scene questions remain accessible', async ({ page }) => {
 await page.setViewportSize({ width: 320, height: 720 });
 await page.emulateMedia({ colorScheme: 'dark' });
 await page.goto(path);
 await expect(page.getByRole('heading', { level: 1, name: /First meetings/i })).toBeVisible();
 await expect(page.locator('fieldset[data-question-id]')).toHaveCount(8);
 expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});
test('keyboard answer selection, feedback and retry', async ({ page }) => {
 await page.goto(path);
 for (const fieldset of await page.locator('fieldset[data-question-id]').all()) {
  const first = fieldset.getByRole('radio').first();
  await first.focus();
  await page.keyboard.press('Space');
 }
 await page.getByRole('button', { name: 'Check answers' }).click();
 await expect(page.getByText(/Practice score:/)).toBeVisible();
 await page.getByRole('button', { name: 'Start a new attempt' }).click();
 await expect(page.getByRole('button', { name: 'Check answers' })).toBeDisabled();
});
