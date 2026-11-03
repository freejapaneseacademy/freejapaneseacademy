import {test,expect} from '@playwright/test';
const url='/learn/start/module-01/chapter-04/lesson-02/';
test('Chapter 04 L02 displays the original vocabulary lesson and scores keyboard-selected answers',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:/Study words/i})).toBeVisible();
 await expect(page.getByText(/もういちど おねがいします。/).first()).toBeVisible();
 const fields=page.locator('fieldset.foundation-question');
 await expect(fields).toHaveCount(12);
 await expect(page.getByRole('button',{name:'Check answers and save score'})).toBeDisabled();
 for(let i=0;i<12;i++)await fields.nth(i).getByRole('radio').first().check();
 await page.getByRole('button',{name:'Check answers and save score'}).click();
 await expect(page.locator('.foundation-result')).toContainText('/ 12 correct');
 await expect(page.locator('.foundation-feedback')).toHaveCount(12);
 await page.getByRole('button',{name:'Retry vocabulary check'}).click();
 await expect(page.getByRole('button',{name:'Check answers and save score'})).toBeDisabled();
});
test('Chapter 04 L02 is usable at 320px and offers optional ungraded writing',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.goto(url);
 await expect(page.locator('fieldset.foundation-question')).toHaveCount(12);
 await page.getByLabel(/How would you ask Ken/).fill('もういちど おねがいします。');
 await page.getByRole('button',{name:'Compare with model answer'}).click();
 await expect(page.getByText('もういちど おねがいします。 よみかたを おしえて ください。')).toBeVisible();
 await expect(page.locator('body')).toHaveJSProperty('scrollWidth',320);
});
test('Chapter 04 L02 supports dark theme without hiding assessment',async({page})=>{
 await page.goto(url);
 await page.emulateMedia({colorScheme:'dark'});
 await expect(page.locator('fieldset.foundation-question')).toHaveCount(12);
 await expect(page.getByRole('button',{name:'Check answers and save score'})).toBeVisible();
});
