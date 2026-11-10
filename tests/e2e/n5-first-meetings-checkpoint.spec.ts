import { test, expect } from '@playwright/test';
test('checkpoint is keyboard accessible and works at 320px',async({page})=>{
 await page.setViewportSize({width:320,height:740});
 await page.goto('/learn/n5/module-01/chapter-01/checkpoint/');
 await expect(page.getByRole('heading',{name:/first meetings/i}).first()).toBeVisible();
 await expect(page.getByRole('button',{name:'Check 10 answers'})).toBeDisabled();
 const fields=page.locator('fieldset');
 await expect(fields).toHaveCount(10);
 for(let i=0;i<10;i++){await fields.nth(i).getByRole('radio').first().focus();await page.keyboard.press('Space');}
 await expect(page.getByRole('button',{name:'Check 10 answers'})).toBeEnabled();
 await page.getByRole('button',{name:'Check 10 answers'}).click();
 await expect(page.getByText(/10 correct|correct/i).first()).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(page.getByRole('button',{name:'Check 10 answers'})).toBeDisabled();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
 expect(overflow).toBe(false);
});