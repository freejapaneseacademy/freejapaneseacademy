import { test, expect } from '@playwright/test';
test('hiragana form lesson is usable with keyboard, retry and mobile viewport',async({page})=>{
 await page.setViewportSize({width:320,height:740});
 await page.goto('/learn/start/module-02/chapter-01/lesson-04/');
 await expect(page.getByRole('heading',{name:'Hiragana form lab'})).toBeVisible();
 await expect(page.locator('fieldset')).toHaveCount(20);
 const fields=page.locator('fieldset');
 const kana=['あ','い','う','え','お','か','き','く','け','こ','さ','し','す','せ','そ'];
 for(let i=0;i<15;i++)await fields.nth(i).getByRole('textbox').fill(kana[i]);
 const keys=[1,1,1,0,1];
 for(let i=0;i<5;i++)await fields.nth(i+15).getByRole('radio').nth(keys[i]).check();
 await page.getByRole('button',{name:'Check all 20 answers'}).click();
 await expect(page.getByText('Written score: 20/20.')).toBeVisible();
 await page.getByRole('button',{name:'Retry all questions'}).click();
 await expect(page.getByRole('button',{name:'Check all 20 answers'})).toBeDisabled();
 await expect(page.locator('body')).not.toHaveJSProperty('scrollWidth',99999);
});
