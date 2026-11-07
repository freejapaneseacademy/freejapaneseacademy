import {test,expect} from '@playwright/test';
test('l0-m04-c01-l08 optional speaking rehearsal is accessible on mobile and keyboard',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-04/chapter-01/lesson-08/');
 await expect(page.getByRole('heading',{level:1})).toContainText('Shadow');
 await expect(page.locator('audio')).toHaveCount(2);
 await expect(page.locator('fieldset').filter({has:page.locator('input[type=radio]')})).toHaveCount(8);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 for(const field of await page.locator('fieldset').filter({has:page.locator('input[type=radio]')}).all())await field.locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check written answers'}).click();
 await expect(page.getByText(/Written score: 8\//)).toHaveCount(0);
 await expect(page.getByText(/Written score: \d\/8/)).toBeVisible();
 await page.getByRole('button',{name:'Try written check again'}).focus();
 await page.keyboard.press('Enter');
 await expect(page.getByRole('button',{name:'Check written answers'})).toBeDisabled();
});