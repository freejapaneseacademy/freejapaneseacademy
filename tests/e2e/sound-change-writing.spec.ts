import { test, expect } from '@playwright/test';

test('Chapter 03 L07 writing studio gives kana feedback and supports self-review', async ({ page }) => {
  await page.goto('/learn/start/module-01/chapter-03/lesson-07/');
  await expect(page.getByRole('heading', { name: /Write the rhythm: meaningful kana messages/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Writing studio/i })).toBeVisible();
  await page.getByLabel('1. A photograph of a grandmother').fill('おばあさん');
  await page.getByRole('button', { name: 'Check 12 kana answers' }).click();
  await expect(page.getByText('1 / 12')).toBeVisible();
  await expect(page.getByText('The long a needs an extra あ', { exact: false })).toBeVisible();
  await page.getByLabel('1. Write “This is a photograph of a grandmother.”').fill('これは おばあさん の しゃしん です。');
  await page.getByRole('button', { name: 'Reveal model answers for self-review' }).click();
  await expect(page.getByText('Model (not an exclusive answer):').first()).toBeVisible();
  await page.getByRole('button', { name: 'Clear my longer drafts' }).click();
  await expect(page.getByLabel('1. Write “This is a photograph of a grandmother.”')).toHaveValue('');
});

test('Chapter 03 L07 is usable on 320px screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/learn/start/module-01/chapter-03/lesson-07/');
  await expect(page.getByRole('button', { name: 'Check 12 kana answers' })).toBeVisible();
  await expect(page.locator('#kana-grandmother')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2);
  expect(overflow).toBe(false);
});
