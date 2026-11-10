import {test,expect} from '@playwright/test';
const route='/learn/n5/module-04/chapter-01/lesson-05/';
test('keyboard-accessible menu reading and retry',async({page})=>{
 await page.goto(route);await expect(page.getByRole('heading',{name:/Read a café menu/i}).first()).toBeVisible();
 const groups=page.locator('.foundation-question');await expect(groups).toHaveCount(12);
 await groups.first().locator('input[type=radio]').first().focus();await page.keyboard.press('Space');
 await expect(groups.first().locator('input[type=radio]').first()).toBeChecked();
 for(let i=1;i<12;i++)await groups.nth(i).locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:/Check answers and save score/}).click();
 await expect(page.locator('.foundation-result')).toContainText('/ 12 correct');
 await page.getByRole('button',{name:/Retry menu reading/}).click();
 await expect(groups.first().locator('input[type=radio]').first()).not.toBeChecked();
});
test('320px dark mode no overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(route);
 await expect(page.locator('.foundation-question')).toHaveCount(12);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
});
