import { test, expect } from '@playwright/test';
const url='/learn/n5/module-01/chapter-03/lesson-08/';
test('keyboard answers, feedback and retry',async({page})=>{
  await page.goto(url);
  await expect(page.getByRole('heading',{name:/Family introductions/i}).first()).toBeVisible();
  const groups=page.locator('[data-question-id]');
  await expect(groups).toHaveCount(8);
  await groups.first().locator('input[type="radio"]').first().focus();
  await page.keyboard.press('Space');
  for(let i=1;i<8;i++) await groups.nth(i).locator('input[type="radio"]').first().check();
  await page.getByRole('button',{name:'Check 8 answers'}).click();
  await expect(page.getByText(/Written recognition: 8\/8/)).toBeVisible();
  await page.getByRole('button',{name:'Retry questions'}).click();
  await expect(page.getByRole('button',{name:'Check 8 answers'})).toBeDisabled();
});
test('320px mobile dark mode and optional recording is off',async({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto(url);
  await expect(page.getByText('Microphone is off.')).toBeVisible();
  await expect(page.getByRole('button',{name:'Stop recording'})).toBeDisabled();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
  expect(overflow).toBe(false);
  await expect(page.getByRole('checkbox')).toHaveCount(4);
});
