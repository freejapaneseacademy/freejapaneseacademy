import {test,expect} from '@playwright/test';
const route='/learn/start/module-04/chapter-03/lesson-08/';
test('optional katakana shadowing is keyboard accessible and knowledge-only',async({page})=>{
 await page.goto(route);
 await expect(page.getByRole('heading',{name:/Shadow a katakana shop exchange/i})).toBeVisible();
 await expect(page.locator('audio[src$=".wav"]')).toHaveCount(2);
 await expect(page.getByRole('button',{name:'Start optional recording'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Check six knowledge answers'})).toBeDisabled();
 for(const field of await page.locator('fieldset').filter({has:page.locator('input[type=radio]')}).all()){await field.locator('input[type=radio]').first().check();}
 await expect(page.getByRole('button',{name:'Check six knowledge answers'})).toBeEnabled();
 await page.getByRole('button',{name:'Check six knowledge answers'}).focus();
 await page.keyboard.press('Enter');
 await expect(page.getByText(/Knowledge score:/)).toBeVisible();
 await expect(page.getByText(/Not a pronunciation grade/).last()).toBeVisible();
});
test('320px viewport has no horizontal overflow and preserves native audio',async({page})=>{
 await page.setViewportSize({width:320,height:740});await page.goto(route);
 await expect(page.locator('audio[src$=".wav"]')).toHaveCount(2);
 await expect(page.getByRole('button',{name:'Start optional recording'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
