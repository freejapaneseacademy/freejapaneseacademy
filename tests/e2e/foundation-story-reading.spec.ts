import { test, expect } from '@playwright/test';
const path='/learn/start/module-05/chapter-04/lesson-05/';
test('keyboard completion, feedback and retry',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/Foundation reading/})).toBeVisible();
 const groups=page.locator('fieldset');
 await expect(groups).toHaveCount(10);
 const submit=page.getByRole('button',{name:'Check all ten answers'});
 await expect(submit).toBeDisabled();
 for(let i=0;i<10;i++){await groups.nth(i).locator('input[type=radio]').first().focus();await page.keyboard.press('Space');}
 await expect(submit).toBeEnabled();await submit.click();
 await expect(page.getByText(/Reading score:/)).toBeVisible();
 await expect(page.getByText('Japanese evidence:',{exact:true}).first()).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(submit).toBeDisabled();
});
test('320px and dark mode are readable without horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await expect(page.locator('fieldset')).toHaveCount(10);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
});
