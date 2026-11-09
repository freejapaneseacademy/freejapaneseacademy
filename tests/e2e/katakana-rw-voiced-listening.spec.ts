import { test, expect } from '@playwright/test';
const route='/learn/start/module-04/chapter-03/lesson-06/';
test('bakery and gift listening has two tracks, six items and fits 320px',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(route);
 await expect(page.getByRole('heading',{name:/Hear two original shop conversations/i})).toBeVisible();
 await expect(page.locator('audio')).toHaveCount(2);
 await expect(page.locator('fieldset.foundation-question')).toHaveCount(6);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
});
test('keyboard transcript reveal marks assisted practice',async({page})=>{
 await page.goto(route);
 const reveal=page.getByRole('button',{name:/Reveal transcript/i}).first();
 await expect(reveal).toBeEnabled();
 await reveal.focus();
 await page.keyboard.press('Enter');
 await expect(page.getByText(/Assisted practice: you revealed written support/i)).toBeVisible();
 await expect(page.locator('.listening-transcript').first()).toBeVisible();
});
