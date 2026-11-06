import { test,expect } from '@playwright/test';
test('L04 typed kana labels work on 320px and retry',async({page})=>{
 await page.setViewportSize({width:320,height:700});
 await page.goto('/learn/start/module-02/chapter-04/lesson-04/');
 await expect(page.getByRole('heading',{name:/Recognize and type connected hiragana words/i})).toBeVisible();
 await expect(page.locator('input[lang="ja"]')).toHaveCount(10);
 await expect(page.getByRole('button',{name:'Check ten labels'})).toBeDisabled();
 for(const input of await page.locator('input[lang="ja"]').all())await input.fill('ねこ');
 await page.getByRole('button',{name:'Check ten labels'}).click();
 await expect(page.getByText(/Written score:/)).toBeVisible();
 await page.getByRole('button',{name:'Try the labels again'}).click();
 await expect(page.getByRole('button',{name:'Check ten labels'})).toBeDisabled();
 await page.evaluate(()=>document.documentElement.classList.add('dark'));
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
});