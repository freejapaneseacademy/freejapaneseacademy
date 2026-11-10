import { test, expect } from '@playwright/test';
const url='/learn/n5/module-03/chapter-02/lesson-01/';
test('keyboard accessible quiz and retry',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/A Usual Day/})).toBeVisible();
 const questions=page.locator('[data-question-id]');
 await expect(questions).toHaveCount(10);
 await questions.first().locator('input[type=radio]').first().focus();
 await page.keyboard.press('Space');
 await expect(questions.first().locator('input[type=radio]').first()).toBeChecked();
 for(let i=1;i<10;i++) await questions.nth(i).locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check all 10 answers'}).click();
 await expect(page.getByText(/Written context score:/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check all 10 answers'})).toBeDisabled();
});
test('320px dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:740});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.locator('[data-question-id]').first()).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
 expect(overflow).toBe(false);
});