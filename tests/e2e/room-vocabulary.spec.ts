import {test,expect} from '@playwright/test';
const url='/learn/n5/module-02/chapter-04/lesson-02/';
test('keyboard answers, feedback, local score and retry',async({page})=>{
 await page.goto(url);await expect(page.getByRole('heading',{name:'Room vocabulary: furniture and spatial words'})).toBeVisible();
 const questions=page.locator('.foundation-question');await expect(questions).toHaveCount(13);
 for(let i=0;i<13;i++){const first=questions.nth(i).getByRole('radio').first();await first.focus();await page.keyboard.press('Space');await expect(first).toBeChecked();}
 await page.getByRole('button',{name:'Check answers and save score'}).click();await expect(page.locator('.foundation-feedback')).toHaveCount(13);
 await page.getByRole('button',{name:'Retry room vocabulary'}).click();await expect(page.locator('.foundation-feedback')).toHaveCount(0);
});
test('320px mobile dark theme and writing self-review',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 await expect(page.getByRole('heading',{name:'Furniture and positions'})).toBeVisible();
 await page.getByLabel('Write three sentences describing a fictional room.').fill('本は机の上にあります。');
 await page.getByRole('button',{name:'Compare with model'}).click();await expect(page.getByText(/Different natural answers are possible/)).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});