import { test,expect } from '@playwright/test';
const route='/learn/n5/module-04/chapter-04/lesson-08/';
test('keyboard, written feedback, retry and optional rehearsal',async({page})=>{
 await page.goto(route);
 await page.getByLabel('Your invitation exchange').fill('カフェに行きませんか。');
 await page.getByRole('button',{name:'Compare with model exchange'}).click();
 await expect(page.getByText(/駅のカフェにします。/).first()).toBeVisible();
 const questions=page.locator('fieldset').filter({has:page.getByRole('radio')});
 await questions.first().getByRole('radio').first().focus();
 await page.keyboard.press('Space');
 await expect(questions.first().getByRole('radio').first()).toBeChecked();
 for(let i=1;i<12;i++) await questions.nth(i).getByRole('radio').first().check();
 await page.getByRole('button',{name:'Check written answers'}).click();
 await expect(page.getByText(/Written score: \d+ \/ 12/)).toBeVisible();
 await page.getByRole('button',{name:'Retry written questions'}).click();
 await expect(page.getByRole('button',{name:'Check written answers'})).toBeDisabled();
});
test('320px mobile dark mode has no horizontal overflow and no microphone request',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(route);
 await expect(page.getByText(/No microphone is accessed/).first()).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});
