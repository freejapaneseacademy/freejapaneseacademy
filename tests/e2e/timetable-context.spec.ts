import { test, expect } from '@playwright/test';
const url='/learn/n5/module-03/chapter-01/lesson-01/';
test('keyboard selection, feedback and retry',async({page})=>{
  await page.goto(url);
  await expect(page.getByRole('heading',{name:/A Timetable at the Community Center/})).toBeVisible();
  const fields=page.locator('.foundation-question');
  await expect(fields).toHaveCount(10);
  for(let i=0;i<10;i++){
    const first=fields.nth(i).getByRole('radio').first();
    await first.focus();await page.keyboard.press('Space');await expect(first).toBeChecked();
  }
  await page.getByRole('button',{name:'Check answers and save score'}).click();
  await expect(page.locator('.foundation-question .foundation-feedback')).toHaveCount(10);
  await page.getByRole('button',{name:'Retry timetable check'}).click();
  await expect(page.locator('.foundation-question .foundation-feedback')).toHaveCount(0);
});
test('320px dark mode and ungraded writing',async({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto(url);
  await expect(page.getByRole('heading',{name:'Read the notice closely'})).toBeVisible();
  await page.getByLabel('Write a date, start time and number of people for a different study group.').fill('12月5日。午後2時から。2人です。');
  await page.getByRole('button',{name:'Compare with model'}).click();
  await expect(page.getByText(/参加：2人/).last()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});