import { test,expect } from '@playwright/test';
const path='/learn/n5/module-07/chapter-01/lesson-01/';
test('keyboard choice, feedback, model, and retry',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/What Do You Like/})).toBeVisible();
 await page.getByLabel('Write two to four lines about likes and an optional ability').fill('音楽が好きです。');
 await page.getByRole('button',{name:'Show writing model'}).click();
 await expect(page.getByText(/Check が好きです/)).toBeVisible();
 const groups=page.locator('.foundation-question');
 await expect(groups).toHaveCount(12);
 for(let i=0;i<12;i++){const options=groups.nth(i).getByRole('radio');await options.nth(i%3).focus();await page.keyboard.press('Space');await expect(options.nth(i%3)).toBeChecked();}
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText('Recognition score: 12 / 12')).toBeVisible();
 await expect(groups.first().getByText(/Correct/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check answers'})).toBeDisabled();
 await expect(page.getByLabel('Write two to four lines about likes and an optional ability')).toHaveValue('音楽が好きです。');
});
test('320px dark mode does not overflow horizontally',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);
 await page.getByLabel('Write two to four lines about likes and an optional ability').fill('本が好きです。');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});