import { test, expect } from '@playwright/test';
const path='/learn/n5/module-03/chapter-02/lesson-05/';
test('keyboard selection, feedback and retry',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:'Read a daily routine note'})).toBeVisible();
 const groups=page.locator('fieldset.foundation-question');await expect(groups).toHaveCount(10);
 for(let i=0;i<10;i++){const first=groups.nth(i).getByRole('radio').first();await first.focus();await page.keyboard.press('Space');await expect(first).toBeChecked();}
 await page.getByRole('button',{name:'Check answers and save score'}).click();
 await expect(page.getByRole('button',{name:'Retry reading check'})).toBeVisible();
 await expect(page.locator('.foundation-feedback').first()).toBeVisible();
 await page.getByRole('button',{name:'Retry reading check'}).click();
 await expect(groups.first().getByRole('radio').first()).not.toBeChecked();
});
test('320px dark mode has no document overflow',async({page})=>{
 await page.setViewportSize({width:320,height:740});await page.emulateMedia({colorScheme:'dark'});await page.goto(path);
 await expect(page.getByRole('heading',{name:'Read a daily routine note'})).toBeVisible();
 await expect(page.locator('fieldset.foundation-question')).toHaveCount(10);
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});