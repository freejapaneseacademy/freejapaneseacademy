import {test,expect} from '@playwright/test';
const path='/learn/n5/module-04/chapter-04/checkpoint/';
test('invitation checkpoint is keyboard accessible, scoreable and retryable',async({page})=>{
 await page.goto(path);await expect(page.getByRole('heading',{name:/Invitations and decisions/})).toBeVisible();
 const quiz=page.getByRole('region',{name:'Invitation chapter written checkpoint'});
 await expect(quiz.locator('fieldset').first()).toBeVisible();
 await quiz.locator('input[type="radio"]').first().focus();await page.keyboard.press('ArrowDown');await expect(quiz.locator('input[type="radio"]').nth(1)).toBeChecked();
 for(const field of await quiz.locator('fieldset').all()){const radio=field.locator('input[type="radio"]');if(await radio.count()===3)await radio.first().check();}
 await quiz.getByRole('button',{name:'Submit all answers'}).click();await expect(quiz.getByText(/Written score:/)).toBeVisible();await quiz.getByRole('button',{name:'Retry checkpoint'}).click();await expect(quiz.getByRole('button',{name:'Submit all answers'})).toBeDisabled();
 await quiz.getByLabel('Your two to five connected Japanese sentences').fill('日曜日にカフェに行きませんか。');await quiz.getByRole('button',{name:'Compare with model'}).click();await expect(quiz.getByText(/土曜日にカフェに行きませんか/)).toBeVisible();
});
test('320px viewport in dark mode has no horizontal page overflow',async({page})=>{await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);await expect(page.locator('main')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);});
