import {test,expect} from '@playwright/test';
test('L05 label reading works at 320px and shows sourced feedback',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-02/chapter-02/lesson-05/');
 await expect(page.getByRole('heading',{name:'Read T/N/H kana labels'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Find the printed evidence'})).toBeVisible();
 const fields=page.locator('fieldset');await expect(fields).toHaveCount(8);
 const button=page.getByRole('button',{name:'Check eight reading answers'});await expect(button).toBeDisabled();
 for(let i=0;i<8;i++)await fields.nth(i).getByRole('radio').first().check();
 await expect(button).toBeEnabled();await button.click();
 await expect(page.getByText(/Written reading score: \d\/8/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Retry all questions'})).toBeVisible();
 await page.getByRole('button',{name:'Retry all questions'}).click();await expect(button).toBeDisabled();
});
test('L05 keyboard operation and dark-mode content',async({page})=>{
 await page.goto('/learn/start/module-02/chapter-02/lesson-05/');
 for(let i=0;i<8;i++){const radio=page.locator('fieldset').nth(i).getByRole('radio').first();await radio.focus();await page.keyboard.press('Space')}
 await page.getByRole('button',{name:'Check eight reading answers'}).focus();await page.keyboard.press('Enter');
 await expect(page.getByText(/Written reading score:/)).toBeVisible();
 await page.emulateMedia({colorScheme:'dark'});await expect(page.getByRole('heading',{name:'Read T/N/H kana labels'})).toBeVisible();
});
