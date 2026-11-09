import { test, expect } from '@playwright/test';
const url='/learn/n5/module-02/chapter-01/lesson-03/';
test('keyboard selection, feedback, retry and progress',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'Demonstratives and ownership'})).toBeVisible();
 const groups=page.locator('fieldset');
 await expect(groups).toHaveCount(12);
 for(let i=0;i<12;i++){const radio=groups.nth(i).getByRole('radio').first();await radio.focus();await page.keyboard.press('Space');}
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText(/Written practice: \d+ of 12 correct/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check answers'})).toBeVisible();
});
test('320px mobile dark mode does not overflow',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.locator('fieldset')).toHaveCount(12);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});