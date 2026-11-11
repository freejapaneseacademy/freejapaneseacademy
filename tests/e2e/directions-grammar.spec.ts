import {test,expect} from '@playwright/test';
const path='/learn/n5/module-05/chapter-03/lesson-03/';
test('direction grammar quiz keyboard, feedback, retry and completion',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:'Give Directions: Turn, Go Straight, and Find a Landmark'})).toBeVisible();
 const groups=page.locator('section[aria-label="Direction grammar quiz"] fieldset');
 await expect(groups).toHaveCount(10);
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText('Answer all ten questions before checking.')).toBeVisible();
 for(let i=0;i<10;i++){const radio=groups.nth(i).locator('input[type="radio"]').first();await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText(/Recognition score: \d+ of 10/)).toBeVisible();
 await expect(groups.first().getByRole('status')).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(groups.first().locator('input:checked')).toHaveCount(0);
});
test('320px mobile dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:740});await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await expect(page.locator('section[aria-label="Direction grammar quiz"]')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});