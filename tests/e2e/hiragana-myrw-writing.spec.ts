import { test, expect } from '@playwright/test';
const route='/learn/start/module-02/chapter-03/lesson-07/';
test('L07 writing route and scored kana input',async({page})=>{
 await page.goto(route);
 await expect(page.getByRole('heading',{level:1,name:/Write M\/Y\/R\/W hiragana/})).toBeVisible();
 await expect(page.locator('[data-question-id]')).toHaveCount(15);
 const first=page.locator('[data-question-id]').first();
 await first.locator('input').fill('ま');
 await expect(first.locator('input')).toHaveValue('ま');
 await expect(page.getByRole('button',{name:'Check and save score'})).toBeDisabled();
 await expect(page.getByLabel('Your two Japanese lines')).toBeVisible();
});
for(const width of [320,375,430,768,1024,1440]) test('L07 responsive dark and keyboard '+width,async({page})=>{
 await page.setViewportSize({width,height:900});
 await page.goto(route);
 await page.locator('html').evaluate(el=>{el.dataset.theme='dark'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
 await page.keyboard.press('Tab');
 expect(await page.evaluate(()=>document.activeElement?.tagName)).not.toBe('BODY');
 await expect(page.getByRole('heading',{level:2,name:/Write the remaining basic hiragana/})).toBeVisible();
});