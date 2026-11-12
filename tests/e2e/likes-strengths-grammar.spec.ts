import {test,expect} from '@playwright/test';
const path='/learn/n5/module-07/chapter-01/lesson-03/';
test('keyboard quiz, feedback, retry and ungraded writing',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{name:/Likes, Skills, and Ability/})).toBeVisible();
 await page.getByLabel('Write three or four sentences about a hobby, ability and skill').fill('音楽が好きです。');
 await page.getByRole('button',{name:'Show model and self-check'}).click();
 await expect(page.getByText(/Self-check: が after/)).toBeVisible();
 const groups=page.locator('.foundation-question');
 await expect(groups).toHaveCount(12);
 for(let i=0;i<12;i++){const radio=groups.nth(i).getByRole('radio').nth(i%3);await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();}
 await page.getByRole('button',{name:'Check answers'}).click();
 await expect(page.getByText('Recognition score: 12 / 12')).toBeVisible();
 await expect(groups.first().getByText(/Evidence:/)).toBeVisible();
 await page.getByRole('button',{name:'Retry questions'}).click();
 await expect(page.getByRole('button',{name:'Check answers'})).toBeDisabled();
 await expect(page.getByLabel('Write three or four sentences about a hobby, ability and skill')).toHaveValue('音楽が好きです。');
});
test('320px dark mode has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(path);
 await page.getByLabel('Write three or four sentences about a hobby, ability and skill').fill('ピアノが少しできます。');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
