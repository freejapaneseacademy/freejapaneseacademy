import {test,expect} from '@playwright/test';
const url='/learn/start/module-02/chapter-03/lesson-02/';
test('M/Y/R/W vocabulary lesson is linked, indexed and has ten questions',async({page})=>{
 await page.goto('/learn/start/');
 await expect(page.getByRole('link',{name:/Study Hiragana I Chapter 03 lesson 02/})).toHaveAttribute('href',url);
 await page.goto(url);
 await expect(page.getByRole('heading',{level:1,name:'M/Y/R/W hiragana word cards — everyday nouns in context'})).toBeVisible();
 await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
 await expect(page.locator('section[aria-labelledby="hiragana-myrw-vocabulary-practice"] fieldset')).toHaveCount(10);
});
test('quiz scores, saves and retries',async({page})=>{
 await page.goto(url);
 const quiz=page.locator('section[aria-labelledby="hiragana-myrw-vocabulary-practice"]');
 const button=quiz.getByRole('button',{name:'Check all ten answers'});
 await expect(button).toBeDisabled();
 for(const field of await quiz.locator('fieldset').all())await field.locator('input[type=radio]').first().check();
 await button.click();
 await expect(quiz.getByText(/Written score: \d+\/10/)).toBeVisible();
 await quiz.getByRole('button',{name:'Try the questions again'}).click();
 await expect(button).toBeDisabled();
});
for(const width of [320,375,768,1440]){
 test('responsive and keyboard usable at '+width,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto(url);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
  await page.locator('html').evaluate(el=>{el.dataset.theme='dark'});
  const radio=page.locator('section[aria-labelledby="hiragana-myrw-vocabulary-practice"] input[type=radio]').first();
  await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();
 });
}
