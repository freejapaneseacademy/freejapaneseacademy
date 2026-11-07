import { test, expect } from '@playwright/test';
test('small tsu listening has two players and assisted transcript controls', async ({ page }) => {
 await page.goto('/learn/start/module-03/chapter-03/lesson-06/');
 await expect(page.getByRole('heading',{name:/Listen for small/i})).toBeVisible();
 await expect(page.locator('audio')).toHaveCount(2);
 await expect(page.getByRole('button',{name:/Reveal transcript/i})).toHaveCount(2);
 await page.getByRole('button',{name:/Reveal transcript/i}).first().click();
 await expect(page.getByText(/Assisted practice:/)).toBeVisible();
 await expect(page.locator('audio').first()).toHaveAttribute('src',/l0-m03-c03-l06-a-v1\.wav/);
});
test('small tsu listening fits mobile width',async ({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-03/chapter-03/lesson-06/');
 await expect(page.locator('audio')).toHaveCount(2);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2)).toBe(false);
});
