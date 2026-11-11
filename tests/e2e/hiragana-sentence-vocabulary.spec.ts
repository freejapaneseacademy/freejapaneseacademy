import { test, expect } from '@playwright/test';
test('sentence vocabulary lesson renders, scores and retries on mobile', async ({ page }) => {
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-03/chapter-04/lesson-02/');
 await expect(page.locator('.page-hero h1')).toContainText('Library words in short hiragana sentences');
 await expect(page.getByRole('heading',{name:'Recall the library words'})).toBeVisible();
 const groups=page.locator('fieldset');
 await expect(groups).toHaveCount(8);
 await expect(page.getByRole('button',{name:'Check all eight answers'})).toBeDisabled();
 for(let i=0;i<8;i++)await groups.nth(i).locator('input[type="radio"]').first().check();
 await page.getByRole('button',{name:'Check all eight answers'}).click();
 await expect(page.getByText(/Written score: \d\/8/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Try the questions again'})).toBeVisible();
 await page.getByRole('button',{name:'Try the questions again'}).click();
 await expect(page.getByRole('button',{name:'Check all eight answers'})).toBeDisabled();
});