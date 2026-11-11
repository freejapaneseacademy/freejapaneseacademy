import { test,expect } from '@playwright/test';
const path='/learn/n5/module-06/chapter-03/lesson-03/';
test('keyboard choices, feedback, model, and retry',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/Requests, Permission and Prohibitions/})).toBeVisible();
 await page.getByLabel('Permission question, answer and request').fill('辞書を使ってもいいですか。');
 await page.getByRole('button',{name:'Show model and self-check'}).click();
 await expect(page.getByText(/Check 使ってもいいですか/)).toBeVisible();
 const groups=page.locator('.foundation-question');await expect(groups).toHaveCount(12);
 const correct=[0,1,2,0,1,2,0,1,2,0,1,2];
 for(let i=0;i<12;i++){const options=groups.nth(i).getByRole('radio');await options.nth(correct[i]).focus();await page.keyboard.press('Space');await expect(options.nth(correct[i])).toBeChecked();}
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText('Recognition score: 12 / 12')).toBeVisible();
 await expect(groups.first().getByText(/Correct/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check answers'})).toBeDisabled();
 await expect(page.getByLabel('Permission question, answer and request')).toHaveValue('辞書を使ってもいいですか。');
 await page.getByRole('button',{name:'Clear writing'}).click();
 await expect(page.getByLabel('Permission question, answer and request')).toHaveValue('');
});
test('320px dark mode without horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);
 await page.getByLabel('Permission question, answer and request').fill('名前を書いてください。');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
