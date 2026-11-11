import {test,expect} from '@playwright/test';
const url='/learn/n5/module-04/chapter-04/lesson-01/';
test('invitation context keyboard quiz, feedback and retry',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/An invitation after class/i})).toBeVisible();
 const groups=page.locator('fieldset.foundation-question');await expect(groups).toHaveCount(12);
 await groups.first().getByRole('radio').first().focus();await page.keyboard.press('Space');
 await expect(groups.first().getByRole('radio').first()).toBeChecked();
 for(let i=1;i<12;i++)await groups.nth(i).getByRole('radio').first().check();
 await page.getByRole('button',{name:/Check answers and save score/}).click();
 await expect(page.getByRole('button',{name:/Retry questions/})).toBeVisible();
 await expect(page.locator('.foundation-feedback').first()).toBeVisible();
 await page.getByRole('button',{name:/Retry questions/}).click();
 await expect(groups.first().getByRole('radio').first()).not.toBeChecked();
});
test('320px dark mode supports writing without horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 await expect(page.getByRole('heading',{name:/An invitation after class/i})).toBeVisible();
 const draft=page.getByLabel(/Write an invitation and a response/);await draft.fill('いっしょに 食べませんか。');
 await expect(draft).toHaveValue('いっしょに 食べませんか。');
 await page.getByRole('button',{name:'Compare with example'}).click();
 await expect(page.getByText(/Check the invitation question ending/)).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});