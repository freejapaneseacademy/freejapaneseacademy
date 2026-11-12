import { test, expect } from '@playwright/test';
const url='/learn/n5/module-02/chapter-03/lesson-02/';
test('keyboard quiz, saved score, feedback and retry',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'People, things and places: words for what is there'})).toBeVisible();
 const questions=page.locator('.foundation-question');
 await expect(questions).toHaveCount(12);
 for(let i=0;i<12;i++){const first=questions.nth(i).getByRole('radio').first();await first.focus();await page.keyboard.press('Space');await expect(first).toBeChecked();}
 await page.getByRole('button',{name:'Check answers and save score'}).click();
 await expect(page.locator('.foundation-feedback')).toHaveCount(12);
 await expect(page.getByRole('button',{name:'Retry vocabulary check'})).toBeVisible();
 await page.getByRole('button',{name:'Retry vocabulary check'}).click();
 await expect(page.locator('.foundation-feedback')).toHaveCount(0);
});
test('320px mobile dark mode and self-reviewed writing',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'Who or what is there?'})).toBeVisible();
 await page.getByLabel('Write two sentences about a fictional room, with one living being and one object.').fill('部屋に 猫が います。本も あります。');
 await page.getByRole('button',{name:'Compare with model'}).click();
 await expect(page.getByText(/Alternative natural sentences are welcome/)).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});