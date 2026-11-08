import { test, expect } from '@playwright/test';
const url='/learn/start/module-05/chapter-03/lesson-01/';
test('keyboard-accessible answer, feedback and retry',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/First sentence patterns/i})).toBeVisible();
 const groups=page.locator('fieldset[data-question-id]');
 await expect(groups).toHaveCount(10);
 for(let i=0;i<10;i++){await groups.nth(i).locator('input[type=radio]').first().focus();await page.keyboard.press('Space');}
 await page.getByRole('button',{name:'Check ten answers'}).click();
 await expect(page.getByText('Written score: 10/10.')).toBeVisible();
 await page.getByRole('button',{name:'Retry all questions'}).click();
 await expect(page.getByRole('button',{name:'Check ten answers'})).toBeDisabled();
});
test('320px mobile and dark mode avoid horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/First sentence patterns/i})).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
 expect(overflow).toBe(false);
});
