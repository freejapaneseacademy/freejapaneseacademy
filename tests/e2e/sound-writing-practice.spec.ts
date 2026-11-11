import { test, expect } from '@playwright/test';

const url = '/learn/start/module-01/chapter-02/lesson-07/';
const answers = ['あ', 'い', 'う', 'え', 'お', 'かさ', 'いえ', 'いいえ', 'おばさん', 'おばあさん'];

test('Chapter 02 L07 written entries, feedback and Dexie progress persist', async ({ page }) => {
  await page.goto(url);
  await expect(page.getByRole('heading', { level: 1, name: /Write Japanese vowel contrasts accurately/ })).toBeVisible();
  const practice = page.locator('.sound-writing-practice');
  await expect(practice.locator('fieldset')).toHaveCount(10);
  const first = practice.locator('fieldset').first();
  await first.getByRole('button', { name: 'Insert あ in entry 1' }).click();
  await expect(first.locator('input[type=text]')).toHaveValue('あ');
  await first.getByRole('button', { name: 'Delete last' }).click();
  await expect(first.locator('input[type=text]')).toHaveValue('');
  for (const [i, fieldset] of (await practice.locator('fieldset').all()).entries()) {
    await fieldset.locator('input[type=text]').fill(answers[i]);
  }
  await practice.getByRole('button', { name: 'Check entries & save score' }).click();
  await expect(practice.getByRole('heading', { name: '10 / 10 correct forms' })).toBeVisible();
  await page.goto('/dashboard/');
  await expect(page.getByText('Foundations: Vowel writing and mora contrasts')).toBeVisible();
  await page.goto(url);
  await page.getByRole('button', { name: /Mark lesson complete/ }).click();
  await expect(page.getByRole('button', { name: /Lesson completed/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: /Lesson completed/ })).toBeVisible();
});

test('Chapter 02 L07 rejects missing vowel, supports guided revision and private draft export', async ({ page }) => {
  await page.goto(url);
  const practice = page.locator('.sound-writing-practice');
  for (const [i, fieldset] of (await practice.locator('fieldset').all()).entries()) {
    await fieldset.locator('input[type=text]').fill(i === 9 ? 'おばさん' : answers[i]);
  }
  await practice.getByRole('button', { name: 'Check entries & save score' }).click();
  await expect(practice.getByRole('heading', { name: '9 / 10 correct forms' })).toBeVisible();
  await expect(practice.locator('fieldset').last().getByText('Review the written form')).toBeVisible();
  await practice.getByRole('button', { name: 'Try the entries again' }).click();
  await expect(practice.getByRole('button', { name: 'Check entries & save score' })).toBeDisabled();

  await practice.getByLabel('A picture of a house').selectOption('いえ');
  await practice.getByLabel('A polite reply meaning “No”').selectOption('いえ');
  await practice.getByLabel('An aunt on a fictional family chart').selectOption('おばさん');
  await practice.getByLabel('A grandmother on the same chart').selectOption('おばあさん');
  await practice.getByRole('button', { name: 'Check four situations' }).click();
  await expect(practice.getByText('Revise this choice')).toHaveCount(1);
  await practice.getByRole('button', { name: 'Edit situations' }).click();
  await practice.getByLabel('A polite reply meaning “No”').selectOption('いいえ');
  await practice.getByRole('button', { name: 'Check four situations' }).click();
  await expect(practice.getByText('Matches the situation')).toHaveCount(4);

  await practice.locator('#sound-writing-japanese-draft').fill('これはかさです。\nいいえ、これはいえです。');
  await practice.locator('#sound-writing-english-draft').fill('House いえ is 2 morae; no いいえ is 3. Aunt おばさん is 4; grandmother おばあさん is 5.');
  await practice.getByRole('button', { name: 'Compare with model and checklist' }).click();
  await expect(practice.getByText('One possible model')).toBeVisible();
  for (const checkbox of await practice.locator('.writing-rubric-item input[type=checkbox]').all()) await checkbox.check();
  await expect(practice.getByText('4 of 4 criteria checked by you')).toBeVisible();
  const event = page.waitForEvent('download');
  await practice.getByRole('button', { name: 'Download my draft' }).click();
  expect((await event).suggestedFilename()).toBe('fja-l0-m01-c02-l07-writing.txt');
  page.once('dialog', dialog => dialog.accept());
  await practice.getByRole('button', { name: 'Clear my draft' }).click();
  await expect(practice.locator('#sound-writing-japanese-draft')).toHaveValue('');
  await practice.locator('#sound-writing-japanese-draft').fill('not saved');
  await page.reload();
  await expect(practice.locator('#sound-writing-japanese-draft')).toHaveValue('');
});

for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
  test('Chapter 02 L07 responsive, dark theme and keyboard at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 820 });
    await page.goto(url);
    const practice = page.locator('.sound-writing-practice');
    await expect(practice).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 2);
    await page.locator('html').evaluate(element => { element.dataset.theme = 'dark'; });
    const key = practice.locator('fieldset').first().getByRole('button', { name: 'Insert あ in entry 1', exact: true });
    // Astro's client:load island briefly disables the fieldset until React hydration.
    // Wait for an actionable button, otherwise keyboard Enter can be lost.
    await expect(key).toBeEnabled();
    await key.focus();
    await expect(key).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(practice.locator('fieldset').first().locator('input[type=text]')).toHaveValue('あ');
  });
}
