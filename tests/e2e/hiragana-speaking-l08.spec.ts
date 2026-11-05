import { test, expect } from '@playwright/test';
const route = '/learn/start/module-02/chapter-01/lesson-08/';
test('L08 uses two real licensed models and supports optional speaking without grading the voice', async ({ page }) => {
  await page.goto(route);
  await expect(page.getByRole('heading', { name: 'Shadow familiar hiragana words' })).toBeVisible();
  await expect(page.locator('audio[src$="fja-l0-m02-c01-l06-a-v1.wav"]')).toHaveCount(1);
  await expect(page.locator('audio[src$="fja-l0-m02-c01-l06-b-v1.wav"]')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Play track A turn 1' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Play track B turn 2' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Start optional recording' })).toBeVisible();
  await expect(page.getByText('No speaking score is saved.', { exact: false })).toBeVisible();
  await expect(page.locator('[data-question-id]')).toHaveCount(5);
  await expect(page.getByRole('button', { name: 'Check preparation and save knowledge score' })).toBeDisabled();
  for (const fieldset of await page.locator('[data-question-id]').all()) await fieldset.locator('input[type=radio]').first().check();
  await expect(page.getByRole('button', { name: 'Check preparation and save knowledge score' })).toBeEnabled();
  await page.getByRole('button', { name: 'Check preparation and save knowledge score' }).click();
  await expect(page.getByText(/knowledge answers correct/)).toBeVisible();
  await expect(page.locator('.foundation-feedback')).toHaveCount(5);
});
test('L08 fits 320px and keyboard can check rubric', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto(route);
  const check = page.getByLabel('I recognized and repeated かさ (umbrella) in Track A.');
  await check.focus(); await page.keyboard.press('Space');
  await expect(check).toBeChecked();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(322);
});
