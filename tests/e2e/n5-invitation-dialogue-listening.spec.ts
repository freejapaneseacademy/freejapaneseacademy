import { test, expect } from '@playwright/test';
test('invitation listening has accessible controls and 320px layout', async ({page})=>{
await page.setViewportSize({width:320,height:740});
await page.goto('/learn/n5/module-04/chapter-04/lesson-06/');
await expect(page.getByRole('heading',{name:/Listening to invitations/i})).toBeVisible();
await expect(page.locator('audio')).toHaveCount(2);
await expect(page.locator('fieldset[data-question-id]')).toHaveCount(7);
await page.keyboard.press('Tab');
await expect(page.locator('body')).toBeVisible();
const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
expect(overflow).toBe(false);
await page.emulateMedia({colorScheme:'dark'});
await expect(page.getByRole('button',{name:/Reveal transcript/i}).first()).toBeVisible();
});
