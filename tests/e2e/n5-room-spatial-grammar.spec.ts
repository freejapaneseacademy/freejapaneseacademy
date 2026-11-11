import { test, expect } from '@playwright/test';
const url = '/learn/n5/module-02/chapter-04/lesson-03/';
test('keyboard answers, feedback and retry', async ({ page }) => {
  await page.goto(url);
  await expect(page.getByRole('heading', { name: 'Describing a room' })).toBeVisible();
  const groups = page.locator('fieldset');
  await expect(groups).toHaveCount(12);
  for (let i = 0; i < 12; i++) {
    await groups.nth(i).getByRole('radio').first().focus();
    await page.keyboard.press('Space');
  }
  await page.getByRole('button', { name: 'Check answers' }).click();
  await expect(page.getByText(/Written practice: \d+ of 12 correct/)).toBeVisible();
  await expect(groups.first().getByText(/Correct|Review/)).toBeVisible();
  await page.getByRole('button', { name: 'Retry questions' }).click();
  await expect(page.getByRole('button', { name: 'Check answers' })).toBeVisible();
});
test('320px dark mode has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto(url);
  await expect(page.locator('fieldset')).toHaveCount(12);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});