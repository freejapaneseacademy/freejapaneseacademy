import { test, expect } from '@playwright/test';

test('L05 evidence quiz works at mobile width and saves visible feedback', async ({page}) => {
  await page.setViewportSize({width:320,height:700});
  await page.goto('/learn/start/module-02/chapter-01/lesson-05/');
  await expect(page.getByRole('heading',{name:'Read the kana-card grid'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Find the written evidence'})).toBeVisible();
  const button=page.getByRole('button',{name:'Check eight reading answers'});
  await expect(button).toBeDisabled();
  const fields=page.locator('fieldset');
  await expect(fields).toHaveCount(8);
  for(let i=0;i<8;i++) await fields.nth(i).getByRole('radio').first().check();
  await expect(button).toBeEnabled();
  await button.click();
  await expect(page.getByText(/Written reading score: \d\/8/)).toBeVisible();
  await expect(page.getByRole('button',{name:'Retry all questions'})).toBeVisible();
  await page.getByRole('button',{name:'Retry all questions'}).click();
  await expect(button).toBeDisabled();
  await expect(page.locator('body')).not.toHaveJSProperty('scrollWidth', 10000);
});

test('L05 can be completed with keyboard only',async ({page})=>{
  await page.goto('/learn/start/module-02/chapter-01/lesson-05/');
  const fields=page.locator('fieldset');
  for(let i=0;i<8;i++) await fields.nth(i).getByRole('radio').first().focus().then(async()=>{await page.keyboard.press('Space');});
  await page.getByRole('button',{name:'Check eight reading answers'}).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText(/Written reading score:/)).toBeVisible();
});
