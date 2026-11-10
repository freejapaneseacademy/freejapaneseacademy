import {test,expect} from '@playwright/test';
const route='/learn/start/module-05/chapter-01/lesson-05/';
test('reading cards allow keyboard answers, delayed feedback and retry',async({page})=>{
 await page.goto(route);await expect(page.getByRole('heading',{name:/Read greeting cards/})).toBeVisible();
 const fields=page.locator('fieldset[data-question-id]');await expect(fields).toHaveCount(8);
 const submit=page.getByRole('button',{name:'Check eight answers'});await expect(submit).toBeDisabled();
 await expect(fields.first().getByText(/Correct\./)).toHaveCount(0);
 for(let i=0;i<8;i++){await fields.nth(i).getByRole('radio').first().focus();await page.keyboard.press('Space');}
 await expect(submit).toBeEnabled();await submit.click();
 await expect(page.getByText('Reading score: 8/8')).toBeVisible();
 await expect(fields.first().getByText(/Correct\./)).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();await expect(submit).toBeDisabled();
});
test('320px viewport remains readable and keyboard accessible',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.goto(route);
 await expect(page.getByRole('heading',{name:/Read greeting cards/})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.locator('fieldset[data-question-id]').first().getByRole('radio').first().focus();
 await page.keyboard.press('Space');
 await expect(page.locator('fieldset[data-question-id]').first().getByRole('radio').first()).toBeChecked();
});