import { test, expect } from '@playwright/test';

test('Chapter 04 L01 keyboard-input lesson works with keyboard answers',async({page})=>{
  await page.goto('/learn/start/module-01/chapter-04/lesson-01/');
  await expect(page.getByRole('heading',{name:/Type Japanese/i})).toBeVisible();
  const fields=page.locator('fieldset.foundation-question');
  await expect(fields).toHaveCount(12);
  for(let i=0;i<12;i++)await fields.nth(i).getByRole('radio').first().check();
  await page.getByRole('button',{name:'Check answers and save score'}).click();
  await expect(page.locator('.foundation-result')).toContainText('/ 12 correct');
  await expect(page.locator('.foundation-feedback')).toHaveCount(12);
  await page.getByRole('button',{name:'Retry written check'}).click();
  await expect(page.getByRole('button',{name:'Check answers and save score'})).toBeDisabled();
});
test('Chapter 04 L01 fits 320px and exposes optional model',async({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.goto('/learn/start/module-01/chapter-04/lesson-01/');
  await expect(page.locator('fieldset.foundation-question')).toHaveCount(12);
  await page.getByRole('button',{name:'Compare with model answer'}).click();
  await expect(page.getByText(/The Japanese IME lets Aya produce kana/)).toBeVisible();
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth',320);
});
