import { test, expect } from '@playwright/test';
const url='/learn/start/module-03/chapter-01/lesson-01/';
test('voiced kana context is indexed, accessible and scored',async({page})=>{
 await page.goto('/learn/start/');
 await expect(page.getByRole('link',{name:/Study Hiragana II Chapter 01 lesson 01/})).toHaveAttribute('href',url);
 await page.goto(url);
 await expect(page.getByRole('heading',{level:1,name:'Voiced hiragana — preparing a picture-card sorting game'})).toBeVisible();
 await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
 const quiz=page.locator('section[aria-labelledby="voiced-context-practice"]');
 await expect(quiz.locator('fieldset')).toHaveCount(8);
 const submit=quiz.getByRole('button',{name:'Check all eight answers'});
 await expect(submit).toBeDisabled();
 for(const field of await quiz.locator('fieldset').all())await field.locator('input[type=radio]').first().check();
 await submit.click();
 await expect(quiz.getByText(/Written score: \d+\/8/)).toBeVisible();
 await quiz.getByRole('button',{name:'Try the questions again'}).click();
 await expect(submit).toBeDisabled();
});
for(const width of [320,375,768,1440]){
 test('keyboard and responsive at '+width,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto(url);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
  await page.locator('html').evaluate(el=>{el.dataset.theme='dark'});
  const radio=page.locator('section[aria-labelledby="voiced-context-practice"] input[type=radio]').first();
  await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();
 });
}