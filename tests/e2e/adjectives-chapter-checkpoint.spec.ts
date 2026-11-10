import {test,expect} from '@playwright/test';
const url='/learn/n5/module-04/chapter-03/checkpoint/';
test('adjective checkpoint keyboard, feedback, retry and writing',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/Adjectives for descriptions — chapter checkpoint/i})).toBeVisible();
 const groups=page.locator('fieldset');await expect(groups).toHaveCount(12);
 for(let i=0;i<12;i++){await groups.nth(i).getByRole('radio').first().focus();await page.keyboard.press('Space');}
 await page.getByRole('button',{name:'Submit all answers'}).click();
 await expect(page.getByText(/Written score:/)).toBeVisible();
 await expect(page.getByText(/Answer:/).first()).toBeVisible();
 await page.getByRole('button',{name:'Retry checkpoint'}).click();
 await expect(page.getByRole('button',{name:'Submit all answers'})).toBeDisabled();
 await page.getByLabel('Your two to five Japanese sentences').fill('この店は静かです。');
 await page.getByRole('button',{name:'Compare with model'}).click();
 await expect(page.getByText(/ケーキはおいしいです/)).toBeVisible();
});
test('adjective checkpoint fits 320px dark mode',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 await expect(page.getByRole('heading',{name:/Adjectives for descriptions — chapter checkpoint/i})).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
