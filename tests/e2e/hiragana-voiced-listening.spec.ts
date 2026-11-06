import {test,expect} from '@playwright/test';
const url='/learn/start/module-03/chapter-01/lesson-06/';
test('listening route and Foundations navigation',async({page})=>{
 await page.goto('/learn/start/');
 await expect(page.getByRole('link',{name:/Study Chapter 01 lesson 06: voiced hiragana listening/})).toHaveAttribute('href',url);
 await page.goto(url);
 await expect(page.getByRole('heading',{level:1,name:'Hear voiced hiragana in a bakery and at the zoo'})).toBeVisible();
 await expect(page.locator('audio')).toHaveCount(2);
 await expect(page.locator('audio').first()).toHaveAttribute('src',/l0-m03-c01-l06-a-v1.wav/);
});
for(const width of [320,375,768,1440])test('mobile and dark mode '+width,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto(url);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
 await page.locator('html').evaluate(el=>{el.dataset.theme='dark'});
 await expect(page.locator('audio').first()).toBeVisible();
 await page.keyboard.press('Tab');
 expect(await page.evaluate(()=>document.activeElement?.tagName)).not.toBe('BODY');
});
