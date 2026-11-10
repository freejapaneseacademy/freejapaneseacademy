import {test,expect} from '@playwright/test';
const url='/learn/n5/module-04/chapter-01/lesson-04/';
test('keyboard quiz and retry with feedback',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'Read words from the café'})).toBeVisible();
 const fields=page.locator('fieldset.foundation-question');await expect(fields).toHaveCount(12);
 await fields.first().locator('input[type=radio]').first().focus();
 await page.keyboard.press('Space');
 await expect(fields.first().locator('input[type=radio]').first()).toBeChecked();
 for(let i=1;i<12;i++)await fields.nth(i).locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check answers and save score'}).click();
 await expect(page.getByRole('button',{name:'Try again'})).toBeVisible();
 await expect(fields.first().getByText('水 is read みず and means water.')).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(page.getByRole('button',{name:'Check answers and save score'})).toBeDisabled();
});
test('320px dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 await expect(page.getByRole('heading',{level:1})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await expect(page.locator('fieldset.foundation-question')).toHaveCount(12);
});
