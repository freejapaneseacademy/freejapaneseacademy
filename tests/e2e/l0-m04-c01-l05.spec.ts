import {test,expect} from '@playwright/test';
test('katakana evidence reading is keyboard usable at 320px',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-04/chapter-01/lesson-05/');
 await expect(page.locator('.page-hero h1')).toContainText('Read a katakana kiosk card');
 await expect(page.getByRole('heading',{name:'Find the printed evidence'})).toBeVisible();
 const groups=page.locator('fieldset');await expect(groups).toHaveCount(8);
 const submit=page.getByRole('button',{name:'Check eight reading answers'});await expect(submit).toBeDisabled();
 await groups.first().locator('input[type="radio"]').first().focus();await page.keyboard.press('Space');
 await expect(groups.first().locator('input[type="radio"]').first()).toBeChecked();
 for(let i=1;i<8;i++)await groups.nth(i).locator('input[type="radio"]').first().check();
 await submit.click();await expect(page.getByText(/Reading score: \d\/8/)).toBeVisible();
 await expect(groups.first().getByText(/The drink list explicitly prints/)).toBeVisible();
 await page.getByRole('button',{name:'Try the reading again'}).click();await expect(submit).toBeDisabled();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
});
