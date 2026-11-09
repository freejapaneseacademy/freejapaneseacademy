import { test, expect } from '@playwright/test';
const path='/learn/start/module-05/chapter-03/lesson-04/';
test('keyboard selection, feedback and retry',async ({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/Read and type first-sentence kana/i})).toBeVisible();
 const groups=page.locator('fieldset[data-question-id]');
 await expect(groups).toHaveCount(12);
 await groups.first().locator('input[type=radio]').first().focus();
 await page.keyboard.press('Space');
 await expect(groups.first().locator('input[type=radio]').first()).toBeChecked();
 for(let i=1;i<12;i++) await groups.nth(i).locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check 12 answers'}).click();
 await expect(page.getByText(/Written script score:/)).toBeVisible();
 await expect(groups.first().getByRole('status').getByText(/topic particle/i)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check 12 answers'})).toBeDisabled();
});
test('320px layout and dark mode',async ({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await expect(page.locator('fieldset[data-question-id]').first()).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
 expect(overflow).toBe(false);
});