import { test, expect } from '@playwright/test';
const path='/learn/n5/module-06/chapter-04/lesson-06/';
test('keyboard and assisted listening do not falsely save blind score',async ({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/What is happening now/i}).first()).toBeVisible();
 await page.getByRole('button',{name:/Reveal transcript/i}).first().focus();
 await page.keyboard.press('Enter');
 await expect(page.getByText(/Assisted practice: you revealed/i)).toBeVisible();
 for(const fieldset of await page.locator('fieldset[data-question-id]').all()) await fieldset.locator('input[type="radio"]').first().check();
 await page.getByRole('button',{name:/Check assisted answers/i}).click();
 await expect(page.getByText(/No unaided listening score was recorded/i)).toBeVisible();
});
test('320px dark mode does not overflow',async ({page})=>{
 await page.setViewportSize({width:320,height:740});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await expect(page.locator('audio')).toHaveCount(2);
});
