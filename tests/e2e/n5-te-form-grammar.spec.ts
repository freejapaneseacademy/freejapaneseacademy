import {test,expect} from '@playwright/test';
test.describe('n5-m06-c02-l03 grammar',()=>{
 test('keyboard selection, feedback and retry',async({page})=>{
 await page.goto('/learn/n5/module-06/chapter-02/lesson-03/');
 await expect(page.getByRole('heading',{name:/Link actions naturally/i})).toBeVisible();
 const questions=page.locator('[data-question-id]');await expect(questions).toHaveCount(12);
 for(let i=0;i<12;i++){const first=questions.nth(i).getByRole('radio').first();await first.focus();await page.keyboard.press('Space');await expect(first).toBeChecked();}
 await page.getByRole('button',{name:'Check 12 answers'}).click();
 await expect(page.getByText(/Written recognition score: [0-9]+\/12/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check 12 answers'})).toBeDisabled();
 });
 test('320px dark mode without horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});
 await page.goto('/learn/n5/module-06/chapter-02/lesson-03/');
 await expect(page.getByRole('heading',{name:/Link actions naturally/i})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
 });
});