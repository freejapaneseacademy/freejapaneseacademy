import { test, expect } from '@playwright/test';
const path='/learn/n5/module-01/chapter-04/lesson-02/';
test('keyboard selection, feedback and retry',async({page})=>{
 await page.goto(path);
 const questions=page.locator('[data-question-id]');
 await expect(questions).toHaveCount(10);
 await expect(page.getByRole('button',{name:'Check 10 answers'})).toBeDisabled();
 for(let i=0;i<10;i++) {
   const q=questions.nth(i);
   const answer=await q.getAttribute('data-question-id');
   expect(answer).toBeTruthy();
   await q.getByRole('radio').first().focus();
   await page.keyboard.press('Space');
 }
 await page.getByRole('button',{name:'Check 10 answers'}).focus();
 await page.keyboard.press('Enter');
 await expect(page.getByText('Recognition score:',{exact:false})).toBeVisible();
 await expect(questions.first().getByRole('status')).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check 10 answers'})).toBeDisabled();
});
test('320px dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await expect(page.getByRole('heading', { level: 1, name: /Personal profiles/i }).first()).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
 expect(overflow).toBe(false);
});
