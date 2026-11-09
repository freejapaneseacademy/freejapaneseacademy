import {test,expect} from '@playwright/test';
test('katakana voiced writing works at 320px with keyboard, retry and local draft',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});
 await page.goto('/learn/start/module-04/chapter-03/lesson-07/');
 await expect(page.getByRole('heading',{name:/Write katakana shop labels/})).toBeVisible();
 const fields=page.locator('input[type=text][lang=ja]');await expect(fields).toHaveCount(8);
 await expect(fields.first()).toBeEnabled();
 const answers=['パン','ペン','カバン','ソース','リンゴ','ラジオ','ピアノ','パンダ'];
 for(let i=0;i<8;i++){await fields.nth(i).fill(answers[i]);}
 const submit=page.getByRole('button',{name:'Check eight spellings'});await expect(submit).toBeEnabled();await submit.click();
 await expect(page.getByText('Written score: 8/8.')).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();await expect(submit).toBeDisabled();
 await page.getByLabel('Your fictional shop labels').fill('パン　ペン\nカバン　ソース');
 await page.getByRole('button',{name:'Save draft locally'}).click();await expect(page.getByText('Saved locally on this device.')).toBeVisible();
 await page.reload();await expect(page.getByLabel('Your fictional shop labels')).toHaveValue('パン　ペン\nカバン　ソース');
 await page.getByRole('button',{name:'Clear draft'}).click();await expect(page.getByLabel('Your fictional shop labels')).toHaveValue('');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
});
