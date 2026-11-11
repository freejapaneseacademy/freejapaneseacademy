import { test, expect } from '@playwright/test';
const url='/learn/n5/module-04/chapter-04/lesson-07/';
test('Japanese IME-friendly writing and self-review are separate from quiz',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/Write an Invitation/}).first()).toBeVisible();
 await page.locator('#invite-draft').fill('土曜日にいっしょに昼ご飯を食べませんか。十二時に駅で会いましょう。');
 await page.locator('#reply-draft').fill('いいですね。');
 await page.getByRole('button',{name:'Show model and self-review'}).click();
 await page.getByRole('checkbox').first().check();
 await expect(page.getByText(/Self-review: 1 of 4/)).toBeVisible();
 const questions=page.locator('fieldset.foundation-question');await expect(questions).toHaveCount(10);
 for(let i=0;i<10;i++){const radio=questions.nth(i).getByRole('radio').first();await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
 await page.getByRole('button',{name:'Check answers and save score'}).click();
 await expect(page.locator('.foundation-feedback')).toHaveCount(10);
 await expect(page.locator('#invite-draft')).toHaveValue(/土曜日/);
 await page.getByRole('button',{name:'Retry language check'}).click();
 await expect(questions.first().getByRole('radio').first()).not.toBeChecked();
 await page.getByRole('button',{name:'Clear both drafts'}).click();
 await expect(page.locator('#invite-draft')).toHaveValue('');
});
test('320px dark-mode layout has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});await page.emulateMedia({colorScheme:'dark'});await page.goto(url);
 await expect(page.locator('article')).toContainText('ませんか');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
});
