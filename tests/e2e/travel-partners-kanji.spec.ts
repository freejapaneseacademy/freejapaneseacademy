import {test,expect} from '@playwright/test';
const path='/learn/n5/module-05/chapter-02/lesson-04/';
test('keyboard answers, evidence feedback, and retry',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:'Travel partners in kanji'})).toBeVisible();
 const groups=page.locator('section[aria-label="Travel kanji recognition practice"] fieldset');
 await expect(groups).toHaveCount(10);
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText('Please answer all ten questions first.')).toBeVisible();
 for(let i=0;i<10;i++){const first=groups.nth(i).locator('input[type="radio"]').first();await first.focus();await page.keyboard.press('Space');await expect(first).toBeChecked();}
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText(/Written recognition: \d+ of 10 correct/)).toBeVisible();
 await expect(groups.first().getByRole('status')).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(groups.first().locator('input:checked')).toHaveCount(0);
});
test('320px mobile layout with dark preference',async({page})=>{
 await page.setViewportSize({width:320,height:740});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await expect(page.locator('section[aria-label="Travel kanji recognition practice"]')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});