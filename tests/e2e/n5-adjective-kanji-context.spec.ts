import {test,expect} from '@playwright/test';
const url='/learn/n5/module-04/chapter-03/lesson-04/';
test('keyboard selection, feedback, retries and independent writing',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/Adjectives in kanji/i}).first()).toBeVisible();
 const fields=page.locator('fieldset.foundation-question');
 await expect(fields).toHaveCount(12);
 await fields.first().locator('input[type=radio]').first().focus();
 await page.keyboard.press('ArrowDown');
 await expect(fields.first().locator('input[type=radio]:checked')).toHaveCount(1);
 for(let i=0;i<12;i++)await fields.nth(i).locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check answers and save score'}).click();
 await expect(page.getByRole('button',{name:'Retry kanji check'})).toBeVisible();
 await expect(page.locator('.foundation-feedback')).toHaveCount(12);
 await page.getByRole('button',{name:'Retry kanji check'}).click();
 await expect(page.getByRole('button',{name:'Check answers and save score'})).toBeDisabled();
 await page.getByLabel(/Describe a fictional object/).fill('これは新しいかばんです。');
 await page.getByRole('button',{name:'Compare with model'}).click();
 await expect(page.getByText(/Many other answers are valid/)).toBeVisible();
});
test('320px dark mode no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.locator('main').first()).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});