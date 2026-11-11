import {test,expect} from '@playwright/test';
const url='/learn/n5/module-01/chapter-04/checkpoint/';
test('keyboard submission, feedback, persistent-attempt affordance and retry',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/personal profiles.*chapter checkpoint/i}).first()).toBeVisible();
 const questions=page.locator('fieldset');await expect(questions).toHaveCount(10);
 for(let i=0;i<10;i++){await questions.nth(i).locator('input[type=radio]').first().focus();await page.keyboard.press('Space');}
 await page.getByRole('button',{name:'Check 10 answers'}).click();
 await expect(page.getByText(/\/10 correct/).first()).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(questions).toHaveCount(10);
});
test('320px dark mode does not overflow',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 await expect(page.getByRole('heading',{name:/personal profiles.*chapter checkpoint/i}).first()).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});