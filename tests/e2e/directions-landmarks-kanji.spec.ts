import {test,expect} from '@playwright/test';
const url='/learn/n5/module-05/chapter-03/lesson-04/';
test('keyboard radio selection, scoring and retry',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'Read the signs and words'})).toBeVisible();
 const questions=page.locator('.foundation-question');
 await expect(questions).toHaveCount(12);
 for(let i=0;i<12;i++){
  const first=questions.nth(i).getByRole('radio').first();
  await first.focus();await page.keyboard.press('Space');await expect(first).toBeChecked();
 }
 await page.getByRole('button',{name:'Check answers and save score'}).click();
 await expect(page.locator('.foundation-feedback')).toHaveCount(12);
 await page.getByRole('button',{name:'Retry script check'}).click();
 await expect(page.locator('.foundation-feedback')).toHaveCount(0);
});
test('320px dark mode, typing and model comparison',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await page.getByLabel('Write a Japanese sentence locating the library to the right of the station.').fill('図書館は駅の右にあります。');
 await page.getByRole('button',{name:'Compare with model'}).click();
 await expect(page.getByText('図書館は駅の右にあります。').last()).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});