import { test, expect } from '@playwright/test';
const route='/learn/n5/module-04/chapter-03/lesson-03/';
test('keyboard answer, feedback and retry', async ({page}) => {
  await page.goto(route);
  const group=page.getByRole('group').first();
  await group.getByRole('radio').first().focus();
  await page.keyboard.press('Space');
  await expect(group.getByRole('radio').first()).toBeChecked();
  const groups=page.locator('fieldset');
  for (let i=1;i<12;i++) await groups.nth(i).getByRole('radio').first().check();
  await page.getByRole('button',{name:'Check my answers'}).click();
  await expect(page.getByText(/Score: \d+ \/ 12/)).toBeVisible();
  await expect(page.getByRole('button',{name:'Retry questions'})).toBeVisible();
  await page.getByRole('button',{name:'Retry questions'}).click();
  await expect(page.getByRole('button',{name:'Check my answers'})).toBeDisabled();
});
test('320px dark mode, ungraded writing', async ({page}) => {
  await page.setViewportSize({width:320,height:720});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto(route);
  await page.getByLabel(/Three or four Japanese sentences/).fill('このカフェは静かです。');
  await page.getByRole('button',{name:'Compare with model'}).click();
  await expect(page.getByText('このカフェは静かです。ケーキはおいしいです。コーヒーは高くないです。')).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
  expect(overflow).toBe(false);
});
