import { test, expect } from '@playwright/test';
test('store reading evidence scores and retries at 320px with keyboard',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-04/chapter-03/lesson-05/');
 await expect(page.locator('.page-hero h1')).toContainText('Read katakana shop labels');
 await expect(page.getByRole('heading',{name:'Find the printed evidence'})).toBeVisible();
 const groups=page.locator('fieldset');await expect(groups).toHaveCount(8);
 const submit=page.getByRole('button',{name:'Check all eight answers'});
 await expect(submit).toBeDisabled();
 for(let i=0;i<8;i++){await groups.nth(i).locator('input[type="radio"]').first().focus();await page.keyboard.press('Space');}
 await expect(submit).toBeEnabled();await submit.click();
 await expect(page.getByText(/Written reading score: \d\/8/)).toBeVisible();
 await expect(page.getByText('Printed evidence:',{exact:false}).first()).toBeVisible();
 await page.getByRole('button',{name:'Try the questions again'}).click();
 await expect(submit).toBeDisabled();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
});
