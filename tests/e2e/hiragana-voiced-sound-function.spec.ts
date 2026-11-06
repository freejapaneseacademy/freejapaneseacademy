import { test, expect } from '@playwright/test';
test('voiced kana sound-function lesson supports accessible scoring and 320px',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.goto('/learn/start/module-03/chapter-01/lesson-03/');
 await expect(page.getByRole('heading',{name:/Dakuten and handakuten/})).toBeVisible();
 const fieldsets=page.locator('fieldset');
 await expect(fieldsets).toHaveCount(10);
 for(let i=0;i<10;i++)await fieldsets.nth(i).locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check all ten answers'}).click();
 await expect(page.getByText(/Written score:/)).toBeVisible();
 await expect(page.locator('body')).not.toHaveJSProperty('scrollWidth',999999);
});
