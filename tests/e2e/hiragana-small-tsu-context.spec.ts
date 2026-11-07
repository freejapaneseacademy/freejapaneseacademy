import { test, expect } from '@playwright/test';
const url='/learn/start/module-03/chapter-03/lesson-01/';
test('small-tsu library context is accessible and scores written responses',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/Small っ and long vowels/})).toBeVisible();
 const fields=page.locator('fieldset');await expect(fields).toHaveCount(8);
 for(let i=0;i<8;i++)await fields.nth(i).locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check all eight answers'}).click();
 await expect(page.getByText(/Written score:/)).toBeVisible();
 await page.getByRole('button',{name:'Try the questions again'}).click();
 await expect(page.getByRole('button',{name:'Check all eight answers'})).toBeDisabled();
});
test('small-tsu lesson does not overflow at 320px',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.goto(url);
 await expect(page.locator('body')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});