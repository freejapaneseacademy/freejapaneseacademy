import { test, expect } from '@playwright/test';
const path='/learn/start/module-04/chapter-01/lesson-06/';
test('katakana listening lesson is usable at 320px without horizontal overflow', async ({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/Listen at a katakana kiosk/i})).toBeVisible();
 await expect(page.locator('audio')).toHaveCount(2);
 await expect(page.locator('fieldset.foundation-question')).toHaveCount(6);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1)).toBe(false);
});
test('transcript reveal is keyboard accessible and marks assisted practice',async ({page})=>{
 await page.goto(path);
 const reveal=page.getByRole('button',{name:/Reveal transcript/i}).first();
 await reveal.focus();
 await page.keyboard.press('Enter');
 await expect(page.getByText(/Assisted practice: you revealed written support/i)).toBeVisible();
 await expect(page.locator('.listening-transcript').first()).toBeVisible();
});
