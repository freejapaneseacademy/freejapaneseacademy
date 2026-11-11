import {test,expect} from '@playwright/test';
const path='/learn/n5/module-05/chapter-03/lesson-05/';
test('reading quiz supports keyboard, evidence feedback, retry and self-review',async({page})=>{
 await page.goto(path);await expect(page.getByRole('heading',{name:/Read a neighborhood route/})).toBeVisible();
 const quiz=page.getByRole('region',{name:'Directions reading practice'});
 await quiz.locator('input[type="radio"]').first().focus();await page.keyboard.press('ArrowDown');await expect(quiz.locator('input[type="radio"]').nth(1)).toBeChecked();
 for(const field of await quiz.locator('fieldset').all()){const radio=field.locator('input[type="radio"]');if(await radio.count()===3)await radio.first().check();}
 await quiz.getByRole('button',{name:'Check my reading'}).click();await expect(quiz.getByText(/Reading score:/)).toBeVisible();await expect(quiz.getByText(/Japanese evidence:/).first()).toBeVisible();
 await quiz.getByRole('button',{name:'Retry reading'}).click();await expect(quiz.getByRole('button',{name:'Check my reading'})).toBeDisabled();
 await quiz.getByLabel('Write two or three Japanese sentences giving the route').fill('駅からまっすぐ行ってください。');await quiz.getByRole('button',{name:'Compare with model'}).click();await expect(quiz.getByText(/信号で右に曲がってください/).last()).toBeVisible();
});
test('320px dark-mode page does not overflow',async({page})=>{await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);await expect(page.locator('main')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);});