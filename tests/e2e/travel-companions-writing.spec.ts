import {test,expect} from '@playwright/test';
const path='/learn/n5/module-05/chapter-02/lesson-07/';
test('Japanese draft, models, keyboard answers, feedback and retry',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:'Write a travel plan'})).toBeVisible();
 const draft=page.getByRole('textbox',{name:'Your Japanese draft'});
 await draft.fill('日曜日、公園に行きます。一人で行きます。電車で行きます。');
 await page.getByRole('button',{name:'Show model answers and rubric'}).click();
 await expect(page.getByLabel('Writing self-review models')).toBeVisible();
 await page.getByRole('button',{name:'Save draft locally'}).click();
 await expect(page.getByText('Draft saved in this browser only.')).toBeVisible();
 const groups=page.locator('section[aria-label="Travel writing pattern quiz"] fieldset');
 await expect(groups).toHaveCount(10);
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText('Please answer all ten questions first.')).toBeVisible();
 for(let i=0;i<10;i++){const radio=groups.nth(i).locator('input[type="radio"]').first();await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText(/Pattern recognition: \d+ of 10 correct/)).toBeVisible();
 await expect(groups.first().getByRole('status')).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(groups.first().locator('input:checked')).toHaveCount(0);
 await page.getByRole('button',{name:'Clear draft'}).click();
 await expect(draft).toHaveValue('');
});
test('320px mobile dark-mode writing and quiz fit',async({page})=>{
 await page.setViewportSize({width:320,height:740});await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await expect(page.getByRole('textbox',{name:'Your Japanese draft'})).toBeVisible();
 await expect(page.locator('section[aria-label="Travel writing pattern quiz"]')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});