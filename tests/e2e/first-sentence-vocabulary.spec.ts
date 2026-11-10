import { test, expect } from '@playwright/test';
const route='/learn/start/module-05/chapter-03/lesson-02/';
test('keyboard answers, feedback and retry',async({page})=>{
 await page.goto(route);
 const questions=page.locator('[data-question-id]');
 await expect(questions).toHaveCount(10);
 // SSR inputs stay disabled until React handlers are attached.
 await expect(questions.first()).toBeEnabled();
 for(let i=0;i<10;i++){await questions.nth(i).locator('input[type=radio]').first().focus();await page.keyboard.press('Space');}
 await page.getByRole('button',{name:'Check ten answers'}).click();
 await expect(page.getByText(/Written recognition score:/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Retry questions'})).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check ten answers'})).toBeDisabled();
});
test('320px viewport and dark mode have no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(route);
 await expect(page.getByRole('heading',{name:/People and objects/}).first()).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
 expect(overflow).toBe(false);
});