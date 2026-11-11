import { test, expect } from '@playwright/test';
const url='/learn/n5/module-02/chapter-02/lesson-02/';
test('keyboard selection, feedback, persisted submission and retry',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'School places: finding rooms and facilities'})).toBeVisible();
 const questions=page.locator('.foundation-question');
 await expect(questions).toHaveCount(10);
 for(let i=0;i<10;i++){const first=questions.nth(i).getByRole('radio').first();await first.focus();await page.keyboard.press('Space');await expect(first).toBeChecked();}
 await page.getByRole('button',{name:'Check answers and save score'}).click();
 await expect(page.locator('.foundation-feedback')).toHaveCount(10);
 await expect(page.getByRole('button',{name:'Retry vocabulary check'})).toBeVisible();
 await page.getByRole('button',{name:'Retry vocabulary check'}).click();
 await expect(page.locator('.foundation-feedback')).toHaveCount(0);
});
test('320px dark mode and optional self-reviewed writing',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'Find the right facility'})).toBeVisible();
 await page.getByLabel('Ask where the cafeteria is and answer from a distant viewpoint.').fill('食堂は どこですか。');
 await page.getByRole('button',{name:'Compare with model'}).click();
 await expect(page.getByText(/食堂は あそこです/).last()).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});