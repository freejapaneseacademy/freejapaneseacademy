import { test, expect } from '@playwright/test';
const path='/learn/n5/module-06/chapter-01/lesson-01/';
test('keyboard answers, feedback, saved attempt and retry',async({page})=>{
  await page.goto(path);
  const groups=page.locator('fieldset[data-question-id]');
  await expect(groups).toHaveCount(12);
  const first=groups.first().locator('input[type=radio]').first();
  await first.focus(); await page.keyboard.press('Space'); await expect(first).toBeChecked();
  for(let i=1;i<12;i++) await groups.nth(i).locator('input[type=radio]').first().check();
  await page.getByRole('button',{name:'Check 12 answers'}).click();
  await expect(page.getByText(/Written recognition score:/)).toBeVisible();
  await expect(page.getByText(/practice attempt was saved|Progress storage is unavailable/)).toBeVisible();
  await page.getByRole('button',{name:'Retry questions'}).click();
  await expect(page.getByRole('button',{name:'Check 12 answers'})).toBeDisabled();
});
test('320px dark-mode viewport has no horizontal overflow',async({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto(path);
  await expect(page.getByRole('heading',{name:'Check the activity board'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
});
