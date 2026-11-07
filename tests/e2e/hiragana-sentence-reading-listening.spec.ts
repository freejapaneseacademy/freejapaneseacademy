import { test, expect } from '@playwright/test';
const path = '/learn/start/module-03/chapter-04/lesson-06/';
test('listening lesson renders via shared layout and remains usable at 320px', async ({ page }) => {
 await page.setViewportSize({ width: 320, height: 720 });
 await page.goto(path);
 await expect(page.getByRole('heading', { name: /Listen to two slow hiragana library conversations/i })).toBeVisible();
 await expect(page.locator('audio').first()).toBeVisible();
 const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
 expect(overflow).toBe(false);
});
test('listening lesson has keyboard-operable player and six questions', async ({ page }) => {
 await page.goto(path);
 await expect(page.locator('audio')).toHaveCount(2);
 const questions = page.locator('fieldset.foundation-question');
 await expect(questions).toHaveCount(6);
 await expect(questions.first().locator('legend')).toContainText('What kind of book is the visitor looking for?');
 await expect(questions.nth(4).locator('legend')).toContainText('What does the clerk ask the visitor to write?');
 await page.keyboard.press('Tab');
 expect(await page.evaluate(() => document.activeElement?.tagName)).not.toBe('BODY');
});
