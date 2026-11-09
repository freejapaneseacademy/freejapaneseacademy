import { test, expect } from '@playwright/test';
const url='/learn/n5/module-02/chapter-01/lesson-01/';
test('keyboard-accessible quiz, feedback and retry',async({page})=>{
  await page.goto(url);
  await expect(page.getByRole('heading',{name:'Whose umbrella is this?'})).toBeVisible();
  const fieldsets=page.locator('.foundation-question');
  await expect(fieldsets).toHaveCount(10);
  for(let i=0;i<10;i++){
    const first=fieldsets.nth(i).getByRole('radio').first();
    await first.focus();
    await page.keyboard.press('Space');
    await expect(first).toBeChecked();
  }
  await page.getByRole('button',{name:'Check answers and save score'}).click();
  await expect(page.locator('.foundation-feedback')).toHaveCount(10);
  await expect(page.getByRole('button',{name:'Retry written check'})).toBeVisible();
  await page.getByRole('button',{name:'Retry written check'}).click();
  await expect(page.locator('.foundation-feedback')).toHaveCount(0);
});
test('320px layout and optional writing model in dark mode',async({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto(url);
  await expect(page.getByRole('heading',{name:'Who owns the umbrella?'})).toBeVisible();
  await page.getByLabel('Write two to four lines asking about a lost item and its owner.').fill('これは だれの ほんですか。');
  await page.getByRole('button',{name:'Compare with model'}).click();
  await expect(page.getByText(/レンさんのです/).last()).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
  expect(overflow).toBe(false);
});
