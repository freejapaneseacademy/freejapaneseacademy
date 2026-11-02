import { test, expect } from '@playwright/test';

const url = '/learn/start/module-01/chapter-02/lesson-03/';

test('Chapter 02 L03 teaches mora contrasts, scores written answers, retries and preserves progress', async ({ page }) => {
  await page.goto('/learn/start/');
  await page.getByRole('link', { name: /Study Chapter 02 lesson 03/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: /One more beat/ })).toBeVisible();
  await expect(page.getByText(/One extra vowel, a different message/)).toBeVisible();
  const practice = page.locator('.vowel-function-practice');
  await expect(practice.locator('fieldset')).toHaveCount(12);
  await expect(practice.locator('audio')).toHaveCount(0);
  await expect(practice.getByRole('button', { name: 'Check answers & save score' })).toBeDisabled();

  for (const fieldset of await practice.locator('fieldset').all()) {
    const radio = fieldset.locator('input[type=radio]');
    if (await radio.count()) await radio.first().check();
    else {
      const id = await fieldset.getAttribute('data-question-id');
      await fieldset.locator('input[type=text]').fill(id?.endsWith('011') ? 'ie' : 'obaasan');
    }
  }
  await practice.getByRole('button', { name: 'Check answers & save score' }).click();
  await expect(practice.getByText(/written vowel-function score was saved in this browser/)).toBeVisible();
  await expect(practice.locator('.foundation-feedback')).toHaveCount(12);
  await practice.getByRole('button', { name: 'Practice again' }).click();
  await expect(practice.getByRole('button', { name: 'Check answers & save score' })).toBeDisabled();

  await practice.locator('#vowel-function-draft').fill('いえ has two morae; いいえ has three and means no.');
  await practice.getByRole('button', { name: 'Compare with model and checklist' }).click();
  await expect(practice.getByText('Model explanation')).toBeVisible();
  await expect(practice.getByText(/This text stays in this tab/)).toBeVisible();

  await page.goto('/dashboard/');
  await expect(page.getByText('Foundations: Vowel length and word function')).toBeVisible();
  await page.goto(url);
  await page.getByRole('button', { name: /Mark lesson complete/ }).click();
  await expect(page.getByRole('button', { name: /Lesson completed/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: /Lesson completed/ })).toBeVisible();
});

for (const width of [320, 375, 390, 768, 1024, 1440]) {
  test('Chapter 02 L03 keyboard, mobile width and dark mode at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 820 });
    await page.goto(url);
    const practice = page.locator('.vowel-function-practice');
    await expect(practice).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 2);
    await page.locator('html').evaluate(element => { element.dataset.theme = 'dark'; });
    const first = practice.locator('fieldset').first().locator('input[type=radio]').first();
    await expect(first).toBeEnabled();
    await first.focus();
    await expect(first).toBeFocused();
    await expect(practice.locator('fieldset').last().locator('input[type=text]')).toBeEnabled();
  });
}
