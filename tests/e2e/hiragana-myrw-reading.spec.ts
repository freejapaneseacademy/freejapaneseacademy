import {test,expect} from '@playwright/test';
const url='/learn/start/module-02/chapter-03/lesson-05/';
test('reading route, navigation and evidence questions',async({page})=>{
 await page.goto('/learn/start/');
 await expect(page.getByRole('link',{name:/Study Hiragana I Chapter 03 lesson 05/})).toHaveAttribute('href',url);
 await page.goto(url);
 await expect(page.getByRole('heading',{level:1,name:'Read the picture labels — M/Y/R/W hiragana'})).toBeVisible();
 await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
 await expect(page.locator('section[aria-labelledby="myrw-reading-check"] fieldset')).toHaveCount(12);
});
test('reading answers, evidence feedback and retry',async({page})=>{
 await page.goto(url);
 const check=page.locator('section[aria-labelledby="myrw-reading-check"]');
 const submit=check.getByRole('button',{name:'Check all 12 reading answers'});
 await expect(submit).toBeDisabled();
 for(const field of await check.locator('fieldset').all())await field.locator('input[type=radio]').first().check();
 await submit.click();
 await expect(check.getByText(/Reading score: \d+\/12/)).toBeVisible();
 await expect(check.getByText(/Evidence:/).first()).toBeVisible();
 await check.getByRole('button',{name:'Retry reading questions'}).click();
 await expect(submit).toBeDisabled();
});
for(const width of [320,375,768,1440])test('keyboard and dark mode at '+width,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto(url);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
 await page.locator('html').evaluate(el=>{el.dataset.theme='dark'});
 const radio=page.locator('section[aria-labelledby="myrw-reading-check"] input[type=radio]').first();
 await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();
});
