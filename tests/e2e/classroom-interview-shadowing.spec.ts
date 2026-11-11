import { test, expect } from '@playwright/test';
const path='/learn/n5/module-01/chapter-02/lesson-08/';
test('keyboard rehearsal, answer reveal and retry',async({page})=>{
 await page.goto(path);
 const reveal=page.getByRole('button',{name:'Reveal model answer'}).first();
 await reveal.focus();await page.keyboard.press('Enter');
 await expect(page.getByText('田中先生です。').first()).toBeVisible();
 const choices=page.locator('fieldset');
 await expect(choices).toHaveCount(8);
 for(let i=0;i<8;i++)await choices.nth(i).locator('input[type="radio"]').first().check();
 await page.getByRole('button',{name:'Check recognition answers'}).click();
 await expect(page.getByText(/Recognition score: 8\/8/)).toBeVisible();
 await page.getByRole('button',{name:'Retry recognition'}).click();
 await expect(page.getByRole('button',{name:'Check recognition answers'})).toBeVisible();
});
test('320px dark mode has no horizontal overflow and self-review is editable',async({page})=>{
 await page.setViewportSize({width:320,height:740});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);
 await page.getByLabel('One thing to improve next time').fill('Pause after questions.');
 await page.getByRole('button',{name:'Save private review'}).click();
 await expect(page.getByText('Private self-review saved on this device.')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
