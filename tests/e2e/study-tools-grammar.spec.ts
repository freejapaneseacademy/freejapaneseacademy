import {test,expect} from '@playwright/test';
test('Chapter 04 L03 loads, scores and gives written explanations',async({page})=>{
 await page.goto('/learn/start/module-01/chapter-04/lesson-03/');
 await expect(page.getByRole('heading',{name:/Ask clearly/i})).toBeVisible();
 const fieldsets=page.locator('fieldset.foundation-question');await expect(fieldsets).toHaveCount(12);
 for(let i=0;i<12;i++)await fieldsets.nth(i).locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Submit all answers'}).click();
 await expect(page.getByText(/Score: \d+ of 12/)).toBeVisible();
 await expect(page.locator('.foundation-feedback')).toHaveCount(12);
});
test('Chapter 04 L03 is usable at 320px in dark mode',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto('/learn/start/module-01/chapter-04/lesson-03/');
 await expect(page.locator('fieldset.foundation-question').first()).toBeVisible();
 await page.locator('fieldset.foundation-question').first().locator('input[type=radio]').first().focus();
 await expect(page.locator('fieldset.foundation-question').first().locator('input[type=radio]').first()).toBeFocused();
});