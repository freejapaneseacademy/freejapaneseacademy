import {test,expect} from '@playwright/test';
const url='/learn/start/module-04/chapter-01/lesson-04/';
test('katakana lesson is accessible, interactive and saves an attempt',async({page})=>{
 await page.goto(url);await expect(page.getByRole('heading',{name:/Katakana on the kiosk sign/})).toBeVisible();
 await expect(page.getByRole('group')).toHaveCount(8);
 const groups=page.getByRole('group');for(let i=0;i<8;i++)await groups.nth(i).getByRole('radio').first().check();
 await page.getByRole('button',{name:'Check eight answers'}).click();
 await expect(page.getByText(/Written score: \d\/8/)).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(page.getByRole('button',{name:'Check eight answers'})).toBeDisabled();
});
test('320px layout and keyboard radio input',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.goto(url);
 await expect(page.getByRole('heading',{name:/Katakana on the kiosk sign/})).toBeVisible();
 await page.getByRole('radio').first().focus();await page.keyboard.press('Space');
 await expect(page.getByRole('radio').first()).toBeChecked();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
 expect(overflow).toBe(false);
});
