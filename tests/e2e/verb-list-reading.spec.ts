import { test, expect } from '@playwright/test';
const url='/learn/n5/module-06/chapter-01/lesson-05/';
test('reading lesson supports keyboard answers, evidence feedback and retry',async({page})=>{
 await page.goto(url);await expect(page.getByRole('heading',{name:/Read the Activity Board/i})).toBeVisible();
 const groups=page.locator('fieldset.foundation-question');await expect(groups).toHaveCount(12);
 await groups.first().locator('input[type=radio]').first().focus();await page.keyboard.press('Space');
 await expect(groups.first().locator('input[type=radio]').first()).toBeChecked();
 for(let i=1;i<12;i++)await groups.nth(i).locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:/Check answers and save score/i}).click();
 await expect(page.getByText('Evidence:',{exact:false}).first()).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(groups.first().locator('input[type=radio]').first()).not.toBeChecked();
});
test('320px dark mode does not overflow',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 await expect(page.getByRole('heading',{name:/Read the Activity Board/i})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
