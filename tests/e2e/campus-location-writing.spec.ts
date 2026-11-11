import {test,expect} from '@playwright/test';
const path='/learn/n5/module-02/chapter-02/lesson-07/';
test('local writing draft and keyboard-operated recognition',async({page})=>{
 await page.goto(path);await expect(page.getByRole('heading',{name:'Write campus locations'})).toBeVisible();
 const draft=page.getByLabel('Write 2–5 connected Japanese sentences about campus locations');
 await draft.fill('図書館は 二階です。受付は ここです。');await page.getByRole('button',{name:'Save draft locally'}).click();await draft.fill('');await page.getByRole('button',{name:'Load saved draft'}).click();await expect(draft).toHaveValue('図書館は 二階です。受付は ここです。');
 const fields=page.locator('fieldset');await expect(fields).toHaveCount(8);
 for(let i=0;i<8;i++){await fields.nth(i).locator('input[type=radio]').nth(i%4).focus();await page.keyboard.press('Space');}
 await page.getByRole('button',{name:'Check recognition answers'}).click();await expect(page.getByText(/Written-form recognition: 8 of 8/)).toBeVisible();
 await page.getByRole('button',{name:'Retry recognition questions'}).click();await expect(page.getByRole('button',{name:'Check recognition answers'})).toBeVisible();await page.getByRole('button',{name:'Clear local draft'}).click();await expect(draft).toHaveValue('');
});
test('320px dark mode writing remains keyboard accessible without horizontal overflow',async({page})=>{await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);await expect(page.getByLabel('Write 2–5 connected Japanese sentences about campus locations')).toBeVisible();await expect(page.locator('fieldset')).toHaveCount(8);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);});
