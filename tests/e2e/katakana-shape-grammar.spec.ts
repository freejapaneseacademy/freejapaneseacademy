import { test, expect } from '@playwright/test';
test('katakana shape lesson renders, supports keyboard and scores at 320px', async ({ page }) => {
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-04/chapter-01/lesson-03/');
 await expect(page.locator('.page-hero h1')).toContainText('Katakana shape clues');
 await expect(page.getByRole('heading',{name:'Check the katakana shape clues'})).toBeVisible();
 const groups=page.locator('fieldset');
 await expect(groups).toHaveCount(8);
 await expect(page.getByRole('button',{name:'Check all eight answers'})).toBeDisabled();
 await groups.first().locator('input[type="radio"]').first().focus();
 await page.keyboard.press('Space');
 for(let i=1;i<8;i++)await groups.nth(i).locator('input[type="radio"]').first().check();
 await page.getByRole('button',{name:'Check all eight answers'}).click();
 await expect(page.getByText(/Written score: \d\/8/)).toBeVisible();
 await page.getByRole('button',{name:'Try the questions again'}).click();
 await expect(page.getByRole('button',{name:'Check all eight answers'})).toBeDisabled();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
 expect(overflow).toBe(false);
});