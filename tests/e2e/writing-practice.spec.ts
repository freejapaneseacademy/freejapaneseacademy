import { test, expect } from '@playwright/test';

const url = '/learn/start/module-01/chapter-01/lesson-07/';
const answers = ['あ', 'ア', 'い', 'オ', 'さくら', 'コーヒー', 'ひらがな', 'カタカナ'];

test('L07 constrained typing, palette, feedback, progress and completion persist', async ({ page }) => {
  await page.goto(url);
  await expect(page.getByRole('heading', { level: 1, name: /Write your first Japanese script labels/i })).toBeVisible();
  const workshop = page.locator('.writing-practice');
  await expect(workshop.locator('fieldset')).toHaveCount(8);
  await expect(workshop.getByRole('button', { name: 'Check entries & save score' })).toBeDisabled();

  const first = workshop.locator('fieldset').first();
  await first.getByRole('button', { name: 'Insert あ in answer 1' }).click();
  await expect(first.locator('input[type=text]')).toHaveValue('あ');
  await first.getByRole('button', { name: 'Delete last' }).click();
  await expect(first.locator('input[type=text]')).toHaveValue('');
  await first.getByRole('button', { name: 'Insert あ in answer 1' }).click();

  for (const [index, fieldset] of (await workshop.locator('fieldset').all()).entries()) {
    await fieldset.locator('input[type=text]').fill(answers[index]);
  }
  await workshop.getByRole('button', { name: 'Check entries & save score' }).click();
  await expect(workshop.getByText('8 / 8 correct forms')).toBeVisible();
  await expect(workshop.getByText(/Writing entry score saved locally/)).toBeVisible();
  await page.goto('/dashboard/');
  await expect(page.getByText('Foundations: Script writing and typing')).toBeVisible();

  await page.goto(url);
  await page.getByRole('button', { name: /Mark lesson complete/ }).click();
  await expect(page.getByRole('button', { name: /Lesson completed/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: /Lesson completed/ })).toBeVisible();
});

test('L07 wrong-script feedback, guided labels, self-review, export and unsaved draft', async ({ page }) => {
  await page.goto(url);
  const workshop = page.locator('.writing-practice');
  const fieldsets = await workshop.locator('fieldset').all();
  for (const [index, fieldset] of fieldsets.entries()) {
    await fieldset.locator('input[type=text]').fill(index === 0 ? 'ア' : answers[index]);
  }
  await workshop.getByRole('button', { name: 'Check entries & save score' }).click();
  await expect(workshop.getByText('7 / 8 correct forms')).toBeVisible();
  await expect(fieldsets[0].getByText('Review this form')).toBeVisible();
  await expect(fieldsets[0].getByText(/Target:/)).toBeVisible();
  await workshop.getByRole('button', { name: 'Try the entries again' }).click();
  await expect(workshop.getByRole('button', { name: 'Check entries & save score' })).toBeDisabled();

  await workshop.getByLabel('Script name for the hiragana a card').selectOption('ひらがな');
  await workshop.getByLabel('Script name for the katakana a card').selectOption('カタカナ');
  await expect(workshop.getByText('これはひらがなです。')).toBeVisible();
  await workshop.getByRole('button', { name: 'Check my two labels' }).click();
  await expect(workshop.getByText('This label fits the card')).toHaveCount(2);
  await workshop.getByRole('button', { name: 'Edit labels' }).click();
  await workshop.getByLabel('Script name for the katakana a card').selectOption('かんじ');
  await workshop.getByRole('button', { name: 'Check my two labels' }).click();
  await expect(workshop.getByText('Revise this label')).toBeVisible();

  await workshop.locator('#writing-japanese-draft').fill('これはひらがなです。\nこれはカタカナです。');
  await workshop.locator('#writing-english-draft').fill('Hiragana: さくら. Katakana: コーヒー. Kanji: 山. Romaji: sakura is not English.');
  await workshop.getByRole('button', { name: 'Compare with model and rubric' }).click();
  await expect(workshop.getByText(/One possible model/)).toBeVisible();
  for (const checkbox of await workshop.locator('.writing-rubric-item input[type=checkbox]').all()) await checkbox.check();
  await expect(workshop.getByText(/4 of 4 criteria checked by you/)).toBeVisible();
  const download = page.waitForEvent('download');
  await workshop.getByRole('button', { name: 'Download my draft' }).click();
  expect((await download).suggestedFilename()).toBe('fja-l0-m01-c01-l07-writing.txt');
  page.once('dialog', dialog => dialog.accept());
  await workshop.getByRole('button', { name: 'Clear my draft' }).click();
  await expect(workshop.locator('#writing-japanese-draft')).toHaveValue('');
  await expect(workshop.locator('#writing-english-draft')).toHaveValue('');
  await workshop.locator('#writing-japanese-draft').fill('temporary local draft');
  await page.reload();
  await expect(workshop.locator('#writing-japanese-draft')).toHaveValue('');
});

for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
  test('L07 responsive and dark theme at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 820 });
    await page.goto(url);
    await expect(page.locator('.writing-practice')).toBeVisible();
    const size = await page.evaluate(() => ({ body: document.documentElement.scrollWidth, viewport: innerWidth }));
    expect(size.body).toBeLessThanOrEqual(size.viewport + 2);
    await page.locator('html').evaluate(element => { element.dataset.theme = 'dark'; });
    await expect(page.locator('.writing-label-card').first()).toBeVisible();
    await expect(page.locator('.writing-practice .script-keyboard__key').first()).toBeVisible();
  });
}
