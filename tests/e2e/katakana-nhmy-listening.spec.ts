import { test, expect } from '@playwright/test';
const route = '/learn/start/module-04/chapter-02/lesson-06/';
test('N/H/M/Y listening has two playable tracks and no overflow at 320px', async ({ page }) => {
 await page.setViewportSize({ width: 320, height: 720 });
 await page.goto(route);
 await expect(page.getByRole('heading', { name: /Hear katakana shelf words/i })).toBeVisible();
 await expect(page.locator('audio')).toHaveCount(2);
 await expect(page.locator('fieldset.foundation-question')).toHaveCount(6);
 expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)).toBe(false);
});
test('keyboard transcript reveal switches to assisted practice', async ({ page }) => {
 await page.goto(route);
 const reveal = page.getByRole('button', { name: /Reveal transcript/i }).first();
 await reveal.focus();
 await page.keyboard.press('Enter');
 await expect(page.getByText(/Assisted practice: you revealed written support/i)).toBeVisible();
 await expect(page.locator('.listening-transcript').first()).toBeVisible();
});
