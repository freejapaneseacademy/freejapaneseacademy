import {test,expect} from '@playwright/test';
test('foundation writing is keyboard usable at 320px in dark mode',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});
 await page.goto('/learn/start/module-05/chapter-04/lesson-07/');
 await expect(page.getByRole('heading',{name:/Foundation writing studio/})).toBeVisible();
 const fields=page.locator('input[type=text][lang=ja]');await expect(fields).toHaveCount(10);
 const answers=['きって','がっこう','きょう','りょこう','コーヒー','チョコレート','パン','ペン','にほんご','ありがとう'];
 for(let i=0;i<10;i++){await fields.nth(i).fill(answers[i]);}
 await fields.last().press('Tab');
 await page.getByRole('button',{name:'Check ten spellings'}).click();
 await expect(page.getByText('Written score: 10/10.')).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(page.getByRole('button',{name:'Check ten spellings'})).toBeDisabled();
 await page.getByLabel('Your fictional notebook labels and review routine').fill('にほんご　きょう\nコーヒー　パン\nFive minutes on Monday.');
 await page.getByRole('button',{name:'Save draft locally'}).click();
 await expect(page.getByText('Saved locally on this device.')).toBeVisible();
 await page.reload();
 await expect(page.getByLabel('Your fictional notebook labels and review routine')).toContainText('にほんご');
 await page.getByRole('button',{name:'Clear draft'}).click();
 await expect(page.getByLabel('Your fictional notebook labels and review routine')).toHaveValue('');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
});
