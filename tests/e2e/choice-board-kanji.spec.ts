import { test, expect } from '@playwright/test';
test('choice-board kanji supports keyboard, feedback and retry',async({page})=>{
 await page.goto('/learn/n5/module-07/chapter-03/lesson-04/');
 await expect(page.getByRole('heading',{name:/Choice-board kanji:/i})).toBeVisible();
 const groups=page.locator('fieldset[data-question-id]');await expect(groups).toHaveCount(8);
 for(let i=0;i<8;i++){await groups.nth(i).locator('input[type="radio"]').first().focus();await page.keyboard.press('Space');}
 await page.getByRole('button',{name:'Check 8 answers'}).click();
 await expect(page.getByText(/Written practice score:/)).toBeVisible();
 await expect(page.getByText(/Attempt saved|Storage unavailable/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check 8 answers'})).toBeVisible();
});
test('320px dark mode avoids horizontal overflow and labels every option',async({page})=>{
 await page.setViewportSize({width:320,height:740});await page.emulateMedia({colorScheme:'dark'});
 await page.goto('/learn/n5/module-07/chapter-03/lesson-04/');
 await expect(page.locator('fieldset[data-question-id]')).toHaveCount(8);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 await expect(page.locator('fieldset[data-question-id]').first().locator('label')).toHaveCount(3);
});