import {test,expect} from '@playwright/test';
const url='/learn/n5/module-04/chapter-03/lesson-08/';
test('keyboard selection, feedback and retry',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'Prepare your optional description conversation'})).toBeVisible();
 const questions=page.locator('[data-question-id]');await expect(questions).toHaveCount(8);
 const correct=["a","b","c","a","b","c","a","b"];
 for(let i=0;i<correct.length;i++){const radio=questions.nth(i).locator('input[value="'+correct[i]+'"]');await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
 await page.getByRole('button',{name:'Check answers and save attempt'}).click();
 await expect(page.getByRole('heading',{name:'8 / 8 correct'})).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(page.getByText('0 of 8 answered')).toBeVisible();
});
test('320px dark-mode writing alternative and model',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 await page.getByLabel('Write a four-turn fictional conversation or silent rehearsal notes.').fill('この部屋は しずかです。');
 await page.getByRole('button',{name:'Compare with model'}).click();
 await expect(page.getByText('Other correct exchanges are possible.',{exact:false})).toBeVisible();
 await page.getByLabel('Both questions identify a thing or place').check();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2)).toBe(true);
});