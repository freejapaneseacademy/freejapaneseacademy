import {test,expect} from '@playwright/test';
const path='/learn/n5/module-05/chapter-02/lesson-03/';
test('means and companions grammar works by keyboard, reports score and retries',async({page})=>{
 await page.goto(path);await expect(page.getByRole('heading',{name:/Methods and companions: How and with whom?/})).toBeVisible();
 const quiz=page.getByRole('region',{name:'Means and companions grammar practice'});
 await quiz.locator('input[type="radio"]').first().focus();await page.keyboard.press('ArrowDown');await expect(quiz.locator('input[type="radio"]').nth(1)).toBeChecked();
 for(const field of await quiz.locator('fieldset').all()){const radio=field.locator('input[type="radio"]');if(await radio.count()===3)await radio.first().check();}
 await quiz.getByRole('button',{name:'Submit answers'}).click();await expect(quiz.getByText(/Written score:/)).toBeVisible();
 await quiz.getByRole('button',{name:'Retry practice'}).click();await expect(quiz.getByRole('button',{name:'Submit answers'})).toBeDisabled();
 await quiz.getByLabel('Write three connected Japanese sentences about an outing').fill('公園へ行きます。');await quiz.getByRole('button',{name:'Compare with model'}).click();await expect(quiz.getByText(/土曜日に美術館へ行きます/)).toBeVisible();
});
test('320px dark-mode view does not overflow horizontally',async({page})=>{await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);await expect(page.locator('main')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);});
