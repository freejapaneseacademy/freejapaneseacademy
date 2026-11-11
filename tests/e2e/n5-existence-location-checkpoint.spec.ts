import {test,expect} from '@playwright/test';
const url='/learn/n5/module-02/chapter-03/checkpoint/';
test('keyboard selection, written scoring and retry without audio',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/existence and location.*checkpoint/i}).first()).toBeVisible();
 const questions=page.locator('fieldset');
 await expect(questions).toHaveCount(10);
 await expect(page.getByText(/Listening scoring locked/)).toBeVisible();
 for(let i=0;i<10;i++){await questions.nth(i).locator('input[type=radio]').first().focus();await page.keyboard.press('Space');}
 await page.getByRole('button',{name:'Check 10 answers'}).click();
 await expect(page.getByText(/Practice score:/)).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(questions).toHaveCount(10);
});
test('320px dark mode and keyboard transcript toggle',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/existence and location.*checkpoint/i}).first()).toBeVisible();
 const transcript=page.getByRole('button',{name:'Show transcript (assisted)'}).first();
 await transcript.focus();await page.keyboard.press('Enter');
 await expect(page.getByRole('button',{name:'Hide transcript (assisted)'}).first()).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});
