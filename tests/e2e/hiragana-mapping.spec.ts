import {test,expect} from '@playwright/test';
const url='/learn/start/module-02/chapter-01/lesson-03/';
test('mapping lesson is canonical, indexed and navigable',async({page})=>{
 await page.goto('/learn/start/');
 await expect(page.getByRole('link',{name:/Study Hiragana I lesson 03/})).toHaveAttribute('href',url);
 await page.goto(url);
 await expect(page.getByRole('heading',{level:1,name:'Hiragana sounds and strokes'})).toBeVisible();
 await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
 await expect(page.locator('section[aria-labelledby="hiragana-sound-practice"] fieldset')).toHaveCount(8);
});
test('mapping quiz is keyboard-operable, scored and retryable',async({page})=>{
 await page.goto(url);
 const quiz=page.locator('section[aria-labelledby="hiragana-sound-practice"]');
 const button=quiz.getByRole('button',{name:'Check all eight answers'});
 await expect(button).toBeDisabled();
 for(const field of await quiz.locator('fieldset').all())await field.locator('input[type=radio]').first().check();
 await button.click();
 await expect(quiz.getByText(/Written score: \d+\/8/)).toBeVisible();
 await quiz.getByRole('button',{name:'Try the questions again'}).click();
 await expect(button).toBeDisabled();
});
for(const width of [320,375,768,1440]){
 test('no overflow and keyboard focus at '+width,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto(url);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
  await page.locator('html').evaluate(el=>{el.dataset.theme='dark'});
  const radio=page.locator('section[aria-labelledby="hiragana-sound-practice"] input[type=radio]').first();
  await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();
 });
}