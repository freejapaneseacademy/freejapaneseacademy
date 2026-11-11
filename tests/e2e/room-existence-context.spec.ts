import { test, expect } from '@playwright/test';
const url='/learn/n5/module-02/chapter-03/lesson-01/';
test('keyboard choices, explanatory feedback and retry',async({page})=>{
  await page.goto(url);
  await expect(page.getByRole('heading',{name:'Where are the notebook and teacher?'})).toBeVisible();
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
  await expect(page.getByRole('heading',{name:'Find the object or person'})).toBeVisible();
  await page.getByLabel('Write three sentences about where a book, cat and teacher are.').fill('つくえの うえに ほんが あります。');
  await page.getByRole('button',{name:'Compare with model'}).click();
  await expect(page.getByText(/へやに ねこが います/).last()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});