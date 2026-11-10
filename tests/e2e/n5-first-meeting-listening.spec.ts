import {test,expect} from '@playwright/test';
const path='/learn/n5/module-01/chapter-01/lesson-06/';
test('keyboard transcript access and authentic audio gating',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/First meetings/})).toBeVisible();
 await expect(page.locator('audio')).toHaveCount(2);
 await expect(page.locator('fieldset')).toHaveCount(6);
 const submit=page.getByRole('button',{name:'Check listening answers'});
 await expect(submit).toBeDisabled();
 await page.getByRole('button',{name:/Reveal transcript/}).first().focus();
 await page.keyboard.press('Enter');
 await expect(page.getByText(/こんにちは。わたしは、エマです。/).last()).toBeVisible();
 for(let i=0;i<6;i++){await page.locator('fieldset').nth(i).getByRole('radio').first().focus();await page.keyboard.press('Space');}
 await expect(submit).toBeDisabled();
});
test('320px viewport and dark theme avoid overflow',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await expect(page.locator('audio')).toHaveCount(2);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
});
