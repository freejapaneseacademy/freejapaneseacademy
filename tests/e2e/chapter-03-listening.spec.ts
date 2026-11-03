import { test, expect } from '@playwright/test';

const route = '/learn/start/module-01/chapter-03/lesson-06/';

test('Chapter 03 listening has playable original tracks, six questions and hidden transcripts', async ({ page }) => {
  await page.goto(route);
  await expect(page.getByRole('heading', { name: /Listen to sound changes/i })).toBeVisible();
  const tracks = page.locator('audio');
  await expect(tracks).toHaveCount(2);
  await expect(tracks.nth(0)).toHaveAttribute('src', '/audio/fja-l0-m01-c03-l06-a-v1.wav');
  await expect(tracks.nth(1)).toHaveAttribute('src', '/audio/fja-l0-m01-c03-l06-b-v1.wav');
  await expect(page.locator('fieldset[data-question-id]')).toHaveCount(6);
  await expect(page.getByText('Japanese transcript', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Check answers & save blind score/ })).toBeDisabled();
  await page.getByRole('button', { name: /Reveal transcript/ }).first().click();
  await expect(page.getByText('Japanese transcript', { exact: true })).toBeVisible();
  await expect(page.getByText(/Assisted practice: you revealed written support/)).toBeVisible();
});

test('Chapter 03 listening is usable at 320px and in dark mode', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(route);
  await expect(page.getByRole('heading', { name: /Listen to sound changes/i })).toBeVisible();
  await expect(page.locator('audio')).toHaveCount(2);
  await expect(page.locator('fieldset[data-question-id]').first()).toBeVisible();
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('body')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(overflow).toBe(false);
});
