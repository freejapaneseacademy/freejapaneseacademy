import { test, expect } from '@playwright/test';
const url='/learn/n5/module-02/chapter-02/lesson-01/';
test('keyboard accessible answers, feedback and retry',async({page})=>{
  await page.goto(url);
  await expect(page.getByRole('heading',{name:'Where is the library?'})).toBeVisible();
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
  await page.getByRole('button',{name:'Retry written check'}).click();
  await expect(page.locator('.foundation-feedback')).toHaveCount(0);
});
test('320px dark-mode layout and ungraded writing',async({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto(url);
  await expect(page.getByRole('heading',{name:'Find the right place'})).toBeVisible();
  await page.getByLabel('Write a three-line exchange asking where a room is.').fill('じむしつは どこですか。');
  await page.getByRole('button',{name:'Compare with model'}).click();
  await expect(page.getByText(/じむしつは あそこです/).last()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});
