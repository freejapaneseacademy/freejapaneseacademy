import { test, expect } from '@playwright/test';
const url='/learn/start/module-03/chapter-01/lesson-02/';
test('voiced vocabulary is indexed, accessible and scored',async({page})=>{
 await page.goto('/learn/start/');
 await expect(page.locator('[data-foundation-lesson-id="l0-m03-c01-l02"] a')).toHaveAttribute('href',url);
 await page.goto(url);
 await expect(page.getByRole('heading',{level:1,name:'Voiced hiragana words — keys, maps and picture cards'})).toBeVisible();
 await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
 const quiz=page.locator('section[aria-labelledby="voiced-vocab-practice"]');
 await expect(quiz.locator('fieldset')).toHaveCount(10);
 const submit=quiz.getByRole('button',{name:'Check all ten answers'});
 await expect(submit).toBeDisabled();
 for(const field of await quiz.locator('fieldset').all())await field.locator('input[type=radio]').first().check();
 await submit.click();
 await expect(quiz.getByText(/Written score: \d+\/10/)).toBeVisible();
 await quiz.getByRole('button',{name:'Try the questions again'}).click();
 await expect(submit).toBeDisabled();
});
for(const width of [320,375,768,1440]){
 test('keyboard and responsive at '+width,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto(url);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
  await page.locator('html').evaluate(el=>{el.dataset.theme='dark'});
  const radio=page.locator('section[aria-labelledby="voiced-vocab-practice"] input[type=radio]').first();
  await radio.focus();await page.keyboard.press('Space');await expect(radio).toBeChecked();
 });
}
