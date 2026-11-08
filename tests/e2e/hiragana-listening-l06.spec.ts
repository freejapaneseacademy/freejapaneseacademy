import { test, expect } from '@playwright/test';

test('L06 has two real audio controls, six questions and assisted scoring at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/learn/start/module-02/chapter-01/lesson-06/');
  await expect(page.getByRole('heading', { name: 'Hear Japanese in everyday conversations' })).toBeVisible();
  await expect(page.locator('audio')).toHaveCount(2);
  await expect(page.locator('fieldset[data-question-id]')).toHaveCount(6);
  await page.getByRole('button', { name: 'Reveal transcript (assisted practice)' }).first().click();
  await expect(page.getByText(/Assisted practice: you revealed written support/)).toBeVisible();
  const fields = page.locator('fieldset[data-question-id]');
  for (let i = 0; i < 6; i++) await fields.nth(i).getByRole('radio').first().check();
  await page.getByRole('button', { name: 'Check assisted answers' }).click();
  await expect(page.getByText(/Assisted answers reviewed/)).toBeVisible();
  await expect(page.locator('body')).not.toHaveJSProperty('scrollWidth', 10000);
});

test('L06 keyboard controls and transcript reset', async ({ page }) => {
  await page.goto('/learn/start/module-02/chapter-01/lesson-06/');
  const reveal = page.getByRole('button', { name: 'Reveal transcript (assisted practice)' }).first();
  await expect(reveal.locator('xpath=ancestor::astro-island')).not.toHaveAttribute('ssr', '');
  await reveal.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Japanese transcript').first()).toBeVisible();
  await page.getByRole('button', { name: 'Start a new listening attempt' }).click();
  await expect(page.getByText('Japanese transcript')).toHaveCount(0);
});
