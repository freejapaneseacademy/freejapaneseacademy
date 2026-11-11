import { test, expect } from '@playwright/test';
const url='/learn/n5/module-01/chapter-03/checkpoint/';
test('keyboard answers, retry and written-only feedback',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/family and relationships/i}).first()).toBeVisible();
 const groups=page.locator('fieldset');await expect(groups).toHaveCount(10);
 for(let i=0;i<10;i++){await groups.nth(i).locator('input[type=radio]').first().focus();await page.keyboard.press('Space');}
 await page.getByRole('button',{name:/Check 10 answers/}).click();
 await expect(page.getByText(/10 correct|\/10 correct/).first()).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(groups).toHaveCount(10);
});
test('320px mobile and dark mode no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 await expect(page.getByRole('heading',{name:/family and relationships/i}).first()).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
 expect(overflow).toBe(false);
});