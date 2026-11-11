import { test,expect } from '@playwright/test';
const path='/learn/n5/module-05/chapter-03/lesson-02/';
test('keyboard selection, feedback and retry',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/Finding the way/})).toBeVisible();
 const questions=page.locator('fieldset.foundation-question');
 await expect(questions).toHaveCount(12);
 for(let i=0;i<12;i++){const radio=questions.nth(i).getByRole('radio').first();await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
 const submit=page.getByRole('button',{name:'Check answers and save score'});
 await expect(submit).toBeEnabled();
 await submit.click();
 await expect(page.getByRole('status').filter({hasText:/correct/})).toBeVisible();
 await page.getByRole('button',{name:'Retry vocabulary check'}).click();
 await expect(page.getByText('0 of 12 answered')).toBeVisible();
});
test('320px dark mode has no horizontal overflow and writing comparison is optional',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await expect(page.locator('main').first()).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await page.getByLabel(/Write one sentence locating/).fill('郵便局は銀行の隣にあります。');
 await page.getByRole('button',{name:'Compare with model'}).click();
 await expect(page.getByText('郵便局は銀行の隣にあります。',{exact:true}).last()).toBeVisible();
});