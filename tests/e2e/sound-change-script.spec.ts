import { test, expect } from '@playwright/test';
const path='/learn/start/module-01/chapter-03/lesson-04/';
test('Chapter 03 L04 kana typing gives evidence-based feedback and local score',async({page})=>{
 await page.goto(path);
 await expect(page.getByRole('heading',{level:1,name:/Write the rhythm/})).toBeVisible();
 const quiz=page.locator('section[aria-labelledby="sound-script-title"]');
 await expect(quiz.locator('[data-question-id]')).toHaveCount(12);
 const check=quiz.getByRole('button',{name:'Check kana and save written score'});
 await expect(check).toBeDisabled();
 const answers=['おばあさん','おばさん','さっか','さか','きって','ほん','さんぽ','こうこう','コーヒー','つ','っ','ん'];
 for(let i=0;i<answers.length;i++)await quiz.locator('input[type=text]').nth(i).fill(answers[i]);
 await expect(check).toBeEnabled();
 await check.click();
 await expect(quiz.getByRole('heading',{name:'12 / 12 correct'})).toBeVisible();
 await expect(quiz.locator('.foundation-feedback')).toHaveCount(12);
 await quiz.getByRole('button',{name:'Try again'}).click();
 await expect(check).toBeDisabled();
});
for(const width of [320,375,390,768,1024]){
 test('L04 responsive and keyboard input at '+width,async({page})=>{
  await page.setViewportSize({width,height:850});
  await page.goto(path);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
  await page.locator('html').evaluate(node=>{node.dataset.theme='dark';});
  const input=page.locator('#l04-q01');
  await input.focus();await page.keyboard.type('test');
  await expect(input).toHaveValue('test');
 });
}
