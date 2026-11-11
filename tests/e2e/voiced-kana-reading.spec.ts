import { test, expect } from '@playwright/test';
const route='/learn/start/module-03/chapter-01/lesson-05/';
test('voiced reading lesson accessible keyboard score and retry',async({page})=>{
 await page.goto(route);await expect(page.getByRole('heading',{name:'Read the marked-kana contrast board'})).toBeVisible();
 const groups=page.locator('fieldset');await expect(groups).toHaveCount(10);
 for(let i=0;i<10;i++)await groups.nth(i).getByRole('radio').first().check();
 await page.getByRole('button',{name:'Check all ten answers'}).click();
 await expect(page.getByText(/Written reading score:/)).toBeVisible();
 await expect(groups.first().getByText(/Evidence:/)).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(page.getByRole('button',{name:'Check all ten answers'})).toBeDisabled();
});
test('voiced reading works at 320px and dark mode',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.emulateMedia({colorScheme:'dark'});await page.goto(route);
 await expect(page.getByRole('heading',{name:'Check the contrast board'})).toBeVisible();
 await expect(page.locator('fieldset')).toHaveCount(10);
});
