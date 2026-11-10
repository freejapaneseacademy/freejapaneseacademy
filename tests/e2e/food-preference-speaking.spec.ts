import { test, expect } from '@playwright/test';
const path='/learn/n5/module-04/chapter-01/lesson-08/';
test('optional rehearsal is accessible by keyboard and can retry',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/Optional Food-Preference Conversation/i})).toBeVisible();
 await expect(page.getByText(/No recording, microphone permission/i)).toBeVisible();
 const questions=page.locator('fieldset[data-question-id]');
 await expect(questions).toHaveCount(8);
 await page.keyboard.press('Tab');
 await page.locator('fieldset[data-question-id]').first().getByRole('radio').first().focus();
 await page.keyboard.press('Space');
 await expect(page.locator('fieldset[data-question-id]').first().getByRole('radio').first()).toBeChecked();
 for(const question of await questions.all()) await question.getByRole('radio').first().check();
 await page.getByRole('button',{name:/Check all 8 answers/i}).click();
 await expect(page.getByText(/Written meaning score:/i)).toBeVisible();
 await page.getByRole('button',{name:/Retry questions/i}).click();
 await expect(page.getByRole('button',{name:/Check all 8 answers/i})).toBeDisabled();
});
test('320px mobile dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:740});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await expect(page.locator('main')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
