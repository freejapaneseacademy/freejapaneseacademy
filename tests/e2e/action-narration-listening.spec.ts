import { test, expect } from '@playwright/test';
const url='/learn/n5/module-06/chapter-01/lesson-06/';
test('n5-m06-c01-l06 keyboard and assisted-mode accessibility',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/Hear the actions/})).toBeVisible();
 await expect(page.locator('audio')).toHaveCount(2);
 await page.getByRole('button',{name:/Reveal transcript/}).first().focus();
 await page.keyboard.press('Enter');
 await expect(page.getByText('Japanese transcript').first()).toBeVisible();
 await page.locator('input[type="radio"]').first().focus();
 await page.keyboard.press('Space');
 await expect(page.locator('input[type="radio"]').first()).toBeChecked();
 await expect(page.getByText(/Assisted practice: you revealed/)).toBeVisible();
});
test('n5-m06-c01-l06 320px dark-mode responsive audio',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.locator('audio')).toHaveCount(2);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
});
