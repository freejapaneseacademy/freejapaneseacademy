import { test, expect } from '@playwright/test';
test('schedule context supports keyboard selection, feedback and retry',async ({page})=>{
  await page.goto('/learn/n5/module-03/chapter-03/lesson-01/');
  await expect(page.getByRole('heading',{name:/Yesterday and Tomorrow/i})).toBeVisible();
  const questions=page.locator('[data-question-id]');
  await expect(questions).toHaveCount(10);
  for(let i=0;i<10;i++){
    const first=questions.nth(i).getByRole('radio').first();
    await first.focus();
    await page.keyboard.press('Space');
    await expect(first).toBeChecked();
  }
  await page.getByRole('button',{name:'Check all 10 answers'}).click();
  await expect(page.getByText(/Written context score:/)).toBeVisible();
  await expect(page.getByText(/Written recognition attempt saved|Local storage is unavailable/)).toBeVisible();
  await page.getByRole('button',{name:'Retry questions'}).click();
  await expect(page.getByRole('button',{name:'Check all 10 answers'})).toBeDisabled();
});
test('320px mobile dark mode has no horizontal overflow',async ({page})=>{
  await page.setViewportSize({width:320,height:700});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto('/learn/n5/module-03/chapter-03/lesson-01/');
  await expect(page.getByRole('heading',{name:/Yesterday and Tomorrow/i})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});