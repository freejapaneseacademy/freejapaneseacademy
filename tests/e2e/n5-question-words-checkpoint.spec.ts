import { test, expect } from '@playwright/test';
const path='/learn/n5/module-01/chapter-02/checkpoint/';
test('keyboard selection, scoring, retry and audio gate',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:'Try the chapter checkpoint'})).toBeVisible();
 await expect(page.getByText('Listening questions are locked until both recordings can play.')).toBeVisible();
 const groups=page.locator('fieldset');
 await expect(groups).toHaveCount(10);
 for(let i=0;i<10;i++){const input=groups.nth(i).locator('input[type=radio]').first();await input.focus();await page.keyboard.press('Space');}
 await page.getByRole('button',{name:'Check 10 answers'}).click();
 await expect(page.getByText(/\/10 correct/)).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(page.getByRole('button',{name:'Check 10 answers'})).toBeDisabled();
});
test('320px mobile and dark mode avoid horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);
 await expect(page.locator('h1')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
});
