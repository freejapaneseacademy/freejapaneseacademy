import { test, expect } from '@playwright/test';
test('loanword context quiz works with keyboard on 320px mobile',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-04/chapter-04/lesson-01/');
 await expect(page.locator('.page-hero h1')).toContainText('Loanwords at a station café');
 await expect(page.getByRole('heading',{name:'Read the station café scene'})).toBeVisible();
 const fields=page.locator('fieldset'); await expect(fields).toHaveCount(10);
 const submit=page.getByRole('button',{name:'Check all ten answers'});
 await expect(submit).toBeDisabled();
 for(let i=0;i<10;i++){const radio=fields.nth(i).locator('input[type="radio"]').first();await radio.focus();await page.keyboard.press('Space');}
 await expect(submit).toBeEnabled();await submit.click();
 await expect(page.getByText(/Written score: \d+\/10/)).toBeVisible();
 await page.getByRole('button',{name:'Try the questions again'}).click();
 await expect(submit).toBeDisabled();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
});