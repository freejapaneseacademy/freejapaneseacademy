import { test,expect } from '@playwright/test';
const path='/learn/n5/module-02/chapter-04/lesson-07/';
test('draft persistence, keyboard recognition and retry',async({page})=>{
 await page.goto(path);const draft=page.getByLabel('Your Japanese room draft');await expect(draft).toBeEnabled();await draft.fill('部屋に机があります。\n机の下にかばんがあります。');
 await page.getByRole('button',{name:'Save draft'}).click();await draft.fill('未保存');await page.getByRole('button',{name:'Load draft'}).click();await expect(draft).toHaveValue('部屋に机があります。\n机の下にかばんがあります。');
 await page.getByRole('button',{name:'Compare model'}).click();await expect(page.getByText('Model room note:')).toBeVisible();
 const groups=page.locator('fieldset[data-question-id]');await expect(groups).toHaveCount(8);
 await groups.first().locator('input[type=radio]').first().focus();await page.keyboard.press('Space');await expect(groups.first().locator('input[type=radio]').first()).toBeChecked();
 for(let i=1;i<8;i++)await groups.nth(i).locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check 8 answers'}).click();await expect(page.getByText(/Written recognition score:/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();await expect(page.getByRole('button',{name:'Check 8 answers'})).toBeDisabled();
 await page.getByRole('button',{name:'Clear draft'}).click();await expect(draft).toHaveValue('');
});
test('320px dark-mode has no horizontal overflow',async({page})=>{await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);await expect(page.getByLabel('Your Japanese room draft')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false)});
