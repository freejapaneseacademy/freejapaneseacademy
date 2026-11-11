import {test,expect} from '@playwright/test';
const path='/learn/n5/module-05/chapter-03/lesson-06/';
test('two listening tracks and keyboard-accessible assisted feedback',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:'Listen for Directions: Two Street Encounters'})).toBeVisible();
 await expect(page.locator('audio')).toHaveCount(2);
 await page.getByRole('button',{name:'Reveal transcript (assisted practice)'}).first().click();
 await expect(page.getByText(/Assisted practice: you revealed written support/)).toBeVisible();
 const questions=page.locator('fieldset.foundation-question');await expect(questions).toHaveCount(6);
 for(let i=0;i<6;i++){const radio=questions.nth(i).locator('input[type="radio"]').first();await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
 await page.getByRole('button',{name:'Check assisted answers'}).click();
 await expect(page.getByText('Assisted answers reviewed. No unaided listening score was recorded.')).toBeVisible();
 await page.getByRole('button',{name:'Start a new listening attempt'}).click();
 await expect(questions.first().locator('input:checked')).toHaveCount(0);
});
test('320px dark mode listening player fits viewport',async({page})=>{
 await page.setViewportSize({width:320,height:740});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);
 await expect(page.locator('audio')).toHaveCount(2);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
