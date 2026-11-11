import { test,expect } from '@playwright/test';
const path='/learn/n5/module-05/chapter-03/lesson-07/';
test('draft persistence, model, keyboard questions and retry',async({page})=>{
 await page.goto(path);const draft=page.getByLabel('Your Japanese directions draft');await expect(draft).toBeEnabled();await draft.fill('駅から、まっすぐ行ってください。');
 await page.getByRole('button',{name:'Save draft'}).click();await draft.fill('変更');await page.getByRole('button',{name:'Load draft'}).click();await expect(draft).toHaveValue('駅から、まっすぐ行ってください。');
 await page.getByRole('button',{name:'Compare model'}).click();await expect(page.getByText('Model directions:')).toBeVisible();
 const groups=page.locator('fieldset[data-question-id]');await expect(groups).toHaveCount(12);
 await groups.first().locator('input[type=radio]').first().focus();await page.keyboard.press('Space');await expect(groups.first().locator('input[type=radio]').first()).toBeChecked();
 for(let i=1;i<12;i++)await groups.nth(i).locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check 12 answers'}).click();await expect(page.getByText(/Written recognition score:/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();await expect(page.getByRole('button',{name:'Check 12 answers'})).toBeDisabled();
 await page.getByRole('button',{name:'Clear draft'}).click();await expect(draft).toHaveValue('');
});
test('320px dark-mode has no horizontal overflow',async({page})=>{await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);await expect(page.getByLabel('Your Japanese directions draft')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false)});
