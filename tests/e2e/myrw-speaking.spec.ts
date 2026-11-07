import { test, expect } from '@playwright/test';

const route = '/learn/start/module-02/chapter-03/lesson-08/';

test('M/Y/R/W speaking lesson renders licensed model players and six knowledge prompts', async ({ page }) => {
  await page.goto(route);
  await expect(page.getByRole('heading', { name: 'Shadow M/Y/R/W words in everyday conversations' })).toBeVisible();
  await expect(page.locator('audio[src^="/audio/fja-l0-m02-c03-l06-"]')).toHaveCount(2);
  await expect(page.locator('fieldset[data-question-id^="ex-l0-m02-c03-l08-"]')).toHaveCount(6);
  await expect(page.getByText('Optional private recording')).toBeVisible();
  await expect(page.getByText('Self-review · no speaking score')).toBeVisible();
});

test('keyboard answers optional knowledge check and saves a separate numeric result', async ({ page }) => {
  await page.goto(route);
  const questions = page.locator('fieldset[data-question-id^="ex-l0-m02-c03-l08-"]');
  await expect(questions).toHaveCount(6);
  // The React island enables its questions after hydration; pressing Space
  // while the fieldset is still disabled silently fails on slower CI runners.
  await expect(questions.first()).toBeEnabled();
  for (let i = 0; i < 6; i++) {
    const first = questions.nth(i).locator('input[type="radio"]').first();
    await first.focus();
    await page.keyboard.press('Space');
    await expect(first).toBeChecked();
  }
  await page.getByRole('button', { name: 'Check preparation and save knowledge score' }).click();
  await expect(page.getByText(/knowledge answers correct/)).toBeVisible();
  await expect(page.getByText('Numeric knowledge score saved locally. This does not measure your voice.')).toBeVisible();
});

test('speaking page remains usable at 320px without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto(route);
  await expect(page.getByRole('heading', { name: 'Listen and shadow · optional speaking' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});
