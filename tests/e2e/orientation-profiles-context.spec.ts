import { test, expect } from '@playwright/test';
test('orientation profile check supports keyboard, feedback and retry',async ({page})=>{
  await page.goto('/learn/n5/module-01/chapter-04/lesson-01/');
  await expect(page.getByRole('heading',{name:/At the Orientation Desk/i})).toBeVisible();
  const questions=page.locator('[data-question-id]');
  await expect(questions).toHaveCount(8);
  for(let i=0;i<8;i++){
    const first=questions.nth(i).getByRole('radio').first();
    await first.focus();
    await page.keyboard.press('Space');
    await expect(first).toBeChecked();
  }
  await page.getByRole('button',{name:'Check all 8 answers'}).click();
  await expect(page.getByText(/Written context score:/)).toBeVisible();
  await page.getByRole('button',{name:'Retry questions'}).click();
  await expect(page.getByRole('button',{name:'Check all 8 answers'})).toBeDisabled();
});
test('320px mobile dark mode has no horizontal overflow',async ({page})=>{
  await page.setViewportSize({width:320,height:700});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto('/learn/n5/module-01/chapter-04/lesson-01/');
  await expect(page.getByRole('heading',{name:/At the Orientation Desk/i})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});
