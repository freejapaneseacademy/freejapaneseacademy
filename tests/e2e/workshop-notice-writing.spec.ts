import { test, expect } from '@playwright/test';
const url='/learn/n5/module-03/chapter-01/lesson-07/';
test('keyboard answers, feedback and retry',async({page})=>{
 await page.goto(url);await expect(page.getByRole('heading',{name:/Write a Workshop Notice/})).toBeVisible();
 const fields=page.locator('.foundation-question');await expect(fields).toHaveCount(8);
 for(let i=0;i<8;i++){const first=fields.nth(i).getByRole('radio').first();await first.focus();await page.keyboard.press('Space');await expect(first).toBeChecked();}
 await page.getByRole('button',{name:'Check answers and save score'}).click();
 await expect(page.locator('.foundation-question .foundation-feedback')).toHaveCount(8);
 await page.getByRole('button',{name:'Retry recognition check'}).click();
 await expect(page.locator('.foundation-question .foundation-feedback')).toHaveCount(0);
});
test('320px dark mode and saved draft',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 const input=page.getByLabel('Your Japanese notice (date, weekday, start time, quantity)');
 await input.fill('工作クラスは12月7日、月曜日です。午後1時からです。紙は2枚です。');
 await page.getByRole('button',{name:'Save draft locally'}).click();await input.fill('');
 await page.getByRole('button',{name:'Load saved draft'}).click();await expect(input).toHaveValue(/工作クラス/);
 await page.getByRole('button',{name:'Compare with model'}).click();await expect(page.getByText(/Check: date and weekday/)).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});
