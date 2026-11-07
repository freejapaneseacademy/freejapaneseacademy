import { test, expect } from '@playwright/test';
const path='/learn/start/module-03/chapter-03/checkpoint/';
test('chapter 02 checkpoint scores assisted mixed questions',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/Chapter 03 checkpoint/}).first()).toBeVisible();
 await expect(page.locator('[data-question-id]')).toHaveCount(12);
 await expect(page.locator('audio[src^="/audio/fja-l0-m03-c03-l06-"]')).toHaveCount(2);
 await page.getByRole('button',{name:/Reveal Bookstore conversation transcript/}).click();
 for(const field of await page.locator('[data-question-id]').all()) await field.locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:/Check answers and save checkpoint score/}).click();
 await expect(page.getByRole('button',{name:/Try checkpoint again/})).toBeVisible();
});
test('chapter 02 checkpoint has no overflow at 320px and keyboard access',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:/Reveal Bookstore conversation transcript/}).focus();
 await expect(page.getByRole('button',{name:/Reveal Bookstore conversation transcript/})).toBeFocused();
});