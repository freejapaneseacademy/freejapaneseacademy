import { test, expect } from '@playwright/test';
const path='/learn/n5/module-06/chapter-03/lesson-02/';
test('keyboard choice, feedback, score and retry',async ({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/Requests and rules:/}).first()).toBeVisible();
 const questions=page.locator('[data-question-id]');
 await expect(questions).toHaveCount(12);
 await questions.first().locator('input[type="radio"]').first().focus();
 await page.keyboard.press('Space');
 await expect(questions.first().locator('input[type="radio"]').first()).toBeChecked();
 for(let i=1;i<12;i++) await questions.nth(i).locator('input[type="radio"]').first().check();
 await page.getByRole('button',{name:'Check 12 answers'}).click();
 await expect(page.getByText(/Written vocabulary score:/)).toBeVisible();
 await expect(questions.first().getByRole('status')).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check 12 answers'})).toBeDisabled();
});
test('320px dark mode has no horizontal overflow',async ({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await expect(page.locator('main').first()).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});