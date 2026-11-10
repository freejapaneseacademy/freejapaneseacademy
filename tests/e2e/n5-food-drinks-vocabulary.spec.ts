import {test,expect} from '@playwright/test';
const url='/learn/n5/module-04/chapter-01/lesson-02/';
test('keyboard choices, feedback and retry',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/At the café/i})).toBeVisible();
 const questions=page.locator('fieldset.foundation-question');
 await expect(questions).toHaveCount(12);
 await questions.first().locator('input[type=radio]').first().focus();
 await page.keyboard.press('ArrowDown');
 await expect(questions.first().locator('input[type=radio]:checked')).toHaveCount(1);
 for(let i=0;i<12;i++)await questions.nth(i).locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check answers and save score'}).click();
 await expect(page.getByRole('button',{name:'Retry food vocabulary'})).toBeVisible();
 await expect(page.locator('.foundation-feedback')).toHaveCount(12);
 await page.getByRole('button',{name:'Retry food vocabulary'}).click();
 await expect(page.getByRole('button',{name:'Check answers and save score'})).toBeDisabled();
});
test('320px dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.locator('main').first()).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await expect(page.getByLabel(/Write two sentences/)).toBeVisible();
});
