import { test, expect } from '@playwright/test';

test('yoon listening route is accessible and separates transcript-assisted practice', async ({ page }) => {
 await page.goto('/learn/start/module-03/chapter-02/lesson-06/');
 await expect(page.getByRole('heading',{name:/Listen to contracted sounds/i})).toBeVisible();
 await expect(page.locator('audio')).toHaveCount(2);
 await expect(page.getByRole('button',{name:/Reveal transcript/i})).toHaveCount(2);
 await expect(page.getByText('Check what you heard')).toBeVisible();
 await page.getByRole('button',{name:/Reveal transcript/i}).first().click();
 await expect(page.getByText(/Assisted practice:/)).toBeVisible();
 await expect(page.locator('audio').first()).toHaveAttribute('src',/l0-m03-c02-l06-a-v1\.wav/);
});
test('yoon listening fits a 320px mobile viewport', async ({ page }) => {
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-03/chapter-02/lesson-06/');
 await expect(page.locator('audio')).toHaveCount(2);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
 expect(overflow).toBe(false);
});
