import { test,expect } from '@playwright/test';
const url='/learn/n5/module-01/chapter-03/lesson-07/';
test('writing editor saves and reloads, recognition supports keyboard',async({page})=>{
 await page.goto(url);
 const editor=page.getByLabel('Write 2–5 Japanese sentences about a fictional family');
 await editor.fill('こちらは私の母です。');
 await page.getByRole('button',{name:'Save draft locally'}).click();
 await editor.fill('');
 await page.getByRole('button',{name:'Load saved draft'}).click();
 await expect(editor).toHaveValue('こちらは私の母です。');
 const groups=page.locator('fieldset[data-question-id]');
 await expect(groups).toHaveCount(8);
 for(let i=0;i<8;i++){const radio=groups.nth(i).getByRole('radio').first();await radio.focus();await page.keyboard.press('Space');}
 await page.getByRole('button',{name:'Check eight answers'}).click();
 await expect(page.getByText(/Recognition score:/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check eight answers'})).toBeDisabled();
 await page.getByRole('button',{name:'Clear draft'}).click();
 await expect(editor).toHaveValue('');
});
test('320px dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:740});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/Write a family introduction/i}).first()).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
});