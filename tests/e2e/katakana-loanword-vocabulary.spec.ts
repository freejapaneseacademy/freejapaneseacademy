import { test, expect } from '@playwright/test';
test('loanword vocabulary keyboard quiz and 320px mobile layout',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-04/chapter-04/lesson-02/');
 await expect(page.locator('.page-hero h1')).toContainText('Katakana loanwords');
 await expect(page.getByRole('heading',{name:'Retrieve loanwords in context'})).toBeVisible();
 const fields=page.locator('fieldset'); await expect(fields).toHaveCount(10);
 const submit=page.getByRole('button',{name:'Check all ten answers'});
 await expect(submit).toBeDisabled();
 for(let i=0;i<10;i++){await fields.nth(i).locator('input[type="radio"]').first().focus();await page.keyboard.press('Space');}
 await expect(submit).toBeEnabled(); await submit.click();
 await expect(page.getByText(/Written vocabulary score: \d+\/10/)).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(submit).toBeDisabled();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
});