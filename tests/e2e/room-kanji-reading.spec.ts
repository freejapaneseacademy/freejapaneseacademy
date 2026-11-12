import { test, expect } from '@playwright/test';
const url='/learn/n5/module-02/chapter-04/lesson-04/';
test('keyboard answers, feedback and retry',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'Room Kanji: Read Furniture and Spatial Signs'})).toBeVisible();
 const fields=page.locator('.foundation-question');await expect(fields).toHaveCount(8);
 for(let i=0;i<8;i++){const radio=fields.nth(i).getByRole('radio').first();await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.locator('.foundation-feedback')).toHaveCount(8);
 await page.getByRole('button',{name:'Retry kanji check'}).click();
 await expect(page.locator('.foundation-feedback')).toHaveCount(0);
});
test('320px mobile in dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 await expect(page.getByRole('heading',{name:'Read the room signs'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});
