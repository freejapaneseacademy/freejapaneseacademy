import {test,expect} from '@playwright/test';
const path='/learn/n5/module-02/chapter-01/lesson-02/';
test('keyboard practice and feedback',async({page})=>{
 await page.goto(path);await expect(page.getByRole('heading',{name:'School supplies at the lost-and-found desk'})).toBeVisible();
 const choices=page.locator('fieldset');await expect(choices).toHaveCount(8);
 for(let i=0;i<8;i++){await choices.nth(i).locator('input[type=radio]').first().focus();await page.keyboard.press('Space');}
 await page.getByRole('button',{name:'Check answers'}).click();await expect(page.getByText(/Written recognition: 8 of 8/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();await expect(page.getByRole('button',{name:'Check answers'})).toBeVisible();
});
test('320px dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);
 await expect(page.locator('fieldset')).toHaveCount(8);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});