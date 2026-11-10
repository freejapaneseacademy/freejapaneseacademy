import {test,expect} from '@playwright/test';
const url='/learn/n5/module-02/chapter-04/lesson-08/';
test('keyboard roles, feedback, retry and written scoring',async({page})=>{
 await page.goto(url);await expect(page.getByRole('heading',{name:'Show a guest around: optional room-description roleplay'})).toBeVisible();
 await page.getByRole('button',{name:'Book and cat'}).click();await page.getByRole('button',{name:'Host'}).click();
 await expect(page.getByText('はい、います。机の 上に 本が あります。')).toBeVisible();
 await page.getByRole('checkbox',{name:/I used の/}).check();await expect(page.getByText(/1 of 4 self-review/)).toBeVisible();
 const questions=page.locator('.foundation-question');await expect(questions).toHaveCount(8);
 for(let i=0;i<8;i++){const radio=questions.nth(i).getByRole('radio').first();await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
 await page.getByRole('button',{name:'Check answers and save score'}).click();await expect(page.locator('.foundation-feedback')).toHaveCount(8);
 await page.getByRole('button',{name:'Retry written check'}).click();await expect(page.locator('.foundation-feedback')).toHaveCount(0);
});
test('320px mobile dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 await expect(page.getByRole('heading',{name:'Guide a guest around a room'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});
