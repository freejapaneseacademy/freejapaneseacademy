import {test,expect} from '@playwright/test';
const url='/learn/n5/module-02/chapter-02/lesson-08/';
test('keyboard role switching, quiz feedback and retry',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'Campus directions: optional role switching and shadowing'})).toBeVisible();
 await page.getByRole('button',{name:'Health room scene'}).click();
 await page.getByRole('button',{name:'Attendant'}).click();
 await expect(page.locator('p[lang="ja"][aria-live="polite"]').filter({hasText:'そこです。あなたの となりです。'})).toBeVisible();
 await page.getByRole('checkbox',{name:/I asked/}).check();
 await expect(page.getByText(/1 of 4 self-review/)).toBeVisible();
 const questions=page.locator('.foundation-question');await expect(questions).toHaveCount(8);
 for(let i=0;i<8;i++){const radio=questions.nth(i).getByRole('radio').first();await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
 await page.getByRole('button',{name:'Check answers and save score'}).click();
 await expect(page.locator('.foundation-feedback')).toHaveCount(8);
 await page.getByRole('button',{name:'Retry written check'}).click();
 await expect(page.locator('.foundation-feedback')).toHaveCount(0);
});
test('320px mobile dark mode no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 await expect(page.getByRole('heading',{name:'Switch roles: where is it?'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
});
