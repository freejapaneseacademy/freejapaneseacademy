import { test, expect } from '@playwright/test';

const url = '/learn/start/module-01/chapter-02/lesson-01/';

test('Chapter 02 L01 presents five vowel context, written practice, retry and browser-local progress', async ({ page }) => {
  await page.goto('/learn/start/');
  await page.getByRole('link', { name: /Study Chapter 02 lesson 01/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: /Five Japanese vowels/ })).toBeVisible();
  await expect(page.getByText(/Emi's five-vowel card/)).toBeVisible();
  const practice = page.locator('.sound-context-practice');
  await expect(practice.locator('fieldset')).toHaveCount(10);
  await expect(practice.locator('audio')).toHaveCount(0);
  await expect(practice.getByRole('button', { name: 'Check answers & save score' })).toBeDisabled();
  for (const fieldset of await practice.locator('fieldset').all()) await fieldset.locator('input[type=radio]').first().check();
  await practice.getByRole('button', { name: 'Check answers & save score' }).click();
  await expect(practice.getByText(/written practice score was saved on this browser/)).toBeVisible();
  await expect(practice.locator('.foundation-feedback')).toHaveCount(10);
  await practice.getByRole('button', { name: 'Try the written check again' }).click();
  await expect(practice.getByRole('button', { name: 'Check answers & save score' })).toBeDisabled();
  await practice.locator('#sound-context-draft').fill('いえ has two morae. あおい has three.');
  await practice.getByRole('button', { name: /Compare with model and checklist/ }).click();
  await expect(practice.getByText('Model explanation')).toBeVisible();
  await page.goto('/dashboard/');
  await expect(page.getByText('Foundations: Five vowels and mora timing')).toBeVisible();
  await page.goto(url);
  await page.getByRole('button', { name: /Mark lesson complete/ }).click();
  await expect(page.getByRole('button', { name: /Lesson completed/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: /Lesson completed/ })).toBeVisible();
});

for (const width of [320, 375, 390, 768, 1024, 1440]) {
  test('Chapter 02 L01 responsive, keyboard-accessible and dark mode at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 820 });
    await page.goto(url);
    const practice = page.locator('.sound-context-practice');
    await expect(practice).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 2);
    await page.locator('html').evaluate(element => { element.dataset.theme = 'dark'; });
    await expect(practice.locator('fieldset').first()).toBeVisible();
    await practice.locator('fieldset').first().locator('input[type=radio]').first().focus();
    await expect(practice.locator('fieldset').first().locator('input[type=radio]').first()).toBeFocused();
  });
}
