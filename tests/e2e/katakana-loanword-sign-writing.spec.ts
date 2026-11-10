import { test, expect } from '@playwright/test';
const path='/learn/start/module-04/chapter-04/lesson-07/';
test('Japanese typing, feedback, retry and draft self-review work with keyboard',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/Write a station café sign/})).toBeVisible();
 const button=page.getByRole('button',{name:'Check eight spellings'});
 await expect(button).toBeDisabled();
 const fields=page.locator('input[type="text"][lang="ja"]');
 await expect(fields).toHaveCount(8);
 const answers=['コーヒー','ケーキ','ティー','ファイル','チェーン','タクシー','チケット','メニュー'];
 for(let i=0;i<8;i++){await fields.nth(i).focus();await page.keyboard.insertText(answers[i]);}
 await expect(button).toBeEnabled();await button.click();
 await expect(page.getByText('Typing score: 8/8.')).toBeVisible();
 await page.getByRole('button',{name:'Try spellings again'}).click();await expect(button).toBeDisabled();
 await page.getByLabel('Your two lines (Japanese input supported)').fill('カフェ　メニュー\nコーヒー　ケーキ　ティー');
 await page.getByRole('button',{name:'Save draft'}).click();await expect(page.getByText('Draft saved in this browser.')).toBeVisible();
 await page.getByRole('button',{name:'Show model and rubric'}).click();await expect(page.getByText(/0 of 4 self-checks/)).toBeVisible();
 await page.getByRole('button',{name:'Clear draft'}).click();await expect(page.getByLabel('Your two lines (Japanese input supported)')).toHaveValue('');
});
test('320px mobile and dark theme have no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);
 await expect(page.getByRole('heading',{name:/Write a station café sign/})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
});