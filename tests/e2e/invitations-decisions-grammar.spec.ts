import { test,expect } from '@playwright/test';
const route='/learn/n5/module-04/chapter-04/lesson-03/';
test('keyboard selection, feedback and retry',async({page})=>{
  await page.goto(route);
  const groups=page.locator('fieldset');
  await groups.first().getByRole('radio').first().focus();
  await page.keyboard.press('Space');
  await expect(groups.first().getByRole('radio').first()).toBeChecked();
  for(let i=1;i<12;i++) await groups.nth(i).getByRole('radio').first().check();
  await page.getByRole('button',{name:'Check my answers'}).click();
  await expect(page.getByText(/Score: \d+ \/ 12/)).toBeVisible();
  await page.getByRole('button',{name:'Retry questions'}).click();
  await expect(page.getByRole('button',{name:'Check my answers'})).toBeDisabled();
});
test('320px mobile dark mode and writing model',async({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto(route);
  await page.getByLabel(/Three or four Japanese lines/).fill('カフェに行きませんか。');
  await page.getByRole('button',{name:'Compare with model'}).click();
  await expect(page.getByText(/いっしょに昼ご飯を食べませんか。いいですね。/)).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});