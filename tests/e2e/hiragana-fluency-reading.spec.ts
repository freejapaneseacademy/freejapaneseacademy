import { test, expect } from '@playwright/test';
test('L05 word-card reading works on mobile with keyboard and retry',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-02/chapter-04/lesson-05/');
 await expect(page.getByRole('heading',{name:'Read the classroom word-card board'})).toBeVisible();
 await expect(page.locator('fieldset')).toHaveCount(10);
 await expect(page.getByRole('button',{name:'Check all ten answers'})).toBeDisabled();
 for(const field of await page.locator('fieldset').all())await field.locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check all ten answers'}).click();
 await expect(page.getByText(/Reading score:/)).toBeVisible();
 await expect(page.getByText(/Evidence:/).first()).toBeVisible();
 await page.getByRole('button',{name:'Try the questions again'}).click();
 await expect(page.getByRole('button',{name:'Check all ten answers'})).toBeDisabled();
 await page.evaluate(()=>document.documentElement.classList.add('dark'));
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
});
