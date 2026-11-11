import { test,expect } from '@playwright/test';
const path='/learn/n5/module-06/chapter-03/lesson-01/';
test('keyboard answers, feedback, draft, and retry',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/May I\? Requests, Permission/})).toBeVisible();
 await page.getByLabel('Three lines: permission, response, request').fill('ここに座ってもいいですか。');
 await page.getByRole('button',{name:'Show model and self-check'}).click();
 await expect(page.getByText(/Check the permission question/)).toBeVisible();
 const groups=page.locator('.foundation-question');await expect(groups).toHaveCount(12);
 for(let i=0;i<12;i++){const q=groups.nth(i);const options=q.getByRole('radio');const correct=i%3===0?1:i%3===1?2:0;await options.nth(correct).focus();await page.keyboard.press('Space');await expect(options.nth(correct)).toBeChecked();}
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText('Recognition score: 12 / 12')).toBeVisible();
 await expect(groups.first().getByText(/Correct/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check answers'})).toBeDisabled();
 await expect(page.getByLabel('Three lines: permission, response, request')).toHaveValue('ここに座ってもいいですか。');
});
test('320px dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);
 await page.getByLabel('Three lines: permission, response, request').fill('名前を書いてください。');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
