import { test, expect } from '@playwright/test';
const path='/learn/start/module-04/chapter-03/lesson-02/';
test('voiced katakana vocabulary keyboard, feedback and retry',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/Shop signs in katakana/})).toBeVisible();
 const groups=page.locator('fieldset');
 await expect(groups).toHaveCount(8);
 await expect(page.getByRole('button',{name:'Check eight answers'})).toBeDisabled();
 for(let i=0;i<8;i++){const first=groups.nth(i).getByRole('radio').first();await first.focus();await page.keyboard.press('Space');}
 await expect(page.getByRole('button',{name:'Check eight answers'})).toBeEnabled();
 await page.getByRole('button',{name:'Check eight answers'}).click();
 await expect(page.getByText(/Written score:/)).toBeVisible();
 await expect(page.getByText(/Review this word\.|Correct\./).first()).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(page.getByRole('button',{name:'Check eight answers'})).toBeDisabled();
});
test('320px viewport has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/Shop signs in katakana/})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
});
