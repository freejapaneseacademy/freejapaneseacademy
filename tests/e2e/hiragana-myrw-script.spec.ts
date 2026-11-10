import {test,expect} from '@playwright/test';
const url='/learn/start/module-02/chapter-03/lesson-04/';
test('M/Y/R/W script route and 22 written questions',async({page})=>{
 await page.goto('/learn/start/');
 await expect(page.getByRole('link',{name:/Study Hiragana I Chapter 03 lesson 04/})).toHaveAttribute('href',url);
 await page.goto(url);
 await expect(page.getByRole('heading',{level:1,name:'Recognize and type M/Y/R/W hiragana'})).toBeVisible();
 await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
 await expect(page.locator('section[aria-labelledby="myrw-script-studio"] fieldset')).toHaveCount(22);
});
test('typing score, explanations, retry and optional self-review',async({page})=>{
 await page.goto(url);
 const studio=page.locator('section[aria-labelledby="myrw-script-studio"]');
 const submit=studio.getByRole('button',{name:'Check all 22 written answers'});
 await expect(submit).toBeDisabled();
 for(const field of await studio.locator('fieldset').all())await field.locator('input[type=text]').fill('ま');
 await submit.click();
 await expect(studio.getByText(/Exact Japanese-script score: \d+\/22/)).toBeVisible();
 await expect(studio.getByText(/Model:/).first()).toBeVisible();
 await studio.getByRole('button',{name:'Retry written questions'}).click();
 await expect(submit).toBeDisabled();
 await studio.getByRole('button',{name:'Reveal models and self-review'}).click();
 await expect(studio.getByText('Self-review rubric (ungraded)')).toBeVisible();
});
for(const width of [320,375,768,1440])test('keyboard and dark mode at '+width,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto(url);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
 await page.locator('html').evaluate(el=>{el.dataset.theme='dark'});
 const input=page.locator('section[aria-labelledby="myrw-script-studio"] input[type=text]').first();
 await input.focus();await page.keyboard.type('ma');await expect(input).toHaveValue('ma');
});