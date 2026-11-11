import { test, expect } from '@playwright/test';
const url='/learn/n5/module-05/chapter-01/lesson-07/';
test('Japanese draft, keyboard answers, feedback and retry are independent',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/Write a Journey/}).first()).toBeVisible();
 await page.locator('#journey-draft').fill('私は学校から駅へ行きます。バスで行きます。家に帰ります。');
 await page.getByRole('button',{name:'Show model and self-review'}).click();
 await page.getByRole('checkbox').first().check();
 await expect(page.getByText(/Self-review: 1 of 4/)).toBeVisible();
 const questions=page.locator('fieldset.foundation-question');await expect(questions).toHaveCount(10);
 for(let i=0;i<10;i++){const radio=questions.nth(i).getByRole('radio').first();await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
 await page.getByRole('button',{name:'Check answers and save score'}).click();
 await expect(page.locator('.foundation-feedback')).toHaveCount(10);
 await expect(page.locator('#journey-draft')).toHaveValue(/学校から/);
 await page.getByRole('button',{name:'Retry language check'}).click();
 await expect(questions.first().getByRole('radio').first()).not.toBeChecked();
 await page.getByRole('button',{name:'Clear draft'}).click();
 await expect(page.locator('#journey-draft')).toHaveValue('');
});
test('320px dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 await expect(page.locator('article')).toContainText('帰ります');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
});