import { test,expect } from '@playwright/test';
const route='/learn/start/module-05/chapter-01/lesson-07/';
test('draft, model and keyboard practice',async({page})=>{
 await page.goto(route);
 await expect(page.getByRole('heading',{name:'Write a two-line note'})).toBeVisible();
 await page.getByLabel('Your Japanese message').fill('こんにちは。\nよんでください。');
 await page.getByRole('button',{name:'Save draft'}).click();
 await expect(page.getByText('Draft saved locally.')).toBeVisible();
 await page.getByRole('button',{name:'Compare model'}).click();
 await expect(page.getByText(/Model for a classmate/)).toBeVisible();
 const radio=page.locator('fieldset[data-question-id]').first().locator('input[type="radio"]').first();
 await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();
});
test('320px mobile viewport',async({page})=>{
 await page.setViewportSize({width:320,height:700});await page.goto(route);
 await expect(page.locator('#greeting-writing-draft')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
});