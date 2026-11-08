import { test,expect } from '@playwright/test';
const route='/learn/start/module-04/chapter-02/lesson-04/';
test('keyboard entry, radio answers, delayed feedback and retry',async({page})=>{
 await page.goto(route);
 await expect(page.getByRole('heading',{name:/Katakana N\/H\/M\/Y/})).toBeVisible();
 const fields=page.locator('fieldset');await expect(fields).toHaveCount(10);
 const submit=page.getByRole('button',{name:'Check ten answers'});await expect(submit).toBeDisabled();
 for(let i=0;i<10;i++){
  const field=fields.nth(i);
  const input=field.getByRole('textbox');
  if(await input.count()){await input.focus();await page.keyboard.type('ナ');}
  else {await field.getByRole('radio').first().focus();await page.keyboard.press('Space');}
 }
 await expect(submit).toBeEnabled();await submit.click();
 await expect(page.getByText(/Written score:/)).toBeVisible();
 await expect(fields.first().getByText(/Correct\.|Review this form\./)).toBeVisible();
 await page.getByRole('button',{name:'Try again'}).click();await expect(submit).toBeDisabled();
});
test('320px layout and keyboard focus do not overflow',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.goto(route);
 await expect(page.getByRole('heading',{name:/Katakana N\/H\/M\/Y/})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
 await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.activeElement?.tagName)).toBeTruthy();
});
