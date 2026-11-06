import {test,expect} from '@playwright/test';
const url='/learn/start/module-02/chapter-03/lesson-06/';
test('listening route and Foundations navigation',async({page})=>{
 await page.goto('/learn/start/');
 await expect(page.getByRole('link',{name:/Study Hiragana I Chapter 03 lesson 06/})).toHaveAttribute('href',url);
 await page.goto(url);
 await expect(page.getByRole('heading',{level:1,name:'Hear M/Y/R/W words in two everyday conversations'})).toBeVisible();
 await expect(page.locator('audio')).toHaveCount(2);
 await expect(page.locator('audio').first()).toHaveAttribute('src',/l0-m02-c03-l06-a-v1.wav/);
});
for(const width of [320,375,768,1440])test('mobile width and dark mode '+width,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto(url);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
 await page.locator('html').evaluate(el=>{el.dataset.theme='dark'});
 await expect(page.locator('audio').first()).toBeVisible();
 await page.keyboard.press('Tab');
 expect(await page.evaluate(()=>document.activeElement?.tagName)).not.toBe('BODY');
});
