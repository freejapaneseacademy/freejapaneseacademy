import { test, expect } from '@playwright/test';

const route = '/learn/start/module-01/chapter-03/lesson-02/';

test('Chapter 03 L02 teaches written rhythm contrasts and gives evidence-based feedback', async ({ page }) => {
  await page.goto(route);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Small changes');
  await expect(page.getByRole('heading', { name: 'Written word recognition check' })).toBeVisible();
  const questions = page.locator('fieldset');
  await expect(questions).toHaveCount(8);
  await expect(page.getByRole('button', { name: 'Submit answers' })).toBeDisabled();
  const answers = [1, 1, 0, 1, 1, 1, 0, 1];
  for (let i = 0; i < answers.length; i++) {
    await questions.nth(i).locator('input[type="radio"]').nth(answers[i]).check();
  }
  await page.getByRole('button', { name: 'Submit answers' }).click();
  await expect(page.getByText('8 / 8 correct.', { exact: false })).toBeVisible();
  await expect(questions.first().getByText('Correct.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('button', { name: 'Submit answers' })).toBeDisabled();
});

test('Chapter 03 L02 works at narrow viewport with keyboard navigation and feedback', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(route);
  const questions = page.locator('fieldset');
  await expect(questions).toHaveCount(8);
  await expect(questions.first().locator('input[type="radio"]').first()).toBeEnabled();
  await questions.first().locator('input[type="radio"]').first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(questions.first().locator('input[type="radio"]').nth(1)).toBeChecked();
  for (let i = 1; i < 8; i++) await questions.nth(i).locator('input[type="radio"]').first().check();
  await page.getByRole('button', { name: 'Submit answers' }).click();
  await expect(page.getByText('Review.', { exact: false }).first()).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(overflow).toBe(false);
});

test('Chapter 03 L02 retains shared layout AdSense and does not claim audio scoring', async ({ page }) => {
  await page.route('https://pagead2.googlesyndication.com/**', r => r.abort());
  await page.goto(route);
  await expect(page.locator('head script[src*="adsbygoogle.js"]')).toHaveCount(1);
  await expect(page.getByText('This is not an audio or pronunciation test.', { exact: false })).toBeVisible();
});
