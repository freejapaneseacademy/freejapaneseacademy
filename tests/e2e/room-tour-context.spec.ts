import { test, expect } from '@playwright/test';
const url='/learn/n5/module-02/chapter-04/lesson-01/';
test('keyboard answers, feedback and retry',async({page})=>{
  await page.goto(url);
  await expect(page.getByRole('heading',{name:'A Room Tour: Where Is Everything?'})).toBeVisible();
  const fields=page.locator('.foundation-question');
  await expect(fields).toHaveCount(10);
  for(let i=0;i<10;i++){
    const first=fields.nth(i).getByRole('radio').first();
    await first.focus();await page.keyboard.press('Space');await expect(first).toBeChecked();
  }
  await page.getByRole('button',{name:'Check answers and save score'}).click();
  await expect(page.locator('.foundation-feedback')).toHaveCount(10);
  await page.getByRole('button',{name:'Retry room tour check'}).click();
  await expect(page.locator('.foundation-feedback')).toHaveCount(0);
});
test('320px dark mode and optional ungraded writing',async({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto(url);
  await expect(page.getByRole('heading',{name:'Find the room details'})).toBeVisible();
  await page.getByLabel('Describe a book under a chair, a bag on a desk and a dog beside a window.').fill('いすの したに ほんが あります。');
  await page.getByRole('button',{name:'Compare with model'}).click();
  await expect(page.getByText(/まどの となりに いぬが います/).last()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});
