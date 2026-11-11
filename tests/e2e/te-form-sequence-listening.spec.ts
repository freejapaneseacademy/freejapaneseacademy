import { test, expect } from '@playwright/test';
const url = '/learn/n5/module-06/chapter-02/lesson-06/';

test('te-form listening supports keyboard and transcript-assisted review', async ({page}) => {
 await page.goto(url);
 await expect(page.getByRole('heading', {name:/Hear the sequence/})).toBeVisible();
 await expect(page.locator('audio')).toHaveCount(2);
 await page.getByRole('button', {name:/Reveal transcript/}).first().focus();
 await page.keyboard.press('Enter');
 await expect(page.getByText('Japanese transcript').first()).toBeVisible();
 await page.locator('input[type="radio"]').first().focus();
 await page.keyboard.press('Space');
 await expect(page.locator('input[type="radio"]').first()).toBeChecked();
 await expect(page.getByText(/Assisted practice: you revealed/)).toBeVisible();
});

test('te-form listening fits 320px viewport in dark mode', async ({page}) => {
 await page.setViewportSize({width:320,height:700});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.locator('audio')).toHaveCount(2);
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});
