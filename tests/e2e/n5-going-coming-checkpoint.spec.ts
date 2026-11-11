import {test,expect} from '@playwright/test';
const path='/learn/n5/module-05/chapter-01/checkpoint/';
test('movement checkpoint keyboard controls, feedback, retry and writing',async({page})=>{
 await page.goto(path);await expect(page.getByRole('heading',{name:/Going and coming/})).toBeVisible();
 const quiz=page.getByRole('region',{name:'Movement chapter written checkpoint'});
 await quiz.locator('input[type="radio"]').first().focus();await page.keyboard.press('ArrowDown');await expect(quiz.locator('input[type="radio"]').nth(1)).toBeChecked();
 for(const field of await quiz.locator('fieldset').all()){const radio=field.locator('input[type="radio"]');if(await radio.count()===3)await radio.first().check();}
 await quiz.getByRole('button',{name:'Submit all answers'}).click();await expect(quiz.getByText(/Written score:/)).toBeVisible();await quiz.getByRole('button',{name:'Retry checkpoint'}).click();await expect(quiz.getByRole('button',{name:'Submit all answers'})).toBeDisabled();
 await quiz.getByLabel('Your two to five connected Japanese sentences').fill('電車で図書館に行きます。');await quiz.getByRole('button',{name:'Compare with model'}).click();await expect(quiz.getByText(/土曜日に電車で図書館に行きます/)).toBeVisible();
});
test('320px mobile dark mode has no horizontal overflow',async({page})=>{await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);await expect(page.locator('main')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);});
