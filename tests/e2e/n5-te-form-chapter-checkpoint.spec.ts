import { test, expect } from '@playwright/test';
const route = '/learn/n5/module-06/chapter-02/checkpoint/';
test('keyboard-accessible written checkpoint and retry', async ({ page }) => {
 await page.goto(route);
 await expect(page.getByRole('heading',{name:/て-form in action/i})).toBeVisible();
 const groups = page.locator('fieldset[data-question-id]');
 await expect(groups).toHaveCount(16);
 await page.keyboard.press('Tab');
 for (let i=0;i<16;i++) await groups.nth(i).locator('input[type=radio]').first().check();
 await page.getByRole('button',{name:'Check 16 answers'}).click();
 await expect(page.getByText(/Written recognition score:/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check 16 answers'})).toBeDisabled();
});
test('320px dark mode has no horizontal page overflow',async ({ page }) => {
 await page.setViewportSize({width:320,height:700});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(route);
 await expect(page.locator('fieldset[data-question-id]')).toHaveCount(16);
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});