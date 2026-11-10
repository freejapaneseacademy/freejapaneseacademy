import { test, expect } from '@playwright/test';
const url='/learn/n5/module-03/chapter-04/lesson-04/';
test('keyboard selection, submission and retry',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/Kanji in a Habit Journal/})).toBeVisible();
 const groups=page.locator('fieldset[data-question-id]');
 await expect(groups).toHaveCount(10);
 for(let i=0;i<10;i++) await groups.nth(i).getByRole('radio').first().check();
 await page.getByRole('button',{name:/Check all 10 answers/}).click();
 await expect(page.getByText(/Written kanji score:/)).toBeVisible();
 await page.getByRole('button',{name:/Retry questions/}).click();
 await expect(page.getByRole('button',{name:/Check all 10 answers/})).toBeDisabled();
 await groups.first().getByRole('radio').first().focus();
 await page.keyboard.press('ArrowDown');
 await expect(groups.first().getByRole('radio').nth(1)).toBeChecked();
});
test('320px dark mode without horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.locator('fieldset[data-question-id]').first()).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});