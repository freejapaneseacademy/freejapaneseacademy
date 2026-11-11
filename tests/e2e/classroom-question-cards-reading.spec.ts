import { test,expect } from '@playwright/test';
const url='/learn/n5/module-01/chapter-02/lesson-05/';
test('keyboard-accessible reading quiz, feedback and retry',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'Find the exact evidence'})).toBeVisible();
 const questions=page.locator('[data-question-id]');
 await expect(questions).toHaveCount(10);
 for(let i=0;i<10;i++){const radio=questions.nth(i).getByRole('radio').first();await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
 await page.getByRole('button',{name:'Check answers and save attempt'}).click();
 await expect(page.getByRole('heading',{name:'10 / 10 correct'})).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(page.getByText('0 of 10 answered')).toBeVisible();
});
test('320px viewport, dark mode and self-review toggle',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 await expect(page.getByRole('heading',{name:'Find the exact evidence'})).toBeVisible();
 await page.getByRole('button',{name:'Compare with model'}).click();
 await expect(page.getByText('きょうしつにいます。',{exact:false}).last()).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2)).toBe(true);
});
