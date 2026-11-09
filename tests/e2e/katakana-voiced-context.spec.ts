import { test, expect } from '@playwright/test';
test('voiced katakana context scores and retries on 320px mobile with keyboard',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-04/chapter-03/lesson-01/');
 await expect(page.locator('.page-hero h1')).toContainText('Katakana shop signs');
 await expect(page.getByRole('heading',{name:'Read the shop labels'})).toBeVisible();
 const groups=page.locator('fieldset');await expect(groups).toHaveCount(8);
 const submit=page.getByRole('button',{name:'Check all eight answers'});
 await expect(submit).toBeDisabled();
 for(let i=0;i<8;i++){await groups.nth(i).locator('input[type="radio"]').first().focus();await page.keyboard.press('Space');}
 await expect(submit).toBeEnabled();await submit.click();
 await expect(page.getByText(/Written score: \d\/8/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Try the questions again'})).toBeVisible();
 await page.getByRole('button',{name:'Try the questions again'}).click();
 await expect(submit).toBeDisabled();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);expect(overflow).toBe(false);
});