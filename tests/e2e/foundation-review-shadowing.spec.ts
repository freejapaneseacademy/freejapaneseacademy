import {test,expect} from '@playwright/test';
const url='/learn/start/module-05/chapter-04/lesson-08/';
test('keyboard, written feedback and retry',async({page})=>{
 await page.goto(url);await expect(page.getByRole('heading',{name:/a small, sustainable kana review plan/i})).toBeVisible();
 await page.getByRole('radio').first().focus();await page.keyboard.press('Space');await expect(page.getByRole('radio').first()).toBeChecked();
 const fields=page.locator('fieldset').filter({has:page.getByRole('radio')});expect(await fields.count()).toBe(8);
 for(const field of await fields.all()) await field.getByRole('radio').first().check();
 await page.getByRole('button',{name:'Check written answers'}).click();await expect(page.getByText(/8 of 8 written answers correct/)).toBeVisible();
 await page.getByRole('button',{name:'Try written check again'}).click();await expect(page.getByRole('button',{name:'Check written answers'})).toBeDisabled();
});
test('320px and microphone opt-in in dark mode',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.goto(url);await page.emulateMedia({colorScheme:'dark'});
 await expect(page.getByRole('button',{name:'Start optional recording'})).toBeVisible();
 await expect(page.getByRole('heading',{name:/listen and rehearse kana review plans/i})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1)).toBe(false);
});