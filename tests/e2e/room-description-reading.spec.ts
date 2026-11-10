import {test,expect} from '@playwright/test';
const url='/learn/n5/module-02/chapter-04/lesson-05/';
test('keyboard reading quiz, feedback and retry',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'Read a room description'})).toBeVisible();
 const qs=page.locator('fieldset.foundation-question');await expect(qs).toHaveCount(10);
 for(let i=0;i<10;i++){const radio=qs.nth(i).getByRole('radio').first();await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
 await page.getByRole('button',{name:'Check answers and save score'}).click();
 await expect(page.locator('.foundation-feedback')).toHaveCount(10);
 await page.getByRole('button',{name:'Retry reading check'}).click();
 await expect(qs.first().getByRole('radio').first()).not.toBeChecked();
 await page.getByRole('button',{name:'Compare with model'}).click();
 await expect(page.getByText('机の 上に ノートが あります。本棚の 中に 日本語の 本が あります。')).toBeVisible();
});
test('320px dark mode layout has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 await expect(page.locator('article')).toContainText('本棚');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});