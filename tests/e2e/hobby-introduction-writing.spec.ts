import { test, expect } from '@playwright/test';
const url = '/learn/n5/module-07/chapter-01/lesson-07/';
test('hobby writing supports draft persistence, keyboard choices, feedback and retry', async ({page}) => {
  await page.goto(url);
  await expect(page.getByRole('heading',{name:/Write a hobby introduction:/i})).toBeVisible();
  const draft = page.getByLabel(/Your 2–5 connected Japanese sentences/);
  await draft.fill('音楽が好きです。でも、ダンスはあまり好きではありません。');
  await page.getByRole('button',{name:'Save draft on this device'}).click();
  await expect(page.getByText('Draft saved on this device.')).toBeVisible();
  await page.reload();
  await expect(draft).toHaveValue('音楽が好きです。でも、ダンスはあまり好きではありません。');
  await page.getByRole('button',{name:'Compare with model'}).click();
  await expect(page.getByText(/One possible model/)).toBeVisible();
  const groups = page.locator('fieldset[data-question-id]');
  await expect(groups).toHaveCount(8);
  for (let i=0;i<8;i++) { await groups.nth(i).locator('input[type="radio"]').first().focus(); await page.keyboard.press('Space'); }
  await page.getByRole('button',{name:'Check 8 answers'}).click();
  await expect(page.getByText(/Recognition score:/)).toBeVisible();
  await expect(page.getByText(/Recognition attempt saved|Progress storage unavailable/)).toBeVisible();
  await page.getByRole('button',{name:'Retry questions'}).click();
  await expect(page.getByRole('button',{name:'Check 8 answers'})).toBeVisible();
  await page.getByRole('button',{name:'Clear draft'}).click();
  await expect(draft).toHaveValue('');
});
test('320px dark mode has no horizontal overflow and labeled keyboard inputs', async ({page}) => {
  await page.setViewportSize({width:320,height:740});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto(url);
  await expect(page.locator('fieldset[data-question-id]')).toHaveCount(8);
  await expect(page.locator('fieldset[data-question-id]').first().locator('label')).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});
