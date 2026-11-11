import { test, expect } from '@playwright/test';
test('kanji practice works by keyboard and can retry',async({page})=>{
 await page.goto('/learn/n5/module-06/chapter-03/lesson-04/');
 await expect(page.getByRole('heading',{name:/Read classroom rules/i})).toBeVisible();
 const groups=page.locator('fieldset[data-question-id]');
 await expect(groups).toHaveCount(8);
 for(let i=0;i<8;i++){await groups.nth(i).locator('input[type="radio"]').first().focus();await page.keyboard.press('Space');}
 await page.getByRole('button',{name:'Check 8 answers'}).click();
 await expect(page.getByText(/Written practice score:/)).toBeVisible();
 await expect(page.getByText(/Attempt saved|Storage unavailable/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check 8 answers'})).toBeDisabled();
});
test('320px dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto('/learn/n5/module-06/chapter-03/lesson-04/');
 await expect(page.locator('fieldset[data-question-id]')).toHaveCount(8);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
 expect(overflow).toBe(false);
});
