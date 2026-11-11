import {test,expect} from '@playwright/test';
const url='/learn/n5/module-06/chapter-02/lesson-08/';
test('keyboard-accessible role switching and written check',async({page})=>{
 await page.goto(url);await expect(page.getByRole('heading',{name:'Cooking-class role rehearsal'})).toBeVisible();
 await page.getByRole('button',{name:'Finishing scene'}).click();await page.getByRole('button',{name:'Partner B'}).click();
 await expect(page.getByText('はい。それから、混ぜますか。')).toBeVisible();
 await page.getByRole('checkbox',{name:/I used at least two correct te-forms/}).check();
 await expect(page.getByText(/1 of 4 self-review criteria/)).toBeVisible();
 const qs=page.locator('.foundation-question');await expect(qs).toHaveCount(8);
 for(let i=0;i<8;i++){const radio=qs.nth(i).getByRole('radio').first();await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
 await page.getByRole('button',{name:'Check answers and save score'}).click();await expect(page.locator('.foundation-feedback')).toHaveCount(8);
 await page.getByRole('button',{name:'Retry written check'}).click();await expect(page.locator('.foundation-feedback')).toHaveCount(0);
});
test('320px dark mode has no horizontal overflow',async({page})=>{await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);await expect(page.getByRole('heading',{name:'Cooking-class role rehearsal'})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);});