import { test, expect } from '@playwright/test';

test('Chapter 03 L01 written practice and navigation',async({page})=>{
  await page.goto('/learn/start/module-01/chapter-03/lesson-01/');
  await expect(page.getByRole('heading',{name:/One small kana/i})).toBeVisible();
  await expect(page.getByRole('heading',{name:/Can you explain the card mix-up/i})).toBeVisible();
  const fields=page.locator('fieldset.foundation-question');
  await expect(fields).toHaveCount(12);
  for(let i=0;i<12;i++)await fields.nth(i).getByRole('radio').first().check();
  await page.getByRole('button',{name:'Check answers and save score'}).click();
  await expect(page.getByRole('heading',{name:'12 / 12 correct'})).toBeVisible();
  await page.getByRole('button',{name:'Retry written check'}).click();
  await expect(page.getByRole('button',{name:'Check answers and save score'})).toBeDisabled();
});
test('Chapter 03 L01 accessible on narrow viewport',async({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto('/learn/start/module-01/chapter-03/lesson-01/');
  await expect(page.getByRole('heading',{name:/One small kana/i})).toBeVisible();
  await expect(page.locator('fieldset.foundation-question')).toHaveCount(12);
  await expect(page.getByRole('button',{name:'Compare with model answer'})).toBeVisible();
});
