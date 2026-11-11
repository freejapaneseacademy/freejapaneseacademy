import {test,expect} from '@playwright/test';
const path='/learn/n5/module-05/chapter-01/lesson-01/';
test('keyboard answering, feedback and retry',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:'Where are we going?'})).toBeVisible();
 const groups=page.locator('section[aria-label="Movement context practice"] fieldset');
 await expect(groups).toHaveCount(10);
 for(let i=0;i<10;i++){const first=groups.nth(i).locator('input[type="radio"]').first();await first.focus();await page.keyboard.press('Space');await expect(first).toBeChecked();}
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText(/Written practice: \d+ of 10 correct/)).toBeVisible();
 await expect(groups.first().getByRole('status')).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(groups.first().locator('input:checked')).toHaveCount(0);
});
test('320px dark mode fits viewport',async({page})=>{
 await page.setViewportSize({width:320,height:740});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await expect(page.locator('section[aria-label="Movement context practice"]')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});