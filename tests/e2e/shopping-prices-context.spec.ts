import {test,expect} from '@playwright/test';
const url='/learn/n5/module-04/chapter-02/lesson-01/';
test('keyboard quiz, retry and feedback',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/At the stationery shop/i})).toBeVisible();
 const radios=page.locator('fieldset input[type=radio]');
 await radios.first().focus();await page.keyboard.press('Space');
 await expect(radios.first()).toBeChecked();
 for(const fieldset of await page.locator('fieldset').all())await fieldset.locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText(/12 of 12 correct/)).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(page.getByRole('button',{name:'Check answers'})).toBeDisabled();
});
test('320px dark mode stays within viewport',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/At the stationery shop/i})).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
 expect(overflow).toBe(false);
});