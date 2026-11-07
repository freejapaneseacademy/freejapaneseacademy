import { test, expect } from '@playwright/test';
test('katakana kiosk vocabulary supports keyboard and 320px mobile',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-04/chapter-01/lesson-02/');
 await expect(page.locator('.page-hero h1')).toContainText('Katakana kiosk vocabulary');
 await expect(page.getByRole('heading',{name:'Practice the kiosk vocabulary'})).toBeVisible();
 const groups=page.locator('fieldset');await expect(groups).toHaveCount(8);
 await expect(page.getByRole('button',{name:'Check all eight answers'})).toBeDisabled();
 await groups.first().locator('input[type="radio"]').first().focus();await page.keyboard.press('Space');
 await expect(groups.first().locator('input[type="radio"]').first()).toBeChecked();
 for(let i=1;i<8;i++)await groups.nth(i).locator('input[type="radio"]').first().check();
 await page.getByRole('button',{name:'Check all eight answers'}).click();
 await expect(page.getByText(/Written score: \d\/8/)).toBeVisible();
 await page.getByRole('button',{name:'Try the questions again'}).click();
 await expect(page.getByRole('button',{name:'Check all eight answers'})).toBeDisabled();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
});