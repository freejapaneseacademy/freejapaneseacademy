import { test, expect } from '@playwright/test';
const url='/learn/n5/module-07/chapter-01/lesson-08/';
test('keyboard choices, role switching, feedback and retry',async({page})=>{
  await page.goto(url);
  await expect(page.getByRole('heading',{name:'Talk about hobbies: Optional likes and skills roleplay'})).toBeVisible();
  await page.getByLabel('Scene').selectOption('B');
  await page.getByLabel('Your role').selectOption('B');
  await expect(page.getByText('Practice Scene B, role B.')).toBeVisible();
  const questions=page.locator('.foundation-question');
  await expect(questions).toHaveCount(12);
  await expect(page.getByRole('button',{name:'Check 12 answers'})).toBeDisabled();
  for(let i=0;i<12;i++){const radio=questions.nth(i).getByRole('radio').first();await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
  await page.getByRole('button',{name:'Check 12 answers'}).click();
  await expect(page.locator('.foundation-feedback')).toHaveCount(12);
  await expect(page.getByText(/Written recognition:/)).toBeVisible();
  await page.getByRole('button',{name:'Retry written check'}).click();
  await expect(page.locator('.foundation-feedback')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Check 12 answers'})).toBeDisabled();
});
test('320px dark mode no horizontal overflow',async({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto(url);
  await expect(page.getByRole('heading',{name:'Rehearse and check your responses'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});
