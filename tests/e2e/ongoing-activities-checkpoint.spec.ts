import { test, expect } from '@playwright/test';
const path = '/learn/n5/module-06/chapter-04/checkpoint/';
test('keyboard selection, scoring, feedback and retry', async ({ page }) => {
  await page.goto(path);
  const questions = page.locator('[data-question-id]');
  await expect(questions).toHaveCount(16);
  await expect(page.getByRole('button',{name:'Check 16 answers'})).toBeDisabled();
  await questions.first().locator('input[type=radio]').first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(questions.first().locator('input[type=radio]:checked')).toHaveCount(1);
  for (let i=0;i<16;i++) await questions.nth(i).locator('input[type=radio]').first().check();
  await page.getByRole('button',{name:'Check 16 answers'}).click();
  await expect(page.getByText(/Written recognition score:/)).toBeVisible();
  await expect(questions.first().getByRole('status')).toBeVisible();
  await page.getByRole('button',{name:'Retry questions'}).click();
  await expect(page.getByRole('button',{name:'Check 16 answers'})).toBeDisabled();
});
test('320px dark-mode checkpoint has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({width:320,height:740});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto(path);
  await expect(page.getByRole('heading',{name:/Ongoing activities — chapter checkpoint/})).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});
