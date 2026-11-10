import { test,expect } from '@playwright/test';
const path='/learn/start/module-05/chapter-03/lesson-07/';
test('IME-friendly draft, local save, keyboard quiz and retry',async({page})=>{
 await page.goto(path);const draft=page.getByLabel('Your two-line Japanese draft');await expect(draft).toBeEnabled();await draft.fill('これは ペンです。\nこれは ノートですか。');
 await page.getByRole('button',{name:'Save draft'}).click();
 // Loading must restore the saved text rather than an unsaved edit.
 await draft.fill('まだ保存していない文。');
 await page.getByRole('button',{name:'Load draft'}).click();
 await expect(draft).toHaveValue('これは ペンです。\nこれは ノートですか。');
 // Clear draft intentionally deletes both the editor value and the local saved copy.
 await page.getByRole('button',{name:'Clear draft'}).click();
 await expect(draft).toHaveValue('');
 await page.getByRole('button',{name:'Load draft'}).click();
 await expect(draft).toHaveValue('');
 await page.getByRole('button',{name:'Compare model'}).click();await expect(page.getByText(/Model for a pen and notebook/)).toBeVisible();
 const groups=page.locator('fieldset[data-question-id]');await expect(groups).toHaveCount(8);
 await groups.first().locator('input[type=radio]').first().focus();await page.keyboard.press('Space');await expect(groups.first().locator('input[type=radio]').first()).toBeChecked();
 for(let i=1;i<8;i++)await groups.nth(i).locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check 8 answers'}).click();await expect(page.getByText(/Written recognition score:/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();await expect(page.getByRole('button',{name:'Check 8 answers'})).toBeDisabled();
});
test('320px mobile dark-mode layout',async({page})=>{await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);await expect(page.getByLabel('Your two-line Japanese draft')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);});
