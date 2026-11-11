import { test, expect } from '@playwright/test';
const url='/learn/n5/module-05/chapter-04/lesson-05/';
test('notice quiz supports keyboard, feedback and retry',async({page})=>{
 await page.goto(url);await expect(page.getByRole('heading',{name:/Read a travel notice/i})).toBeVisible();
 const questions=page.locator('fieldset.foundation-question');await expect(questions).toHaveCount(12);
 for(let i=0;i<12;i++){const radio=questions.nth(i).getByRole('radio').first();await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
 await page.getByRole('button',{name:/Check answers and save score/}).click();
 await expect(page.getByRole('status').filter({hasText:/correct/})).toBeVisible();
 await page.getByRole('button',{name:/Retry reading check/}).click();
 await expect(questions.first().getByRole('radio',{checked:true})).toHaveCount(0);
});
test('320px dark mode, evidence and optional model',async({page})=>{
 await page.setViewportSize({width:320,height:740});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 await expect(page.getByRole('heading',{name:/Read a travel notice/i})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
 await page.getByLabel(/Write three Japanese sentences/).fill('午前九時に出発します。');
 await page.getByRole('button',{name:'Compare with model'}).click();
 await expect(page.getByText(/午前八時四十分に青駅の南口で会います/).last()).toBeVisible();
});