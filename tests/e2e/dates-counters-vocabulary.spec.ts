import {test,expect} from '@playwright/test';
const url='/learn/n5/module-03/chapter-01/lesson-02/';
test('keyboard answers, feedback and retry',async({page})=>{
 await page.goto(url);await expect(page.getByRole('heading',{name:'Dates and counters: reading the calendar and counting people'})).toBeVisible();
 const questions=page.locator('.foundation-question');await expect(questions).toHaveCount(14);
 for(let i=0;i<14;i++){const radio=questions.nth(i).getByRole('radio').first();await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
 await page.getByRole('button',{name:'Check answers and save score'}).click();await expect(page.locator('.foundation-feedback')).toHaveCount(14);
 await page.getByRole('button',{name:'Retry date vocabulary'}).click();await expect(page.locator('.foundation-feedback')).toHaveCount(0);
});
test('320px mobile dark theme and writing model',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 await expect(page.getByRole('heading',{name:'Read dates and quantities'})).toBeVisible();
 await page.getByLabel('Write a date and two quantities for your own fictional event.').fill('学生が二人います。');
 await page.getByRole('button',{name:'Compare with model'}).click();await expect(page.getByText(/Different natural answers are possible/)).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});
