import { test, expect } from '@playwright/test';
const url = '/learn/n5/module-05/chapter-02/lesson-05/';
test('keyboard selection, feedback, local attempt and retry', async ({ page }) => {
  await page.goto(url);
  await expect(page.getByRole('heading', { name: 'Read a weekend trip itinerary: transport and companions' })).toBeVisible();
  const qs = page.locator('.foundation-question');
  await expect(qs).toHaveCount(12);
  for (let i = 0; i < 12; i++) {
    const radio = qs.nth(i).getByRole('radio').first();
    await radio.focus();
    await page.keyboard.press('Space');
    await expect(radio).toBeChecked();
  }
  await page.getByRole('button', { name: 'Check answers and save score' }).click();
  await expect(page.locator('.foundation-question .foundation-feedback')).toHaveCount(12);
  await page.getByRole('button', { name: 'Retry reading check' }).click();
  await expect(page.locator('.foundation-question .foundation-feedback')).toHaveCount(0);
});
test('320px dark mode and writing model are usable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto(url);
  await expect(page.getByRole('heading', { name: 'Find the companion and transport evidence' })).toBeVisible();
  await page.getByLabel('Write three Japanese sentences about a destination, a vehicle and a companion or solo return.').fill('友達と行きます。');
  await page.getByRole('button', { name: 'Compare with model' }).click();
  await expect(page.getByText(/午後四時に一人で家に帰ります/).last()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});
