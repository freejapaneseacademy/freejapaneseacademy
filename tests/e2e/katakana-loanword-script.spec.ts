import { test, expect } from '@playwright/test';
const path='/learn/start/module-04/chapter-04/lesson-04/';
test('keyboard accessible spelling check with feedback and retry',async({page})=>{
 await page.goto(path);await expect(page.getByRole('heading',{name:/Katakana loanword signs/})).toBeVisible();
 const check=page.getByRole('button',{name:'Check ten answers'});await expect(check).toBeDisabled();
 const groups=page.locator('fieldset');await expect(groups).toHaveCount(10);
 for(let i=0;i<10;i++){await groups.nth(i).getByRole('radio').first().focus();await page.keyboard.press('Space');}
 await expect(check).toBeEnabled();await check.click();await expect(page.getByText(/Written score:/)).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();await expect(check).toBeDisabled();
});
test('320px viewport has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.goto(path);
 await expect(page.getByRole('heading',{name:/Katakana loanword signs/})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
});
