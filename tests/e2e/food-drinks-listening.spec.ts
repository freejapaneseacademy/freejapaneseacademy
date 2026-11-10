import {test,expect} from '@playwright/test';
const path='/learn/n5/module-04/chapter-01/lesson-06/';
test('blind listening controls and keyboard-accessible answers',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/At the Café/i}).first()).toBeVisible();
 await expect(page.locator('audio')).toHaveCount(2);
 const questions=page.locator('fieldset[data-question-id]');
 await expect(questions).toHaveCount(6);
 await questions.first().locator('input[type=radio]').first().focus();
 await page.keyboard.press('Space');
 await expect(questions.first().locator('input[type=radio]').first()).toBeChecked();
 await expect(page.getByRole('button',{name:/Check answers & save blind score/i})).toBeDisabled();
 await page.getByRole('button',{name:/Reveal transcript/i}).first().click();
 await expect(page.getByText(/Assisted practice:/i)).toBeVisible();
});
test('320px dark mode has no horizontal page overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await expect(page.locator('audio')).toHaveCount(2);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
