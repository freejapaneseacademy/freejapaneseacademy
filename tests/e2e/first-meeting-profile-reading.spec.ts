import { test,expect } from '@playwright/test';
const path='/learn/n5/module-01/chapter-01/lesson-05/';
test('keyboard reading selection, evidence feedback and retry',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/Read first-meeting profile cards/})).toBeVisible();
 const questions=page.locator('[data-question-id]');
 await expect(questions).toHaveCount(10);
 await questions.first().locator('input[type=radio]').first().focus();
 await page.keyboard.press('ArrowDown');
 await expect(questions.first().locator('input[type=radio]:checked')).toHaveCount(1);
 for(let i=0;i<10;i++) await questions.nth(i).locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check 10 answers'}).click();
 await expect(page.getByText(/Written reading score:/)).toBeVisible();
 await expect(page.getByText(/not an official JLPT score/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check 10 answers'})).toBeDisabled();
});
test('320px mobile dark mode avoids horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await expect(page.locator('[data-question-id]')).toHaveCount(10);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});
