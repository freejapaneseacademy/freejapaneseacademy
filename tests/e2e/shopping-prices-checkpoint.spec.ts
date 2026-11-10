import {test,expect} from '@playwright/test';
test('shopping checkpoint keyboard, retry and 320px dark mode',async({page})=>{
 await page.goto('/learn/n5/module-04/chapter-02/checkpoint/');
 await expect(page.getByRole('heading',{name:/Shopping and prices — chapter checkpoint/i})).toBeVisible();
 const fieldsets=page.locator('fieldset');await expect(fieldsets).toHaveCount(12);
 for(let i=0;i<12;i++){await fieldsets.nth(i).getByRole('radio').first().check();}
 await page.getByRole('button',{name:'Submit all answers'}).click();
 await expect(page.getByText(/Written score:/)).toBeVisible();
 await page.getByRole('button',{name:'Retry checkpoint'}).click();
 await expect(page.getByRole('button',{name:'Submit all answers'})).toBeDisabled();
 await page.getByLabel('Your two to five Japanese sentences').fill('これはいくらですか。');
 await page.getByRole('button',{name:'Compare with model'}).click();
 await expect(page.getByText(/二冊ください/)).toBeVisible();
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
