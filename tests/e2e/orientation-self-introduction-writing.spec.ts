import { test,expect } from '@playwright/test';
const path='/learn/n5/module-01/chapter-04/lesson-07/';
test('keyboard radio selection and draft persistence',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:'Orientation writing workshop'})).toBeVisible();
 const first=page.locator('fieldset.foundation-question').first();
 await first.locator('input[type=radio]').first().focus();
 await page.keyboard.press('Space');
 await expect(first.locator('input[type=radio]').first()).toBeChecked();
 const draft=page.getByLabel('Your Japanese introduction');
 await draft.fill('わたしは山本みおです。');
 await page.getByRole('button',{name:'Save on this device'}).click();
 await draft.fill('');
 await page.getByRole('button',{name:'Load saved draft'}).click();
 await expect(draft).toHaveValue('わたしは山本みおです。');
 await page.getByRole('button',{name:'Compare with model and rubric'}).click();
 await expect(page.getByRole('region',{name:'Writing model and rubric'})).toBeVisible();
});
test('320px dark-mode layout avoids horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await expect(page.getByRole('heading',{name:'Orientation writing workshop'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
});
