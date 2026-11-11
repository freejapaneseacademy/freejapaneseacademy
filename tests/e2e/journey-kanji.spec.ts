import {test,expect} from '@playwright/test';
const path='/learn/n5/module-05/chapter-01/lesson-04/';
test('keyboard answers, feedback and retry',async({page})=>{
 await page.goto(path);await expect(page.getByRole('heading',{name:'Kanji for a journey'})).toBeVisible();
 const fields=page.locator('fieldset');await expect(fields).toHaveCount(10);
 for(let i=0;i<10;i++){await fields.nth(i).getByRole('radio').first().check();}
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText(/Written recognition: \d+ of 10 correct/)).toBeVisible();
 await expect(fields.first().getByRole('status')).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check answers'})).toBeVisible();
 await fields.first().getByRole('radio').first().focus();
 await expect(fields.first().getByRole('radio').first()).toBeFocused();
});
test('320px viewport and dark theme have no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);await expect(page.getByRole('heading',{name:'Kanji for a journey'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});