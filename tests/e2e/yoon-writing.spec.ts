import { test, expect } from '@playwright/test';
const url='/learn/start/module-03/chapter-02/lesson-07/';
test('contracted-kana writing scores and keyboard access',async({page})=>{
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'Type the contracted kana'})).toBeVisible();
 const answers=['きゃ','しゅ','ちょ','おちゃ','じしょ','しゃしん','おちゃが あります。','いっしょに よみましょう。'];
 for(let i=0;i<answers.length;i++)await page.locator('input[lang="ja"]').nth(i).fill(answers[i]);
 await page.getByRole('button',{name:'Check eight answers'}).click();
 await expect(page.getByText('Written score: 8/8.',{exact:false})).toBeVisible();
 await page.getByLabel('Your fictional club message').fill('おちゃが あります。\nいっしょに よみましょう。');
 await page.getByRole('button',{name:'Clear draft'}).click();
 await expect(page.getByLabel('Your fictional club message')).toHaveValue('');
});
test('mobile 320px, dark mode and no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:320,height:720});
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto(url);
 await expect(page.getByRole('heading',{name:'Type the contracted kana'})).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
 expect(overflow).toBe(false);
});