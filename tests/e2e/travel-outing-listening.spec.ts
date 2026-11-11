import { test, expect } from '@playwright/test';
const url='/learn/n5/module-05/chapter-04/lesson-06/';
test('n5-m05-c04-l06: accessible audio and keyboard controls',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/Listen to two outing plans/})).toBeVisible();
 await expect(page.locator('audio')).toHaveCount(2);
 await page.getByRole('button',{name:/Reveal transcript/}).first().focus();
 await page.keyboard.press('Enter');
 await expect(page.getByText('Japanese transcript').first()).toBeVisible();
 await page.locator('input[type="radio"]').first().focus();
 await page.keyboard.press('Space');
 await expect(page.locator('input[type="radio"]').first()).toBeChecked();
});
test('n5-m05-c04-l06: 320px dark mode no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.locator('audio')).toHaveCount(2);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
});
