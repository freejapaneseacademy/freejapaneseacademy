import { test, expect } from '@playwright/test';

const route = '/learn/start/module-01/chapter-03/lesson-08/';

test('L08 serves licensed model playback and accessible optional speaking without an automatic pronunciation grade', async ({ page }) => {
  await page.goto(route);
  await expect(page.getByRole('heading', { name: 'Speak the rhythm in real Japanese conversations' })).toBeVisible();
  await expect(page.locator('audio[src$="fja-l0-m01-c03-l06-a-v1.wav"]')).toHaveCount(1);
  await expect(page.locator('audio[src$="fja-l0-m01-c03-l06-b-v1.wav"]')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Play track A turn 1' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Play track B turn 4' })).toBeEnabled();
  await expect(page.getByText('No speaking score is saved.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start optional recording' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Check preparation and save knowledge score' })).toBeDisabled();
  await expect(page.locator('[data-question-id]')).toHaveCount(5);
  for (const fieldset of await page.locator('[data-question-id]').all()) {
    await fieldset.locator('input[type=radio]').first().check();
  }
  await expect(page.getByRole('button', { name: 'Check preparation and save knowledge score' })).toBeEnabled();
  await page.getByRole('button', { name: 'Check preparation and save knowledge score' }).click();
  await expect(page.getByText(/knowledge answers correct/)).toBeVisible();
  await expect(page.locator('.foundation-feedback')).toHaveCount(5);
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('button', { name: 'Check preparation and save knowledge score' })).toBeDisabled();
});

test('L08 works at 320px with keyboard navigation and no horizontal page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(route);
  await expect(page.getByRole('heading', { name: 'Speak the rhythm in real Japanese conversations' })).toBeVisible();
  // The static Astro HTML can show the button before React hydration attaches handlers.
  // Wait for the island's own hydrated signal, then verify the keyboard activation.
  await expect(page.getByRole('button', { name: 'Play track A turn 1' })).toBeEnabled();
  const reveal = page.getByRole('button', { name: 'Show full transcript and translation' }).first();
  await reveal.focus();
  await page.keyboard.press('Enter');
  await expect(reveal).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('heading', { name: 'Japanese', exact: true }).first()).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  expect(overflow).toBe(false);
});
