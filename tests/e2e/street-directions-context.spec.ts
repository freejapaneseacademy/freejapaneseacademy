import {test,expect} from '@playwright/test';
const url='/learn/n5/module-05/chapter-03/lesson-01/';
test('keyboard radio choices, score feedback and retry',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'Follow the stated clues'})).toBeVisible();
 const questions=page.locator('.foundation-question');
 await expect(questions).toHaveCount(12);
 for(let i=0;i<12;i++){
  const first=questions.nth(i).getByRole('radio').first();
  await first.focus();await page.keyboard.press('Space');await expect(first).toBeChecked();
 }
 await page.getByRole('button',{name:'Check answers and save score'}).click();
 await expect(page.locator('.foundation-feedback')).toHaveCount(12);
 await page.getByRole('button',{name:'Retry context check'}).click();
 await expect(page.locator('.foundation-feedback')).toHaveCount(0);
});
test('320px dark mode, accessible writing and model comparison',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await page.getByLabel('Write a short Japanese request asking where the library is, followed by one direction.').fill('図書館はどこですか。');
 await page.getByRole('button',{name:'Compare with model'}).click();
 await expect(page.getByText('図書館はどこですか。まっすぐ行ってください。').last()).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});