import { test, expect } from '@playwright/test';
const path='/learn/start/module-05/chapter-04/lesson-02/';
test('keyboard-answerable written review and retry', async ({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/Foundation review words/})).toBeVisible();
 const submit=page.getByRole('button',{name:'Check all twelve answers'});
 await expect(submit).toBeDisabled();
 const groups=page.locator('fieldset');
 await expect(groups).toHaveCount(12);
 for(let i=0;i<12;i++){const choice=groups.nth(i).locator('input[type="radio"]').first();await choice.focus();await page.keyboard.press('Space');}
 await expect(submit).toBeEnabled();
 await submit.click();
 await expect(page.getByText(/Written review score:/)).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(submit).toBeDisabled();
});
test('320px mobile has no horizontal overflow',async ({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.goto(path);
 await expect(page.locator('fieldset')).toHaveCount(12);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
 expect(overflow).toBe(false);
});
