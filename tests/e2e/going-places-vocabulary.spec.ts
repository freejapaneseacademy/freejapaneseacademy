import { test, expect } from '@playwright/test';
const url='/learn/n5/module-05/chapter-01/lesson-02/';
test('keyboard-accessible questions, feedback, saved attempt and retry',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'Going places: transport and destination words'})).toBeVisible();
 const questions=page.locator('.foundation-question');
 await expect(questions).toHaveCount(12);
 for(let i=0;i<12;i++){
  const first=questions.nth(i).getByRole('radio').first();
  await first.focus();await page.keyboard.press('Space');await expect(first).toBeChecked();
 }
 await page.getByRole('button',{name:'Check answers and save score'}).click();
 await expect(page.locator('.foundation-question .foundation-feedback')).toHaveCount(12);
 await expect(page.getByRole('button',{name:'Retry vocabulary check'})).toBeVisible();
 await page.getByRole('button',{name:'Retry vocabulary check'}).click();
 await expect(page.locator('.foundation-question .foundation-feedback')).toHaveCount(0);
});
test('320px dark mode, model comparison and no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'Where are you going, and how?'})).toBeVisible();
 await page.getByLabel('Write a destination, a means of travel and a return-home sentence.').fill('公園へ行きます。');
 await page.getByRole('button',{name:'Compare with model'}).click();
 await expect(page.getByText(/自転車で行きます/).last()).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});
