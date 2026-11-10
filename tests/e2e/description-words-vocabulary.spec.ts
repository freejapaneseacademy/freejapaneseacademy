import {test,expect} from '@playwright/test';
const path='/learn/n5/module-04/chapter-03/lesson-02/';
test('keyboard choices, feedback and retry',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:'Words for taste, size and evaluation'})).toBeVisible();
 const questions=page.locator('fieldset');await expect(questions).toHaveCount(12);
 for(let i=0;i<12;i++){await questions.nth(i).locator('input[type=radio]').first().focus();await page.keyboard.press('Space');}
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText(/Written recognition: \d+ of 12 correct/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check answers'})).toBeVisible();
});
test('320px dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);
 await expect(page.locator('fieldset')).toHaveCount(12);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
