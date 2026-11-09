import { test, expect } from '@playwright/test';
const path='/learn/n5/module-01/chapter-03/lesson-02/';
test('keyboard selection, feedback and retry',async({page})=>{
 await page.goto(path);
 const questions=page.locator('[data-question-id]');
 await expect(questions).toHaveCount(10);
 await expect(page.getByRole('button',{name:'Check 10 answers'})).toBeDisabled();
 for(let i=0;i<10;i++) await questions.nth(i).getByRole('radio').first().check();
 await page.getByRole('button',{name:'Check 10 answers'}).focus();
 await page.keyboard.press('Enter');
 await expect(page.getByText('Recognition score: 10/10.',{exact:false})).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check 10 answers'})).toBeDisabled();
});
test('320px dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await expect(page.locator('.page-hero h1')).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
 expect(overflow).toBe(false);
});
