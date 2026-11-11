import { test, expect } from '@playwright/test';
test('sentence script lesson renders, scores, retries and fits 320px', async ({ page }) => {
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-03/chapter-04/lesson-04/');
 await expect(page.locator('.page-hero h1')).toContainText('Recognize and type hiragana');
 await expect(page.getByRole('heading',{name:'Check the written kana'})).toBeVisible();
 const groups=page.locator('fieldset');
 await expect(groups).toHaveCount(8);
 await expect(page.getByRole('button',{name:'Check all eight answers'})).toBeDisabled();
 for(let i=0;i<8;i++)await groups.nth(i).locator('input[type="radio"]').first().check();
 await page.getByRole('button',{name:'Check all eight answers'}).click();
 await expect(page.getByText(/Written score: \d\/8/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Try the questions again'})).toBeVisible();
 await page.getByRole('button',{name:'Try the questions again'}).click();
 await expect(page.getByRole('button',{name:'Check all eight answers'})).toBeDisabled();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
 expect(overflow).toBe(false);
});
