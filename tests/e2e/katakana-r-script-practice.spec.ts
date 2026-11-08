import {test,expect} from '@playwright/test';
test('katakana R-row script practice supports keyboard and 320px layout',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.goto('/learn/start/module-04/chapter-03/lesson-04/');
 await expect(page.locator('.page-hero h1')).toContainText('Katakana R row');
 await expect(page.getByRole('heading',{name:'Twelve written katakana checks'})).toBeVisible();
 const fields=page.locator('fieldset');await expect(fields).toHaveCount(12);
 const submit=page.getByRole('button',{name:'Check twelve answers'});await expect(submit).toBeDisabled();
 for(let i=0;i<12;i++){await fields.nth(i).locator('input[type="radio"]').first().focus();await page.keyboard.press('Space');}
 await expect(submit).toBeEnabled();await submit.click();
 await expect(page.getByText(/Written score: \d+\/12/)).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();await expect(submit).toBeDisabled();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
});