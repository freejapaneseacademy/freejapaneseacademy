import { test, expect } from '@playwright/test';
const path='/learn/start/module-01/chapter-03/lesson-05/';
test('Chapter 03 L05 caption evidence scores and retries',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{level:1,name:/Read the rhythm/})).toBeVisible();
 const quiz=page.locator('section[aria-labelledby="sound-reading-title"]');
 await expect(quiz.locator('[data-question-id]')).toHaveCount(12);
 const check=quiz.getByRole('button',{name:'Check answers and save reading score'});
 await expect(check).toBeDisabled();
 const answers=['A','B','C','D','E','F','G','H','A','C','G','H'];
 for(let i=0;i<answers.length;i++)await quiz.locator('[data-question-id]').nth(i).getByRole('radio',{name:answers[i],exact:true}).check();
 await expect(check).toBeEnabled();
 await check.click();
 await expect(quiz.getByRole('heading',{name:'12 / 12 correct'})).toBeVisible();
 await expect(quiz.locator('.foundation-feedback')).toHaveCount(12);
 await quiz.getByRole('button',{name:'Try again'}).click();
 await expect(check).toBeDisabled();
});
for(const width of [320,375,390,768,1024]){
 test('Chapter 03 L05 mobile/dark/keyboard '+width,async({page})=>{
  await page.setViewportSize({width,height:850});
  await page.goto(path);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
  await page.locator('html').evaluate(node=>{node.dataset.theme='dark'});
  const first=page.locator('[data-question-id]').first().getByRole('radio',{name:'A'});
  await first.focus();await page.keyboard.press('Space');
  await expect(first).toBeChecked();
 });
}
