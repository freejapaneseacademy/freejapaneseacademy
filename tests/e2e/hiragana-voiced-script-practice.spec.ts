import { test, expect } from '@playwright/test';
test('marked kana script practice is usable with keyboard and at 320px',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.goto('/learn/start/module-03/chapter-01/lesson-04/');
 await expect(page.getByRole('heading',{name:/Recognize and type voiced/})).toBeVisible();
 const fieldsets=page.locator('fieldset');
 await expect(fieldsets).toHaveCount(10);
 for(let i=0;i<10;i++)await fieldsets.nth(i).locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check all ten answers'}).click();
 await expect(page.getByText(/Written score:/)).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
 expect(overflow).toBe(false);
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(page.getByRole('button',{name:'Check all ten answers'})).toBeDisabled();
});