import {test,expect} from '@playwright/test';
const url='/learn/n5/module-02/chapter-01/lesson-05/';
test('keyboard reading quiz, feedback and retry',async({page})=>{
 await page.goto(url);await expect(page.getByRole('heading',{name:'Read two lost-and-found notes'})).toBeVisible();
 const fieldsets=page.locator('.foundation-question');await expect(fieldsets).toHaveCount(10);
 for(let i=0;i<10;i++){const first=fieldsets.nth(i).getByRole('radio').first();await first.focus();await page.keyboard.press('Space');await expect(first).toBeChecked();}
 await page.getByRole('button',{name:'Check answers and save score'}).click();await expect(page.locator('.foundation-feedback')).toHaveCount(10);
 await page.getByRole('button',{name:'Retry reading check'}).click();await expect(page.locator('.foundation-feedback')).toHaveCount(0);
});
test('320px dark-mode page, writing model and no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 await expect(page.getByRole('heading',{name:'Find the evidence in each note'})).toBeVisible();
 await page.getByLabel('Write a three-line lost-and-found notice with an object, an owner or unknown owner, and a location.').fill('白い ほんが あります。');
 await page.getByRole('button',{name:'Compare with model'}).click();await expect(page.getByText(/ユイさんのです/).last()).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});