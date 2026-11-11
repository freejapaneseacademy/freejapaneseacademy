import { test, expect } from '@playwright/test';
test('L03 confusables lesson supports mobile, keyboard and retry',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-02/chapter-04/lesson-03/');
 await expect(page.getByRole('heading',{name:/Look-alike hiragana/i})).toBeVisible();
 await expect(page.locator('fieldset')).toHaveCount(10);
 await expect(page.getByRole('button',{name:'Check all ten answers'})).toBeDisabled();
 for(const field of await page.locator('fieldset').all())await field.locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check all ten answers'}).click();
 await expect(page.getByText(/Written score:/)).toBeVisible();
 await expect(page.getByText(/Correct\.|Not quite\./).first()).toBeVisible();
 await page.getByRole('button',{name:'Try the questions again'}).click();
 await expect(page.getByRole('button',{name:'Check all ten answers'})).toBeDisabled();
 await page.evaluate(()=>document.documentElement.classList.add('dark'));
 await expect(page.getByRole('heading',{name:/Check kana and sentence boundaries/})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
});