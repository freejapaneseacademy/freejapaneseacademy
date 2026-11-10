import {test,expect} from '@playwright/test';
const route='/learn/start/module-05/chapter-01/lesson-02/';
test('320px keyboard answer submission and retry',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.goto(route);
 await expect(page.getByRole('heading',{name:/Greetings and classroom Japanese/})).toBeVisible();
 const questions=page.locator('fieldset[data-question-id^="ex-l0-m05-c01-l02-"]');await expect(questions).toHaveCount(10);
 for(let i=0;i<10;i++){const radio=questions.nth(i).locator('input[type="radio"]').first();await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked()}
 await page.getByRole('button',{name:'Check all ten answers'}).click();
 await expect(page.getByText(/Written score: \d+\/10/)).toBeVisible();
 await expect(questions.first().getByRole('status')).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(page.getByRole('button',{name:'Check all ten answers'})).toBeDisabled();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
});
test('dark mode keyboard inputs remain visible',async({page})=>{await page.emulateMedia({colorScheme:'dark'});await page.goto(route);await expect(page.locator('fieldset input[type="radio"]').first()).toBeVisible()});