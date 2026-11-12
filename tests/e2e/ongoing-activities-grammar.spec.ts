import {test,expect} from '@playwright/test';
const path='/learn/n5/module-06/chapter-04/lesson-03/';
test('keyboard selection, feedback, retry and ungraded writing',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/What Are They Doing Now/})).toBeVisible();
 await page.getByLabel('Two to four lines using 何をしていますか and 〜ています').fill('今、何をしていますか。');
 await page.getByRole('button',{name:'Show model and self-check'}).click();
 await expect(page.getByText(/Check て-form/)).toBeVisible();
 const groups=page.locator('.foundation-question');
 await expect(groups).toHaveCount(12);
 for(let i=0;i<12;i++){const q=groups.nth(i);const radio=q.getByRole('radio').nth(i%3);await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText('Recognition score: 12 / 12')).toBeVisible();
 await expect(groups.first().getByText(/Evidence:/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check answers'})).toBeDisabled();
 await expect(page.getByLabel('Two to four lines using 何をしていますか and 〜ています')).toHaveValue('今、何をしていますか。');
});
test('320px dark mode stays inside viewport',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await page.getByLabel('Two to four lines using 何をしていますか and 〜ています').fill('本を読んでいます。');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
