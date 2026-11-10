import {test,expect} from '@playwright/test';
const url='/learn/n5/module-04/chapter-02/lesson-02/';
test('keyboard, retry and feedback on shopping words',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/shopping words/i})).toBeVisible();
 const groups=page.locator('fieldset.foundation-question');
 await expect(groups).toHaveCount(12);
 await groups.first().locator('input[type=radio]').first().focus();
 await page.keyboard.press('ArrowDown');
 await expect(groups.first().locator('input[type=radio]:checked')).toHaveCount(1);
 for(let i=0;i<12;i++){await groups.nth(i).locator('input[type=radio]').first().check();}
 await page.getByRole('button',{name:'Check answers and save score'}).click();
 await expect(page.locator('.foundation-feedback').first()).toBeVisible();
 await page.getByRole('button',{name:'Retry shopping vocabulary'}).click();
 await expect(page.locator('fieldset.foundation-question input:checked')).toHaveCount(0);
 await page.getByRole('button',{name:'Compare with model'}).click();
 await expect(page.getByText('この青いノートはいくらですか。')).toBeVisible();
});
test('320px dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/shopping words/i})).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
 expect(overflow).toBe(false);
});