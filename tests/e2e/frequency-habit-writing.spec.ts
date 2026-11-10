import { test, expect } from '@playwright/test';
const url='/learn/n5/module-03/chapter-04/lesson-07/';
test('keyboard-accessible writing, local draft and recognition retry',async({page})=>{
  await page.goto(url);
  const editor=page.getByLabel('Your Japanese journal (two to five sentences)');
  await editor.fill('毎朝、本を読みます。テレビはあまり見ません。');
  await page.getByRole('button',{name:'Save draft'}).click();
  await editor.fill('');
  await page.getByRole('button',{name:'Load saved draft'}).click();
  await expect(editor).toHaveValue('毎朝、本を読みます。テレビはあまり見ません。');
  await page.getByRole('button',{name:'Show model'}).click();
  await expect(page.getByText('Compare with a model')).toBeVisible();
  const questions=page.locator('[data-question-id]');
  await expect(questions).toHaveCount(8);
  for(let i=0;i<8;i++){const first=questions.nth(i).locator('input[type=radio]').first();await first.focus();await page.keyboard.press('Space');await expect(first).toBeChecked();}
  await page.getByRole('button',{name:'Check all 8 answers'}).click();
  await expect(page.getByText(/Recognition score:/)).toBeVisible();
  await page.getByRole('button',{name:'Retry questions'}).click();
  await expect(page.getByRole('button',{name:'Check all 8 answers'})).toBeDisabled();
  await page.getByRole('button',{name:'Clear saved draft'}).click();
  await expect(editor).toHaveValue('');
});
test('320px dark mode has no horizontal overflow',async({page})=>{
  await page.setViewportSize({width:320,height:740});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto(url);
  await expect(page.getByRole('heading',{name:'Write a Habit Journal: How Often Do You Study?'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});