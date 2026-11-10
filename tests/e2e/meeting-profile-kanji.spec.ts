import { test,expect } from '@playwright/test';
const path='/learn/n5/module-01/chapter-01/lesson-04/';
test('keyboard selection, feedback and retry',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/First-meeting kanji/})).toBeVisible();
 const questions=page.locator('[data-question-id]');
 await expect(questions).toHaveCount(12);
 await questions.first().locator('input[type=radio]').first().focus();
 await page.keyboard.press('ArrowDown');
 await expect(questions.first().locator('input[type=radio]:checked')).toHaveCount(1);
 for(let i=0;i<12;i++) await questions.nth(i).locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check 12 answers'}).click();
 await expect(page.getByText(/Written recognition score:/)).toBeVisible();
 await expect(page.getByText(/not an official JLPT score/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check 12 answers'})).toBeDisabled();
});
test('320px mobile dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await expect(page.locator('[data-question-id]')).toHaveCount(12);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
 expect(overflow).toBe(false);
});
