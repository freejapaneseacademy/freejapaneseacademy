import { test, expect } from '@playwright/test';
const url='/learn/start/module-04/chapter-04/lesson-06/';
test('listening lesson has two keyboard accessible audio controls and transcript assistance', async ({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/Listen to two station announcements/i})).toBeVisible();
 await expect(page.locator('audio[controls]')).toHaveCount(2);
 await expect(page.getByRole('button',{name:/Reveal transcript/})).toHaveCount(2);
 await page.getByRole('button',{name:/Reveal transcript/}).first().focus();
 await page.keyboard.press('Enter');
 await expect(page.getByText(/Assisted practice: you revealed written support/)).toBeVisible();
 await expect(page.getByRole('button',{name:/Check assisted answers/})).toBeDisabled();
});
test('320px mobile layout has no horizontal overflow',async ({page})=>{
 await page.setViewportSize({width:320,height:740});
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/Listen to two station announcements/i})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
});
