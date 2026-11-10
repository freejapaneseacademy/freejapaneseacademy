import { test, expect } from '@playwright/test';
const path='/learn/start/module-03/chapter-01/checkpoint/';
test('chapter 01 checkpoint is accessible and saves an assisted attempt',async({page})=>{
  await page.goto(path);
  await expect(page.getByRole('heading',{name:/Chapter 01 checkpoint/})).toBeVisible();
  await expect(page.locator('[data-question-id]')).toHaveCount(12);
  await page.getByRole('button',{name:/Reveal Bakery conversation transcript/}).click();
  for(const field of await page.locator('[data-question-id]').all()) await field.locator('input[type=radio]').first().check();
  await page.getByRole('button',{name:/Check answers and save checkpoint score/}).click();
  await expect(page.getByText(/assisted transcript review/).last()).toBeVisible();
  await expect(page.getByRole('button',{name:/Try checkpoint again/})).toBeVisible();
});
test('chapter 01 checkpoint has no horizontal overflow at 320px',async({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.goto(path);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
