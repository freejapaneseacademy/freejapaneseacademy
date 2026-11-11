import {test,expect} from '@playwright/test';
const url='/learn/n5/module-05/chapter-03/checkpoint/';
test('keyboard-accessible written scoring, feedback, retry and writing rubric',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/Find the way/i})).toBeVisible();
 const group=page.getByRole('group',{name:/In the route note, where does Mika begin/i});
 await group.getByRole('radio',{name:'At the station'}).focus();
 await page.keyboard.press('Space');
 await expect(group.getByRole('radio',{name:'At the station'})).toBeChecked();
 const groups=page.locator('fieldset').filter({has:page.locator('input[type=radio]')});
 expect(await groups.count()).toBe(12);
 for(let i=1;i<12;i++)await groups.nth(i).locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Submit all answers'}).click();
 await expect(page.getByText(/Written score:/)).toBeVisible();
 await expect(page.getByText(/Evidence:/).first()).toBeVisible();
 await page.getByLabel('Your two to five connected Japanese sentences').fill('駅からまっすぐ行ってください。');
 await page.getByRole('button',{name:'Compare with model'}).click();
 await expect(page.getByText(/郵便局は公園のとなりにあります/).last()).toBeVisible();
 await page.getByRole('button',{name:'Retry checkpoint'}).click();
 await expect(page.getByRole('button',{name:'Submit all answers'})).toBeDisabled();
});
test('320px dark-mode layout does not overflow',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/Find the way/i})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
});