import { test, expect } from '@playwright/test';
const route = '/learn/start/module-04/chapter-02/lesson-01/';
test('mobile, keyboard answers, feedback and retry', async ({ page }) => {
  await page.setViewportSize({width:320,height:700});
  await page.goto(route);
  await expect(page.getByRole('heading',{name:/Katakana on a product shelf/})).toBeVisible();
  const questions=page.locator('fieldset[data-question-id^="ex-l0-m04-c02-l01-"]');
  await expect(questions).toHaveCount(8);
  await expect(questions.first()).toBeEnabled();
  for (let i=0;i<8;i++) {
    const radio=questions.nth(i).locator('input[type="radio"]').first();
    await radio.focus(); await page.keyboard.press('Space');
    await expect(radio).toBeChecked();
  }
  await page.getByRole('button',{name:'Check all eight answers'}).click();
  await expect(page.getByText(/Written score: \d\/8/)).toBeVisible();
  await expect(questions.first().getByRole('status')).toBeVisible();
  await page.getByRole('button',{name:'Try again'}).click();
  await expect(page.getByRole('button',{name:'Check all eight answers'})).toBeDisabled();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
  expect(overflow).toBe(false);
});
