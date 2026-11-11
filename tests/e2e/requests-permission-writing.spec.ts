import { test, expect } from '@playwright/test';
const url='/learn/n5/module-06/chapter-03/lesson-07/';
test('Japanese writing, keyboard quiz, retry and local save',async({page})=>{
 await page.goto(url);
 const draft=page.getByLabel('Your 2–5 Japanese sentences (self-reviewed, not graded)');
 await expect(draft).toBeVisible();
 await draft.fill('手を洗ってください。水を飲んでもいいです。ここで走ってはいけません。');
 await page.getByRole('button',{name:'Save draft on this device'}).click();
 await expect(page.getByText('Draft saved on this device.')).toBeVisible();
 await page.reload();
 await expect(draft).toHaveValue(/手を洗ってください/);
 await page.getByRole('button',{name:'Compare with model'}).click();
 await expect(page.getByText('One possible model (not the only answer)')).toBeVisible();
 const questions=page.locator('[data-question-id]');
 await expect(questions).toHaveCount(8);
 for(let i=0;i<8;i++){await questions.nth(i).locator('input[type=radio]').first().check();}
 await page.getByRole('button',{name:'Check 8 answers'}).click();
 await expect(page.getByText(/Recognition score: \d\/8/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(questions.first().locator('input[type=radio]').first()).not.toBeChecked();
 await questions.first().locator('input[type=radio]').first().focus();
 await page.keyboard.press('ArrowDown');
 await expect(questions.first().locator('input[type=radio]:checked')).toHaveCount(1);
});
test('320px dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:740});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/Write a classroom notice/})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
});